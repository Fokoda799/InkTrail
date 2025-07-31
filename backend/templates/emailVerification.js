export const html = (user, verificationToken) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Verify Your InkTrail Account</title>
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
            margin: 0;
            padding: 0;
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
            padding: 40px 30px;
            text-align: center;
            position: relative;
        }
        
        .header::before {
            content: '';
            position: absolute;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="75" cy="75" r="1" fill="rgba(255,255,255,0.1)"/><circle cx="50" cy="10" r="0.5" fill="rgba(255,255,255,0.05)"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
            opacity: 0.3;
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
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 24px;
            font-weight: 600;
            color: #111827;
            margin-bottom: 16px;
        }
        
        .message {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 32px;
            line-height: 1.7;
        }
        
        .verification-section {
            background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
            border-radius: 12px;
            padding: 32px;
            text-align: center;
            margin-bottom: 32px;
            border: 1px solid #fbbf24;
        }
        
        .verification-title {
            font-size: 18px;
            font-weight: 600;
            color: #92400e;
            margin-bottom: 16px;
        }
        
        .verification-code {
            font-size: 32px;
            font-weight: 700;
            color: #92400e;
            letter-spacing: 8px;
            font-family: 'Courier New', monospace;
            background-color: #ffffff;
            padding: 16px 24px;
            border-radius: 8px;
            display: inline-block;
            margin-bottom: 16px;
            border: 2px solid #f59e0b;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        }
        
        .code-instructions {
            font-size: 14px;
            color: #92400e;
            margin-bottom: 20px;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 14px 32px;
            border-radius: 8px;
            font-weight: 600;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
        }
        
        .security-notice {
            background-color: #f3f4f6;
            border-left: 4px solid #6b7280;
            padding: 20px;
            margin: 32px 0;
            border-radius: 0 8px 8px 0;
        }
        
        .security-title {
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
            font-size: 14px;
        }
        
        .security-text {
            font-size: 14px;
            color: #6b7280;
            line-height: 1.6;
        }
        
        .footer {
            background-color: #f9fafb;
            padding: 30px;
            text-align: center;
            border-top: 1px solid #e5e7eb;
        }
        
        .footer-text {
            font-size: 14px;
            color: #9ca3af;
            margin-bottom: 16px;
        }
        
        .social-links {
            margin-bottom: 20px;
        }
        
        .social-link {
            display: inline-block;
            margin: 0 8px;
            color: #6b7280;
            text-decoration: none;
            font-size: 14px;
            padding: 8px 12px;
            border-radius: 6px;
            transition: all 0.3s ease;
        }
        
        .social-link:hover {
            background-color: #e5e7eb;
            color: #374151;
        }
        
        .unsubscribe {
            font-size: 12px;
            color: #9ca3af;
        }
        
        .unsubscribe a {
            color: #6b7280;
            text-decoration: none;
        }
        
        /* Mobile responsiveness */
        @media only screen and (max-width: 600px) {
            .email-container {
                margin: 0;
                border-radius: 0;
            }
            
            .header {
                padding: 30px 20px;
            }
            
            .content {
                padding: 30px 20px;
            }
            
            .verification-section {
                padding: 24px 16px;
            }
            
            .verification-code {
                font-size: 24px;
                letter-spacing: 4px;
                padding: 12px 16px;
            }
            
            .footer {
                padding: 20px;
            }
        }
        
        /* Dark mode support */
        @media (prefers-color-scheme: dark) {
            .email-container {
                background-color: #1f2937;
            }
            
            .content {
                color: #e5e7eb;
            }
            
            .greeting {
                color: #f9fafb;
            }
            
            .message {
                color: #d1d5db;
            }
            
            .footer {
                background-color: #111827;
                border-top-color: #374151;
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
                <h1 class="logo-text">InkTrail</h1>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <h2 class="greeting">Welcome to InkTrail, ${user.username}! 🎉</h2>

            <p class="message">
                Thank you for joining our community of passionate writers and storytellers. 
                To complete your account setup and start sharing your amazing stories, 
                please verify your email address using the code below.
            </p>
            
            <!-- Verification Section -->
            <div class="verification-section">
                <h3 class="verification-title">Your Verification Code</h3>
                <div class="verification-code">${verificationToken}</div>
                <p class="code-instructions">
                    Enter this 6-digit code in the verification page to activate your account.
                    <br><strong>This code expires in 10 minutes.</strong>
                </p>
            </div>
            
            <!-- Security Notice -->
            <div class="security-notice">
                <div class="security-title">🔒 Security Notice</div>
                <p class="security-text">
                    If you didn't create an InkTrail account, please ignore this email. 
                    Your email address will not be used for any further communications, 
                    and no account has been created.
                </p>
            </div>
            
            <p class="message">
                Once verified, you'll be able to:
            </p>
            <ul style="color: #6b7280; margin-left: 20px; margin-bottom: 24px;">
                <li style="margin-bottom: 8px;">✍️ Create and publish your stories</li>
                <li style="margin-bottom: 8px;">📚 Discover amazing content from other writers</li>
                <li style="margin-bottom: 8px;">💬 Connect with a vibrant writing community</li>
                <li style="margin-bottom: 8px;">📈 Track your writing progress and analytics</li>
            </ul>
            
            <p class="message">
                Need help? Our support team is here for you. Simply reply to this email 
                or visit our <a href="#" style="color: #f59e0b; text-decoration: none;">Help Center</a>.
            </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">
                Happy writing!<br>
                <strong>The InkTrail Team</strong>
            </p>
            
            <div class="social-links">
                <a href="#" class="social-link">Help Center</a>
                <a href="#" class="social-link">Community</a>
                <a href="#" class="social-link">Blog</a>
                <a href="#" class="social-link">Contact</a>
            </div>
            
            <div class="unsubscribe">
                <p>
                    InkTrail, Inc. | 123 Writing Street, Story City, SC 12345<br>
                    <a href="#">Unsubscribe</a> | <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `;

// Alternative plain text version for email clients that don't support HTML
export const createVerificationEmailPlainText = (user, verificationToken) => {
  return `
Welcome to InkTrail, ${user.username}!

Thank you for joining our community of passionate writers and storytellers.

To complete your account setup, please verify your email address using this code:

VERIFICATION CODE: ${verificationToken}

This code expires in 10 minutes.

Once verified, you'll be able to:
- Create and publish your stories
- Discover amazing content from other writers  
- Connect with a vibrant writing community
- Track your writing progress and analytics

If you didn't create an InkTrail account, please ignore this email.

Need help? Simply reply to this email or visit our Help Center.

Happy writing!
The InkTrail Team

---
InkTrail, Inc.
123 Writing Street, Story City, SC 12345
Unsubscribe: [link]
Privacy Policy: [link]
Terms of Service: [link]
  `};