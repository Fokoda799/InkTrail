import { sendWelcomeEmail } from '../mailtrap/emails.js';
import User from '../models/userModel.js';
import sendToken from '../utils/jwtToken.js';

class AuthController {
    static async connectUser(req, res) {
        const { email, password } = req.body;
        try {
            const user = await User.findOne({ email }).populate('blogs', 'title content image');
            if (!user) {
                return res.status(400).json({ success: false, message: "Invalid credentials" });
            }
            
            const isMatch = await user.comparePassword(password);
            if (!isMatch) return res.status(400).json({ success: false, message: "Invalid password`" });

            user.lastLogin = new Date();
            await user.save();

            sendToken(user, 200, res);
        } catch (error) {
            console.log("Error in login ", error);
            res.status(400).json({ success: false, message: error.message });
        }
    };

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

                user.lastLogin = new Date();
                user.isVerified = true;
                user.verficationToken = undefined;
                user.verficationTokenExpiresAt = undefined;
                await user.save();

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
    };

    // @desc    Verify email
    // @route   POST /verify-email
    // @access  Public
    static async verifyEmail(req, res) {
        const { code } = req.body;
        console.log("code", code);
        try {
            const user = await User.findOne({
                verificationToken: code,
                verificationTokenExpiresAt: { $gt: Date.now() },
            }).populate('blogs', 'title content image');

            console.log(Date.now());
    
            if (!user) {
                return res.status(400).json({ success: false, message: "Invalid or expired verification code" });
            }
    
            user.isVerified = true;
            user.verficationToken = undefined;
            user.verficationTokenExpire = undefined;
            await user.save();
    
            await sendWelcomeEmail(user.email, user.name);
    
            res.status(200).json({
                success: true,
                user: {
                    ...user._doc,
                    password: undefined,
                },
            });
        } catch (error) {
            console.log("error in verifyEmail ", error);
            res.status(500).json({ success: false, message: "Server error" });
        }
    };

    static checkAuth = async (req, res) => {
        try {
            const user = await User.findById(req.user.id).select('-password').
                populate('blogs', 'title content image');
            if (!user) return res.status(404).json({ message: 'User not found' });
            res.status(200).json({success: true, user});
        } catch (error) {
            console.error('Error during user check:', error);
            res.status(500).json({ message: error.message });
        }
    };

}


export default AuthController;
