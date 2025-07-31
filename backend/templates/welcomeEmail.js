export const createWelcomeEmailTemplate = (userName) => {
  return  `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to InkTrail</title>
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
        
        .welcome-badge {
            background-color: rgba(255, 255, 255, 0.2);
            color: #ffffff;
            padding: 8px 16px;
            border-radius: 20px;
            font-size: 14px;
            font-weight: 600;
            margin-top: 16px;
            display: inline-block;
            backdrop-filter: blur(10px);
        }
        
        .content {
            padding: 40px 30px;
        }
        
        .greeting {
            font-size: 28px;
            font-weight: 700;
            color: #111827;
            margin-bottom: 16px;
            text-align: center;
        }
        
        .celebration {
            font-size: 48px;
            text-align: center;
            margin-bottom: 24px;
        }
        
        .message {
            font-size: 16px;
            color: #6b7280;
            margin-bottom: 32px;
            line-height: 1.7;
            text-align: center;
        }
        
        .features-section {
            background: linear-gradient(135deg, #fef3c7 0%, #fed7aa 100%);
            border-radius: 12px;
            padding: 32px;
            margin-bottom: 32px;
            border: 1px solid #fbbf24;
        }
        
        .features-title {
            font-size: 20px;
            font-weight: 700;
            color: #92400e;
            margin-bottom: 20px;
            text-align: center;
        }
        
        .features-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 20px;
            margin-bottom: 24px;
        }
        
        .feature-item {
            display: flex;
            align-items: flex-start;
            gap: 12px;
        }
        
        .feature-icon {
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
        
        .feature-text {
            color: #92400e;
            font-size: 14px;
            font-weight: 500;
            line-height: 1.5;
        }
        
        .cta-section {
            text-align: center;
            margin: 32px 0;
        }
        
        .cta-button {
            display: inline-block;
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            color: #ffffff;
            text-decoration: none;
            padding: 16px 32px;
            border-radius: 12px;
            font-weight: 700;
            font-size: 16px;
            transition: all 0.3s ease;
            box-shadow: 0 4px 12px rgba(245, 158, 11, 0.3);
            margin-bottom: 16px;
        }
        
        .cta-button:hover {
            transform: translateY(-2px);
            box-shadow: 0 6px 20px rgba(245, 158, 11, 0.4);
        }
        
        .cta-subtitle {
            font-size: 14px;
            color: #6b7280;
            margin-top: 8px;
        }
        
        .tips-section {
            background-color: #f3f4f6;
            border-radius: 12px;
            padding: 24px;
            margin: 32px 0;
        }
        
        .tips-title {
            font-weight: 700;
            color: #374151;
            margin-bottom: 16px;
            font-size: 18px;
            text-align: center;
        }
        
        .tips-list {
            list-style: none;
            padding: 0;
        }
        
        .tips-list li {
            padding: 8px 0;
            color: #6b7280;
            font-size: 14px;
            display: flex;
            align-items: flex-start;
            gap: 8px;
        }
        
        .tip-number {
            background: linear-gradient(135deg, #f59e0b 0%, #ea580c 100%);
            color: white;
            width: 20px;
            height: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            font-weight: 600;
            flex-shrink: 0;
            margin-top: 2px;
        }
        
        .community-section {
            background: linear-gradient(135deg, #ede9fe 0%, #ddd6fe 100%);
            border-radius: 12px;
            padding: 24px;
            margin: 32px 0;
            text-align: center;
            border: 1px solid #c4b5fd;
        }
        
        .community-title {
            font-size: 18px;
            font-weight: 700;
            color: #5b21b6;
            margin-bottom: 12px;
        }
        
        .community-text {
            color: #7c3aed;
            font-size: 14px;
            margin-bottom: 16px;
        }
        
        .social-links {
            display: flex;
            justify-content: center;
            gap: 12px;
        }
        
        .social-link {
            background-color: rgba(255, 255, 255, 0.8);
            color: #7c3aed;
            text-decoration: none;
            padding: 8px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 600;
            transition: all 0.3s ease;
        }
        
        .social-link:hover {
            background-color: #ffffff;
            transform: translateY(-1px);
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
        
        .footer-links {
            margin-bottom: 20px;
        }
        
        .footer-link {
            display: inline-block;
            margin: 0 8px;
            color: #6b7280;
            text-decoration: none;
            font-size: 14px;
            padding: 8px 12px;
            border-radius: 6px;
            transition: all 0.3s ease;
        }
        
        .footer-link:hover {
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
            
            .features-grid {
                grid-template-columns: 1fr;
                gap: 16px;
            }
            
            .greeting {
                font-size: 24px;
            }
            
            .celebration {
                font-size: 36px;
            }
            
            .social-links {
                flex-direction: column;
                gap: 8px;
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
                    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="color: white;">
                        <path d="M12 19l7-7 3 3-7 7-3-3z"/>
                        <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
                        <path d="M2 2l7.586 7.586"/>
                        <circle cx="11" cy="11" r="2"/>
                    </svg>
                </div>
                <h1 class="logo-text">InkTrail</h1>
                <div class="welcome-badge">✨ Welcome to the Community</div>
            </div>
        </div>
        
        <!-- Main Content -->
        <div class="content">
            <div class="celebration">🎉✍️🎊</div>
            <h2 class="greeting">Welcome to InkTrail, ${userName}!</h2>
            
            <p class="message">
                Congratulations! Your email has been verified and your account is now active. 
                You're officially part of our vibrant community of passionate writers and storytellers. 
                We're thrilled to have you on this incredible journey!
            </p>
            
            <!-- Features Section -->
            <div class="features-section">
                <h3 class="features-title">🚀 What You Can Do Now</h3>
                <div class="features-grid">
                    <div class="feature-item">
                        <div class="feature-icon">
                            <img src="https://firebasestorage.googleapis.com/v0/b/blogify-auth-893b7.appspot.com/o/logo%2Ficon.png?alt=media&token=d127ac3d-1d30-4960-b66f-6d8c5f24f79b" alt="InkTrail Logo" style="width: 100%; height: 100%;">
                        </div>
                        <span class="feature-text">Create and publish your stories</span>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: white;">
                                <path d="M2 3h6l2 4h9a1 1 0 0 1 1 1v9a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"/>
                            </svg>
                        </div>
                        <span class="feature-text">Discover amazing content</span>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: white;">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                                <circle cx="9" cy="7" r="4"/>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                            </svg>
                        </div>
                        <span class="feature-text">Connect with writers</span>
                    </div>
                    <div class="feature-item">
                        <div class="feature-icon">
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="color: white;">
                                <path d="M18 20V10"/>
                                <path d="M12 20V4"/>
                                <path d="M6 20v-6"/>
                            </svg>
                        </div>
                        <span class="feature-text">Track your progress</span>
                    </div>
                </div>
            </div>
            
            <!-- Call to Action -->
            <div class="cta-section">
                <a href="#" class="cta-button">Start Writing Your First Story</a>
                <p class="cta-subtitle">Your writing journey begins with a single word</p>
            </div>
            
            <!-- Getting Started Tips -->
            <div class="tips-section">
                <h3 class="tips-title">📝 Quick Start Guide</h3>
                <ul class="tips-list">
                    <li>
                        <span class="tip-number">1</span>
                        <span>Complete your profile to help others discover your work</span>
                    </li>
                    <li>
                        <span class="tip-number">2</span>
                        <span>Explore trending stories to get inspired</span>
                    </li>
                    <li>
                        <span class="tip-number">3</span>
                        <span>Follow writers whose work resonates with you</span>
                    </li>
                    <li>
                        <span class="tip-number">4</span>
                        <span>Share your first story and introduce yourself to the community</span>
                    </li>
                </ul>
            </div>
            
            <!-- Community Section -->
            <div class="community-section">
                <h3 class="community-title">🌟 Join Our Community</h3>
                <p class="community-text">
                    Connect with fellow writers, share tips, and get feedback on your work
                </p>
                <div class="social-links">
                    <a href="#" class="social-link">Community Forum</a>
                    <a href="#" class="social-link">Writing Tips</a>
                    <a href="#" class="social-link">Help Center</a>
                </div>
            </div>
            
            <p class="message">
                Remember, every great writer started with a single story. We can't wait to see what amazing tales you'll share with our community. 
                If you have any questions or need help getting started, our support team is always here for you.
            </p>
            
            <p class="message">
                <strong>Happy writing!</strong><br>
                The InkTrail Team 💜
            </p>
        </div>
        
        <!-- Footer -->
        <div class="footer">
            <p class="footer-text">
                <strong>Welcome to the InkTrail family!</strong><br>
                We're excited to see your creativity flourish.
            </p>
            
            <div class="footer-links">
                <a href="#" class="footer-link">Dashboard</a>
                <a href="#" class="footer-link">Writing Guide</a>
                <a href="#" class="footer-link">Community</a>
                <a href="#" class="footer-link">Support</a>
            </div>
            
            <div class="unsubscribe">
                <p>
                    InkTrail, Inc. | 123 Writing Street, Story City, SC 12345<br>
                    <a href="#">Manage Preferences</a> | <a href="#">Privacy Policy</a> | <a href="#">Terms of Service</a>
                </p>
            </div>
        </div>
    </div>
</body>
</html>
    `;
};

// Plain text version for email clients that don't support HTML
export const createWelcomeEmailPlainText = (userName) => {
  return `
Welcome to InkTrail, ${userName}! 🎉

Congratulations! Your email has been verified and your account is now active. You're officially part of our vibrant community of passionate writers and storytellers.

What You Can Do Now:
✍️ Create and publish your stories
📚 Discover amazing content from other writers
👥 Connect with fellow writers
📈 Track your writing progress and analytics

Quick Start Guide:
1. Complete your profile to help others discover your work
2. Explore trending stories to get inspired  
3. Follow writers whose work resonates with you
4. Share your first story and introduce yourself to the community

Join Our Community:
Connect with fellow writers, share tips, and get feedback on your work in our Community Forum.

Remember, every great writer started with a single story. We can't wait to see what amazing tales you'll share with our community.

Start Writing Your First Story: [Dashboard Link]

Happy writing!
The InkTrail Team 💜

---
InkTrail, Inc.
123 Writing Street, Story City, SC 12345
Manage Preferences: [link]
Privacy Policy: [link]
Terms of Service: [link]
  `;
};