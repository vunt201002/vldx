import { OAuth2Client } from 'google-auth-library';
import validator from 'validator';
import crypto from 'crypto';
import Customer, { ICustomer } from '../models/Customer';
import { generateTokenPair } from '../utils/jwt';
import {
  sendVerificationEmail,
  sendPasswordResetEmail,
  sendWelcomeEmail,
} from './emailService';
import { config } from '../config/env';

const googleClient = new OAuth2Client(config.googleClientId);

/**
 * Validate password strength
 * @param password - Password to validate
 * @throws Error if password doesn't meet requirements
 */
function validatePassword(password: string): void {
  if (password.length < 8) {
    throw new Error('Password must be at least 8 characters long');
  }
  if (!/[A-Z]/.test(password)) {
    throw new Error('Password must contain at least one uppercase letter');
  }
  if (!/[a-z]/.test(password)) {
    throw new Error('Password must contain at least one lowercase letter');
  }
  if (!/[0-9]/.test(password)) {
    throw new Error('Password must contain at least one number');
  }
}

/**
 * Register a new customer with email and password
 * @param email - Customer email
 * @param password - Customer password
 * @param firstName - Customer first name
 * @param lastName - Customer last name
 * @returns Created customer and verification token (for testing)
 */
export async function registerWithEmail(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{ customer: ICustomer; verificationToken: string }> {
  // Validate email format
  if (!validator.isEmail(email)) {
    throw new Error('Invalid email format');
  }

  // Validate password strength
  validatePassword(password);

  // Check if customer already exists
  const existingCustomer = await Customer.findOne({ email: email.toLowerCase() });
  if (existingCustomer) {
    throw new Error('Email already registered');
  }

  // Create new customer
  const customer = new Customer({
    email: email.toLowerCase(),
    password,
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    isEmailVerified: false,
  });

  // Generate verification token
  const verificationToken = customer.generateVerificationToken();

  // Save customer
  await customer.save();

  // Send verification email (async, don't wait)
  sendVerificationEmail(customer.email, verificationToken, customer.firstName).catch((error) => {
    console.error('Failed to send verification email:', error);
  });

  return { customer, verificationToken };
}

/**
 * Login with email and password
 * @param email - Customer email
 * @param password - Customer password
 * @returns Customer data and JWT tokens
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<{ customer: ICustomer; accessToken: string; refreshToken: string }> {
  // Find customer with password field
  const customer = await Customer.findOne({ email: email.toLowerCase() }).select('+password +refreshTokens');

  if (!customer || !customer.password) {
    throw new Error('Invalid credentials');
  }

  // Verify password
  const isPasswordValid = await customer.comparePassword(password);
  if (!isPasswordValid) {
    throw new Error('Invalid credentials');
  }

  // Check if email is verified (optional - can be enforced later)
  // if (!customer.isEmailVerified) {
  //   throw new Error('Email not verified. Please check your email for verification link.');
  // }

  // Generate JWT tokens
  const { accessToken, refreshToken } = generateTokenPair(customer._id.toString());

  // Store refresh token
  if (!customer.refreshTokens) {
    customer.refreshTokens = [];
  }
  customer.refreshTokens.push(refreshToken);

  // Update last login
  customer.lastLoginAt = new Date();

  await customer.save();

  return {
    customer,
    accessToken,
    refreshToken,
  };
}

/**
 * Login with Google OAuth
 * @param idToken - Google ID token from client
 * @returns Customer data and JWT tokens
 */
export async function loginWithGoogle(
  idToken: string
): Promise<{ customer: ICustomer; accessToken: string; refreshToken: string }> {
  // Verify Google ID token
  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: config.googleClientId,
  });

  const payload = ticket.getPayload();
  if (!payload || !payload.email) {
    throw new Error('Invalid Google token');
  }

  const { email, given_name, family_name, picture, sub: googleId } = payload;

  // Find or create customer
  let customer = await Customer.findOne({
    $or: [{ email: email.toLowerCase() }, { googleId }],
  }).select('+refreshTokens');

  if (!customer) {
    // Create new customer from Google profile
    customer = new Customer({
      email: email.toLowerCase(),
      firstName: given_name || 'User',
      lastName: family_name || '',
      googleId,
      profilePicture: picture,
      isEmailVerified: true, // Google emails are pre-verified
    });
  } else {
    // Update Google ID if not set
    if (!customer.googleId) {
      customer.googleId = googleId;
    }
    // Update profile picture if available
    if (picture && !customer.profilePicture) {
      customer.profilePicture = picture;
    }
  }

  // Generate JWT tokens
  const { accessToken, refreshToken } = generateTokenPair(customer._id.toString());

  // Store refresh token
  if (!customer.refreshTokens) {
    customer.refreshTokens = [];
  }
  customer.refreshTokens.push(refreshToken);

  // Update last login
  customer.lastLoginAt = new Date();

  await customer.save();

  // Send welcome email for new users
  if (customer.isNew) {
    sendWelcomeEmail(customer.email, customer.firstName).catch((error) => {
      console.error('Failed to send welcome email:', error);
    });
  }

  return {
    customer,
    accessToken,
    refreshToken,
  };
}

/**
 * Verify email with token
 * @param token - Verification token from email
 * @returns Verified customer
 */
export async function verifyEmail(token: string): Promise<ICustomer> {
  // Hash the token to match stored hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find customer with this token
  const customer = await Customer.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpires: { $gt: new Date() },
  }).select('+emailVerificationToken +emailVerificationExpires');

  if (!customer) {
    throw new Error('Invalid or expired verification token');
  }

  // Mark email as verified
  customer.isEmailVerified = true;
  customer.emailVerificationToken = undefined;
  customer.emailVerificationExpires = undefined;

  await customer.save();

  // Send welcome email
  sendWelcomeEmail(customer.email, customer.firstName).catch((error) => {
    console.error('Failed to send welcome email:', error);
  });

  return customer;
}

/**
 * Request password reset
 * @param email - Customer email
 */
export async function requestPasswordReset(email: string): Promise<void> {
  const customer = await Customer.findOne({ email: email.toLowerCase() });

  // Don't reveal whether email exists (security best practice)
  if (!customer) {
    // Still return success to prevent email enumeration
    return;
  }

  // Don't allow password reset for Google-only accounts
  if (customer.googleId && !customer.password) {
    // Silently fail - user should use Google login
    return;
  }

  // Generate reset token
  const resetToken = customer.generatePasswordResetToken();

  await customer.save();

  // Send reset email
  try {
    await sendPasswordResetEmail(customer.email, resetToken, customer.firstName);
  } catch (error) {
    console.error('Failed to send password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

/**
 * Reset password with token
 * @param token - Reset token from email
 * @param newPassword - New password
 */
export async function resetPassword(token: string, newPassword: string): Promise<void> {
  // Validate new password
  validatePassword(newPassword);

  // Hash the token to match stored hash
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

  // Find customer with this token
  const customer = await Customer.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: new Date() },
  }).select('+passwordResetToken +passwordResetExpires +refreshTokens');

  if (!customer) {
    throw new Error('Invalid or expired reset token');
  }

  // Update password
  customer.password = newPassword;
  customer.passwordResetToken = undefined;
  customer.passwordResetExpires = undefined;

  // Invalidate all refresh tokens for security
  customer.refreshTokens = [];

  await customer.save();
}

/**
 * Refresh access token using refresh token
 * @param refreshToken - Valid refresh token
 * @returns New access token
 */
export async function refreshAccessToken(refreshToken: string): Promise<{ accessToken: string }> {
  const { verifyRefreshToken } = await import('../utils/jwt');

  // Verify refresh token
  const decoded = verifyRefreshToken(refreshToken);

  // Find customer and check if refresh token exists
  const customer = await Customer.findById(decoded.userId).select('+refreshTokens');

  if (!customer || !customer.refreshTokens?.includes(refreshToken)) {
    throw new Error('Invalid refresh token');
  }

  // Generate new access token
  const { generateAccessToken } = await import('../utils/jwt');
  const accessToken = generateAccessToken(customer._id.toString());

  return { accessToken };
}

/**
 * Logout (invalidate refresh token)
 * @param userId - Customer ID
 * @param refreshToken - Refresh token to invalidate
 */
export async function logout(userId: string, refreshToken: string): Promise<void> {
  const customer = await Customer.findById(userId).select('+refreshTokens');

  if (!customer) {
    throw new Error('Customer not found');
  }

  // Remove refresh token
  if (customer.refreshTokens) {
    customer.refreshTokens = customer.refreshTokens.filter((token) => token !== refreshToken);
    await customer.save();
  }
}

/**
 * Logout from all devices (invalidate all refresh tokens)
 * @param userId - Customer ID
 */
export async function logoutAllDevices(userId: string): Promise<void> {
  const customer = await Customer.findById(userId).select('+refreshTokens');

  if (!customer) {
    throw new Error('Customer not found');
  }

  // Clear all refresh tokens
  customer.refreshTokens = [];
  await customer.save();
}

/**
 * Resend verification email
 * @param email - Customer email
 */
export async function resendVerificationEmail(email: string): Promise<void> {
  const customer = await Customer.findOne({ email: email.toLowerCase() });

  if (!customer) {
    throw new Error('Customer not found');
  }

  if (customer.isEmailVerified) {
    throw new Error('Email already verified');
  }

  // Generate new verification token
  const verificationToken = customer.generateVerificationToken();

  await customer.save();

  // Send verification email
  try {
    await sendVerificationEmail(customer.email, verificationToken, customer.firstName);
  } catch (error) {
    console.error('Failed to send verification email:', error);
    throw new Error('Failed to send verification email');
  }
}
