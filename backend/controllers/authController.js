import User from '../models/userModel.js';
import sendToken from '../utils/jwtToken.js';

class AuthController {
    static async connectUser(req, res) {
        try {
            // Get authorization header from request
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Basic ')) {
                return res.status(401).json({ message: 'Unauthorized' });
            }

            // Extract and decode Base64 credentials (email:password)
            const base64Credentials = authHeader.split(' ')[1];
            const credentials = Buffer.from(base64Credentials, 'base64').toString('utf-8');
            const [email, password] = credentials.split(':');

            // Ensure both email and password exist
            if (!email || !password) {
                return res.status(400).json({ message: 'Invalid credentials format' });
            }

            // Find user by email
            const user = await User.findOne({ email }).select('+password').populate('blogs',
                'title content image category tags isPublished claps comments'
            );
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            // Compare password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid password' });
            }

            // Send token
            sendToken(user, 200, res);
        } catch (error) {
            console.error('Error during user connection:', error);
            return res.status(500).json({ message: error.message });
        }
    }

    // @desc    Disconnect the user
    // @route   POST /logout
    // @access  User
    static async disconnectUser(req, res) {
        try {
            res.cookie('token', '', {
                expires: new Date(0),
                httpOnly: true,
                secure: process.env.NODE_ENV === 'production', // Only use secure cookies in production
                sameSite: 'Strict' // Add sameSite attribute for additional security
            });

            return res.status(200).json({ message: "Logged out" });
        } catch (error) {
            console.error('Error during user disconnect:', error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    static async signinWithGoogle(req, res) {
        try {
            const { username, email, avatar } = req.body;
            let user = await User.findOne({ email }).populate('blogs',
                'title content image category tags isPublished claps comments'
            );

            if (user) {
                sendToken(user, 200, res);
            } else {
                user = await User.create({
                    username,
                    email,
                    avatar,
                })
                sendToken(user, 200, res);
            }
        } catch (error) {
            console.error('Error during Google sign-in:', error);
            return res.status(500).json({ message: error.message });
        }
    }

    static updatePassword = async (req, res) => {
        try {
            const { currentPassword, newPassword } = req.body;
            const user = await User.findById(req.user.id);
            if (!user) return res.status(404).json({
                success: false,
                message: 'User not found'
            });

            const isMatch = await user.comparePassword(currentPassword);
            if (!isMatch) return res.status(400).json({
                success: false,
                message: 'Invalid password'
            });
            const updatedUser = await user.updatePassword(newPassword);
            if (!updatedUser) return res.status(400).json({
                success: false,
                message: 'Password update failed: ' + error.message
            });

            sendToken(updatedUser, 200, res);
        } catch (error) {
            console.error('Error during password update:', error);
            return res.status(500).json({ message: error.message });
        }
    }

    // @desc    Request password reset
    // @route   POST /forgot-password
    // @access  Public
    static async forgotPassword(req, res) {
        const { email } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) return res.status(404).json({ message: 'No user found with this email' });

            // Get reset token
            const resetToken = user.getResetPasswordToken();
            await user.save();

            // Create reset URL
            const resetUrl = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;

            // Send email
            const transporter = nodemailer.createTransport({
                service: 'Gmail',
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                }
            });

            const mailOptions = {
                from: process.env.EMAIL_USER,
                to: email,
                subject: 'Password Reset Request',
                text: `You are receiving this email because you (or someone else) has requested a password reset for your account. Please make a PUT request to:\n\n${resetUrl}`
            };

            await transporter.sendMail(mailOptions);

            res.status(200).json({ message: 'Password reset link sent to your email', user, success: true });
        } catch (error) {
            console.error('Error during password reset request:', error);
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Reset password
    // @route   PUT /reset-password/:token
    // @access  Public
    static async resetPassword(req, res) {
        const resetToken = crypto.createHash('sha256').update(req.params.token).digest('hex');

        try {
            const user = await User.findOne({ resetPasswordToken: resetToken, resetPasswordExpire: { $gt: Date.now() } });
            if (!user) return res.status(400).json({ message: 'Invalid or expired token' });

            user.password = req.body.password;
            await user.updatePassword(req.body.password);

            sendToken(user, 200, res);
        } catch (error) {
            console.error('Error during password reset:', error);
            res.status(500).json({ message: error.message });
        }
    }
}


export default AuthController;
