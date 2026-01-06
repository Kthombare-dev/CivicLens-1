const nodemailer = require('nodemailer');
const config = require('../config/env');

/**
 * Email service for sending password reset OTPs
 * Uses Nodemailer with SMTP configuration
 */

/**
 * Create and configure nodemailer transporter
 */
const createTransporter = () => {
    return nodemailer.createTransport({
        host: config.EMAIL_HOST,
        port: parseInt(config.EMAIL_PORT),
        secure: false, // true for 465, false for other ports
        auth: {
            user: config.EMAIL_USER,
            pass: config.EMAIL_PASSWORD,
        },
        // For Gmail, you may need to enable "Less secure app access" 
        // or use an "App Password" if 2FA is enabled
    });
};

/**
 * Send password reset OTP email
 * @param {string} email - Recipient email address
 * @param {string} name - Recipient name
 * @param {string} otp - 6-digit OTP code
 * @returns {Promise<void>}
 */
const sendPasswordResetOTP = async (email, name, otp) => {
    try {
        // Check if email credentials are configured
        if (!config.EMAIL_USER || !config.EMAIL_PASSWORD) {
            console.warn('Email credentials not configured. OTP email not sent.');
            console.log(`[DEV MODE] Password Reset OTP for ${email}: ${otp}`);
            return;
        }

        const transporter = createTransporter();

        // Email template
        const mailOptions = {
            from: config.EMAIL_FROM,
            to: email,
            subject: 'Password Reset OTP - CivicLens',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            line-height: 1.6;
                            color: #333;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            padding: 20px;
                            background-color: #f9f9f9;
                        }
                        .content {
                            background-color: white;
                            padding: 30px;
                            border-radius: 8px;
                            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                        }
                        .header {
                            text-align: center;
                            color: #2563eb;
                            margin-bottom: 30px;
                        }
                        .otp-box {
                            background-color: #f3f4f6;
                            border: 2px dashed #2563eb;
                            border-radius: 8px;
                            padding: 20px;
                            text-align: center;
                            margin: 30px 0;
                        }
                        .otp-code {
                            font-size: 32px;
                            font-weight: bold;
                            color: #2563eb;
                            letter-spacing: 8px;
                            margin: 10px 0;
                        }
                        .warning {
                            background-color: #fef3c7;
                            border-left: 4px solid #f59e0b;
                            padding: 15px;
                            margin: 20px 0;
                        }
                        .footer {
                            text-align: center;
                            margin-top: 30px;
                            font-size: 12px;
                            color: #666;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="content">
                            <div class="header">
                                <h1>🔐 Password Reset Request</h1>
                            </div>
                            
                            <p>Hello <strong>${name}</strong>,</p>
                            
                            <p>We received a request to reset your password for your CivicLens account. Use the OTP code below to complete the password reset process:</p>
                            
                            <div class="otp-box">
                                <p style="margin: 0; color: #666; font-size: 14px;">Your OTP Code</p>
                                <div class="otp-code">${otp}</div>
                                <p style="margin: 0; color: #666; font-size: 12px;">Valid for 15 minutes</p>
                            </div>
                            
                            <div class="warning">
                                <p style="margin: 0;"><strong>⚠️ Security Notice:</strong></p>
                                <ul style="margin: 10px 0 0 0; padding-left: 20px;">
                                    <li>This OTP will expire in 15 minutes</li>
                                    <li>Never share this code with anyone</li>
                                    <li>CivicLens staff will never ask for your OTP</li>
                                </ul>
                            </div>
                            
                            <p>If you didn't request a password reset, please ignore this email or contact support if you have concerns.</p>
                            
                            <p>Best regards,<br><strong>The CivicLens Team</strong></p>
                            
                            <div class="footer">
                                <p>This is an automated email. Please do not reply to this message.</p>
                                <p>&copy; ${new Date().getFullYear()} CivicLens. All rights reserved.</p>
                            </div>
                        </div>
                    </div>
                </body>
                </html>
            `,
            text: `
Hello ${name},

We received a request to reset your password for your CivicLens account.

Your OTP Code: ${otp}
(Valid for 15 minutes)

If you didn't request a password reset, please ignore this email.

Best regards,
The CivicLens Team
            `
        };

        // Send email
        await transporter.sendMail(mailOptions);
        console.log(`Password reset OTP email sent successfully to ${email}`);
    } catch (error) {
        console.error('Error sending password reset email:', error.message);
        // Log but don't throw - we don't want to reveal email sending failures to users
        // In production, you might want to use a proper logging service
        throw new Error('Failed to send password reset email');
    }
};

module.exports = {
    sendPasswordResetOTP
};

