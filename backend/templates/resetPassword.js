export const createResetPasswordEmail = (WEBSITE_URL, RESET_LINK, USER_NAME,USER_EMAIL) => `
  <!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Reset Your InkTrail Password</title>
    <style>
        /* Reset styles */
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #374151;
            background-color: #f9fafb;
        }
        
        .email-container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }
        
        .header {
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            padding: 40px 32px;
            text-align: center;
            color: white;
        }
        
        .logo {
            width: 64px;
            height: 64px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            margin: 0 auto 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 32px;
        }
        
        .header h1 {
            font-size: 28px;
            font-weight: 700;
            margin-bottom: 8px;
        }
        
        .header p {
            font-size: 16px;
            opacity: 0.9;
        }
        
        .content {
            padding: 40px 32px;
        }
        
        .greeting {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 24px;
        }
        
        .message {
            font-size: 16px;
            line-height: 1.7;
            color: #4b5563;
            margin-bottom: 32px;
        }
        
        .c {
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            border-radius: 6px;
            display: flex;
            align-items: center;
            justify-content: center;
            flex-shrink: 0;
            margin-top: 2px;
        }
        
        .reset-button {
            display: inline-block;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            color: white;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 600;
            font-size: 16px;
            text-align: center;
            margin: 16px 0 32px;
            transition: all 0.2s ease;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }
        
        .reset-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
        }
        
        .alternative-link {
            background-color: #f9fafb;
            border: 2px dashed #d1d5db;
            border-radius: 8px;
            padding: 16px;
            margin: 24px 0;
            word-break: break-all;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 14px;
            color: #6b7280;
        }
        
        .security-notice {
            background-color: #fef3c7;
            border-left: 4px solid #f59e0b;
            padding: 16px;
            margin: 24px 0;
            border-radius: 8px;
        }
        
        .security-notice h3 {
            color: #92400e;
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 8px;
        }
        
        .security-notice p {
            color: #a16207;
            font-size: 14px;
            line-height: 1.5;
        }
        
        .footer {
            background-color: #f9fafb;
            padding: 32px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-content {
            margin-bottom: 24px;
        }
        
        .footer-links {
            margin: 16px 0;
        }
        
        .footer-links a {
            color: #f59e0b;
            text-decoration: none;
            margin: 0 12px;
            font-size: 14px;
        }
        
        .footer-links a:hover {
            text-decoration: underline;
        }
        
        .footer-text {
            font-size: 12px;
            color: #6b7280;
            line-height: 1.5;
        }
        
        .social-links {
            margin: 16px 0;
        }
        
        .social-links a {
            display: inline-block;
            margin: 0 8px;
            padding: 8px;
            background-color: #f3f4f6;
            border-radius: 8px;
            text-decoration: none;
            color: #6b7280;
            transition: all 0.2s ease;
        }
        
        .social-links a:hover {
            background-color: #f59e0b;
            color: white;
        }
        
        .logo {
            position: relative;
            z-index: 1;
        }
        
        .logo-icon {
            width: 60px;
            height: 60px;
            background-color: rgba(255, 255, 255, 0.2);
            border-radius: 16px;
            display: inline-flex;
            align-items: center;
            justify-content: center;
            margin-bottom: 16px;
            backdrop-filter: blur(10px);
        }
        
        .logo-text {
            color: #ffffff;
            font-size: 28px;
            font-weight: 700;
            margin: 0;
            text-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        
        /* Responsive design */
        @media (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .header, .content, .footer {
                padding: 24px 20px;
            }
            
            .header h1 {
                font-size: 24px;
            }
            
            .reset-button {
                display: block;
                width: 100%;
                text-align: center;
            }
        }
    </style>
</head>
<body>
    <div class="email-container">
        <!-- Header -->
        <div class="header">
            <div class="logo">
                <div class="logo-icon">
                    <img src="https://firebasestorage.googleapis.com/v0/b/blogify-auth-893b7.appspot.com/o/logo%2Ficon.png?alt=media&token=d127ac3d-1d30-4960-b66f-6d8c5f24f79b" alt="InkTrail Logo" style="width: 100%; height: 100%;">
                </div>
            </div>
            <h1>Password Reset Request</h1>
            <p>Secure your InkTrail account</p>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <div class="greeting">Hello ${USER_NAME},</div>
            
            <div class="message">
                <p>We received a request to reset the password for your InkTrail account associated with <strong>${USER_EMAIL}</strong>.</p>
                
                <p>If you made this request, click the button below to reset your password. This link will expire in <strong>15 minutes</strong> for security reasons.</p>
            </div>
            
            <!-- Reset Button -->
            <div style="text-align: center;">
                <a href="${RESET_LINK}" class="reset-button">
                    🔐 Reset My Password
                </a>
            </div>
            
            <!-- Alternative Link -->
            <p style="font-size: 14px; color: #6b7280; margin-bottom: 16px;">
                If the button doesn't work, copy and paste this link into your browser:
            </p>
            <div class="alternative-link">
                ${RESET_LINK}
            </div>
            
            <!-- Security Notice -->
            <div class="security-notice">
                <h3>🛡️ Security Notice</h3>
                <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged. For additional security, consider enabling two-factor authentication on your account.</p>
            </div>
            
            <div class="message">
                <p>If you're having trouble or didn't request this reset, please contact our support team immediately.</p>
                
                <p>Best regards,<br>
                <strong>The InkTrail Team</strong></p>
            </div>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <div class="footer-content">
                <div style="margin-bottom: 16px;">
                    <strong style="color: #111827;">InkTrail</strong><br>
                    <span style="color: #6b7280;">Your Personal Writing Companion</span>
                </div>
                
                <div class="footer-links">
                    <a href="${WEBSITE_URL}">Visit InkTrail</a>
                    <a href="${WEBSITE_URL}/privacy-policy">Privacy Policy</a>
                    <a href="${WEBSITE_URL}/terms-of-service">Terms of Service</a>
                </div>
                
                <div class="social-links">
                    <a href="#" title="Twitter">🐦</a>
                    <a href="#" title="Facebook">📘</a>
                    <a href="#" title="Instagram">📷</a>
                    <a href="#" title="LinkedIn">💼</a>
                </div>
            </div>
            
            <div class="footer-text">
                <p>This email was sent to {{USER_EMAIL}} because you requested a password reset for your InkTrail account.</p>
                <p style="margin-top: 8px;">© 2025 InkTrail. All rights reserved.</p>
                <p style="margin-top: 8px;">
                    <a href="" style="color: #6b7280; text-decoration: none;">Unsubscribe</a> | 
                    <a href="" style="color: #6b7280; text-decoration: none;">Contact Us</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
`