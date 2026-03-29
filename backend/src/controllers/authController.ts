import { Request, Response, NextFunction } from 'express';
import * as authService from '../services/authService';
import { verifyRefreshToken } from '../utils/jwt';
import Customer from '../models/Customer';

/**
 * POST /api/auth/register
 * Register a new customer with email/password
 */
export const register = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    if (!email || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: 'Email, password, first name, and last name are required',
      });
    }

    const { customer } = await authService.registerWithEmail(email, password, firstName, lastName);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email to verify your account.',
      data: {
        customer: {
          id: customer._id,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          isEmailVerified: customer.isEmailVerified,
        },
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/login
 * Login with email and password
 */
export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Email and password are required',
      });
    }

    const { customer, accessToken, refreshToken } = await authService.loginWithEmail(email, password);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        customer: {
          id: customer._id,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
          profilePicture: customer.profilePicture,
          isEmailVerified: customer.isEmailVerified,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/google
 * Login with Google OAuth (exchange ID token for JWT)
 */
export const googleLogin = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { idToken } = req.body;

    if (!idToken) {
      return res.status(400).json({
        success: false,
        message: 'Google ID token is required',
      });
    }

    const { customer, accessToken, refreshToken } = await authService.loginWithGoogle(idToken);

    res.json({
      success: true,
      message: 'Login successful',
      data: {
        customer: {
          id: customer._id,
          email: customer.email,
          firstName: customer.firstName,
          lastName: customer.lastName,
          phone: customer.phone,
          profilePicture: customer.profilePicture,
          isEmailVerified: customer.isEmailVerified,
        },
        accessToken,
        refreshToken,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/verify-email
 */
export const verifyEmail = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token } = req.body;

    if (!token) {
      return res.status(400).json({ success: false, message: 'Verification token is required' });
    }

    await authService.verifyEmail(token);

    res.json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/resend-verification
 */
export const resendVerification = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    await authService.resendVerificationEmail(email);

    res.json({ success: true, message: 'Verification email sent' });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/forgot-password
 */
export const forgotPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Email is required' });
    }

    await authService.requestPasswordReset(email);

    // Always return success to prevent email enumeration
    res.json({
      success: true,
      message: 'If an account exists, a password reset link has been sent to your email',
    });
  } catch (err) {
    res.json({
      success: true,
      message: 'If an account exists, a password reset link has been sent to your email',
    });
  }
};

/**
 * POST /api/auth/reset-password
 */
export const resetPassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ success: false, message: 'Token and new password are required' });
    }

    await authService.resetPassword(token, password);

    res.json({ success: true, message: 'Password reset successful' });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/refresh
 */
export const refresh = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    const { accessToken } = await authService.refreshAccessToken(refreshToken);

    res.json({ success: true, data: { accessToken } });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout
 */
export const logout = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    await authService.logout(req.user._id.toString(), refreshToken);

    res.json({ success: true, message: 'Logged out successfully' });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/logout-all
 */
export const logoutAll = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    await authService.logoutAllDevices(req.user._id.toString());

    res.json({ success: true, message: 'Logged out from all devices' });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/me
 */
export const getMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    res.json({
      success: true,
      data: {
        id: req.user._id,
        email: req.user.email,
        firstName: req.user.firstName,
        lastName: req.user.lastName,
        phone: req.user.phone,
        birthday: req.user.birthday,
        profilePicture: req.user.profilePicture,
        favoriteProducts: req.user.favoriteProducts,
        isEmailVerified: req.user.isEmailVerified,
        createdAt: req.user.createdAt,
        lastLoginAt: req.user.lastLoginAt,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/auth/me
 */
export const updateMe = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { firstName, lastName, phone, birthday, profilePicture } = req.body;

    const customer = await Customer.findById(req.user._id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    if (firstName) customer.firstName = firstName.trim();
    if (lastName) customer.lastName = lastName.trim();
    if (phone !== undefined) customer.phone = phone ? phone.trim() : undefined;
    if (birthday !== undefined) customer.birthday = birthday ? new Date(birthday) : undefined;
    if (profilePicture !== undefined) customer.profilePicture = profilePicture;

    await customer.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: customer._id,
        email: customer.email,
        firstName: customer.firstName,
        lastName: customer.lastName,
        phone: customer.phone,
        birthday: customer.birthday,
        profilePicture: customer.profilePicture,
        favoriteProducts: customer.favoriteProducts,
        isEmailVerified: customer.isEmailVerified,
      },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * PUT /api/auth/change-password
 */
export const changePassword = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Current password and new password are required',
      });
    }

    const customer = await Customer.findById(req.user._id).select('+password +refreshTokens');

    if (!customer || !customer.password) {
      return res.status(400).json({
        success: false,
        message: 'Cannot change password for social login accounts',
      });
    }

    const isPasswordValid = await customer.comparePassword(currentPassword);
    if (!isPasswordValid) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect' });
    }

    customer.password = newPassword;
    customer.refreshTokens = [];

    await customer.save();

    res.json({
      success: true,
      message: 'Password changed successfully. Please log in again with your new password.',
    });
  } catch (err) {
    next(err);
  }
};

/**
 * POST /api/auth/favorites/:productId
 * Toggle favorite product
 */
export const toggleFavorite = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const { productId } = req.params;
    const customer = await Customer.findById(req.user._id);

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    const index = customer.favoriteProducts.findIndex(
      (id) => id.toString() === productId,
    );

    let isFavorite: boolean;
    if (index >= 0) {
      customer.favoriteProducts.splice(index, 1);
      isFavorite = false;
    } else {
      customer.favoriteProducts.push(productId as any);
      isFavorite = true;
    }

    await customer.save();

    res.json({
      success: true,
      data: { isFavorite, favoriteProducts: customer.favoriteProducts },
    });
  } catch (err) {
    next(err);
  }
};

/**
 * GET /api/auth/favorites
 * Get favorite products with details
 */
export const getFavorites = async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const customer = await Customer.findById(req.user._id).populate('favoriteProducts');

    if (!customer) {
      return res.status(404).json({ success: false, message: 'Customer not found' });
    }

    res.json({
      success: true,
      data: customer.favoriteProducts,
    });
  } catch (err) {
    next(err);
  }
};
