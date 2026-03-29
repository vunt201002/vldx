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
    subject: 'Xác nhận địa chỉ email của bạn',
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
              <h2>Xin chào ${name}!</h2>
              <p>Cảm ơn bạn đã đăng ký tài khoản tại Bê Tông Việt.</p>
              <p>Vui lòng nhấn vào nút bên dưới để xác nhận địa chỉ email của bạn:</p>
              <div style="text-align: center;">
                <a href="${verificationUrl}" class="button">Xác nhận email</a>
              </div>
              <p>Hoặc copy đường link sau vào trình duyệt:</p>
              <p style="word-break: break-all; color: #666;">${verificationUrl}</p>
              <p><strong>Link này sẽ hết hạn sau 24 giờ.</strong></p>
              <p>Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Bê Tông Việt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Xin chào ${name}!

      Cảm ơn bạn đã đăng ký tài khoản tại Bê Tông Việt.

      Vui lòng nhấn vào link sau để xác nhận địa chỉ email của bạn:
      ${verificationUrl}

      Link này sẽ hết hạn sau 24 giờ.

      Nếu bạn không tạo tài khoản này, vui lòng bỏ qua email này.

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
    subject: 'Đặt lại mật khẩu của bạn',
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
              <h2>Xin chào ${name}!</h2>
              <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.</p>
              <p>Nhấn vào nút bên dưới để tạo mật khẩu mới:</p>
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Đặt lại mật khẩu</a>
              </div>
              <p>Hoặc copy đường link sau vào trình duyệt:</p>
              <p style="word-break: break-all; color: #666;">${resetUrl}</p>
              <div class="warning">
                <strong>⚠️ Link này sẽ hết hạn sau 1 giờ.</strong>
              </div>
              <p><strong>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</strong> Tài khoản của bạn vẫn an toàn.</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Bê Tông Việt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Xin chào ${name}!

      Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản của bạn.

      Nhấn vào link sau để tạo mật khẩu mới:
      ${resetUrl}

      Link này sẽ hết hạn sau 1 giờ.

      Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này. Tài khoản của bạn vẫn an toàn.

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
    subject: 'Chào mừng đến với Bê Tông Việt!',
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
              <h2>Chào mừng ${name}!</h2>
              <p>Chúc mừng bạn đã trở thành thành viên của Bê Tông Việt!</p>
              <p>Bạn có thể bắt đầu khám phá các sản phẩm:</p>
              <div class="feature">
                ✓ Tấm ốp cầu thang cao cấp<br>
                ✓ Gạch ốp lát terrazzo<br>
                ✓ Ghế đá công viên<br>
                ✓ Bàn đá & bê tông<br>
                ✓ Dịch vụ thi công chuyên nghiệp
              </div>
              <div style="text-align: center;">
                <a href="${config.frontendUrl}/landing" class="button">Khám phá sản phẩm</a>
              </div>
              <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi!</p>
              <p>Trân trọng,<br>Đội ngũ Bê Tông Việt</p>
            </div>
            <div class="footer">
              <p>&copy; ${new Date().getFullYear()} Bê Tông Việt. All rights reserved.</p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `
      Chào mừng ${name}!

      Chúc mừng bạn đã trở thành thành viên của Bê Tông Việt!

      Bạn có thể bắt đầu khám phá các sản phẩm:
      ✓ Tấm ốp cầu thang cao cấp
      ✓ Gạch ốp lát terrazzo
      ✓ Ghế đá công viên
      ✓ Bàn đá & bê tông
      ✓ Dịch vụ thi công chuyên nghiệp

      Truy cập: ${config.frontendUrl}/landing

      Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi!

      Trân trọng,
      Đội ngũ Bê Tông Việt

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
