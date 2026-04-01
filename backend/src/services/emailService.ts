import * as nodemailer from 'nodemailer';
import { config } from '../config/env';

// Create reusable transporter
const transporter = nodemailer.createTransport({
  host: config.smtpHost,
  port: config.smtpPort,
  secure: config.smtpPort === 465, // true for 465, false for other ports
  auth: {
    user: config.smtpUser,
    pass: config.smtpPassword,
  },
});

/**
 * Send email verification email
 * @param email - Recipient email address
 * @param token - Verification token (plain, not hashed)
 * @param name - Customer's first name
 */
export async function sendVerificationEmail(
  email: string,
  token: string,
  name: string
): Promise<void> {
  const verificationUrl = `${config.frontendUrl}/verify-email?token=${token}`;

  const mailOptions = {
    from: `"Bê Tông Việt" <${config.emailFrom}>`,
    to: email,
    subject: 'Verify Your Email Address',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f7e2ce; padding: 20px; text-align: center; }
            .content { background-color: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .button { display: inline-block; padding: 12px 30px; background-color: #1d1d1d; color: #ffffff !important; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; color: #1d1d1d;">Bê Tông Việt</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>Thank you for creating an account with Bê Tông Việt.</p>
              <p>Please click the button below to verify your email address:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Verify Email</a>
              </div>
              <p>Or copy and paste the following link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
              <p><strong>This link will expire in 24 hours.</strong></p>
              <p>If you did not create this account, please ignore this email.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Bê Tông Việt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Hello ${name}!

      Thank you for creating an account with Bê Tông Việt.

      Please click the following link to verify your email address:
      ${verificationUrl}

      This link will expire in 24 hours.

      If you did not create this account, please ignore this email.

      © ${new Date().getFullYear()} Bê Tông Việt. All rights reserved.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Verification email sent to ${email}`);
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw new Error('Failed to send verification email');
  }
}

/**
 * Send password reset email
 * @param email - Recipient email address
 * @param token - Password reset token (plain, not hashed)
 * @param name - Customer's first name
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string,
  name: string
): Promise<void> {
  const resetUrl = `${config.frontendUrl}/reset-password?token=${token}`;

  const mailOptions = {
    from: `"Bê Tông Việt" <${config.emailFrom}>`,
    to: email,
    subject: 'Reset Your Password',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f7e2ce; padding: 20px; text-align: center; }
            .content { background-color: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .button { display: inline-block; padding: 12px 30px; background-color: #1d1d1d; color: #ffffff !important; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .warning { background-color: #fff3cd; border-left: 4px solid #ffc107; padding: 10px; margin: 15px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; color: #1d1d1d;">Bê Tông Việt</h1>
            </div>
            <div class="content">
              <h2>Hello ${name}!</h2>
              <p>We received a request to reset your account password.</p>
              <p>Click the button below to create a new password:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Reset Password</a>
              </div>
              <p>Or copy and paste the following link into your browser:</p>
              <p style="word-break: break-all; color: #666;">${resetUrl}</p>
              <div class="warning">
                <strong>⚠️ This link will expire in 1 hour.</strong>
              </div>
              <p><strong>If you did not request a password reset, please ignore this email.</strong> Your account is safe.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Bê Tông Việt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Hello ${name}!

      We received a request to reset your account password.

      Click the following link to create a new password:
      ${resetUrl}

      This link will expire in 1 hour.

      If you did not request a password reset, please ignore this email. Your account is safe.

      © ${new Date().getFullYear()} Bê Tông Việt. All rights reserved.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Password reset email sent to ${email}`);
  } catch (error) {
    console.error('Error sending password reset email:', error);
    throw new Error('Failed to send password reset email');
  }
}

/**
 * Send welcome email after successful registration and verification
 * @param email - Recipient email address
 * @param name - Customer's first name
 */
export async function sendWelcomeEmail(
  email: string,
  name: string
): Promise<void> {
  const mailOptions = {
    from: `"Bê Tông Việt" <${config.emailFrom}>`,
    to: email,
    subject: 'Welcome to Bê Tông Việt!',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background-color: #f7e2ce; padding: 20px; text-align: center; }
            .content { background-color: #ffffff; padding: 30px; border: 1px solid #e0e0e0; }
            .button { display: inline-block; padding: 12px 30px; background-color: #1d1d1d; color: #ffffff !important; text-decoration: none; border-radius: 4px; margin: 20px 0; }
            .footer { text-align: center; padding: 20px; font-size: 12px; color: #666; }
            .feature { margin: 15px 0; padding-left: 20px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1 style="margin: 0; color: #1d1d1d;">Bê Tông Việt</h1>
            </div>
            <div class="content">
              <h2>Welcome ${name}!</h2>
              <p>Congratulations on becoming a member of Bê Tông Việt!</p>
              <p>Start exploring our products:</p>
              <div class="feature">
                ✓ Premium stair cladding panels<br>
                ✓ Terrazzo tiles<br>
                ✓ Stone park benches<br>
                ✓ Stone & concrete tables<br>
                ✓ Professional construction services
              </div>
              <div style="text-align: center;">
                <a href="${config.frontendUrl}/landing" class="button">Explore Products</a>
              </div>
              <p>If you have any questions, don't hesitate to contact us!</p>
              <p>Best regards,<br>The Bê Tông Việt Team</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Bê Tông Việt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Welcome ${name}!

      Congratulations on becoming a member of Bê Tông Việt!

      Start exploring our products:
      ✓ Premium stair cladding panels
      ✓ Terrazzo tiles
      ✓ Stone park benches
      ✓ Stone & concrete tables
      ✓ Professional construction services

      Visit: ${config.frontendUrl}/landing

      If you have any questions, don't hesitate to contact us!

      Best regards,
      The Bê Tông Việt Team

      © ${new Date().getFullYear()} Bê Tông Việt. All rights reserved.
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Welcome email sent to ${email}`);
  } catch (error) {
    console.error('Error sending welcome email:', error);
    // Don't throw error for welcome email - it's not critical
  }
}
