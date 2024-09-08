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
            const user = await User.findOne({ email }).select('+password');
            if (!user) {
                return res.status(400).json({ message: 'User not found' });
            }

            // Compare password
            const isMatch = await user.comparePassword(password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid credentials' });
            }

            // Send token
            sendToken(user, 200, res);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    // @desc    Disconnect the user
    // @route   POST /logout
    // @access  User
    static async disconnectUser(req, res) {
        try {
            res.cookie('token', null, {
                expires: new Date(Date.now()),
                httpOnly: true,
            })

            return res.status(200).json({ message: "Logged out" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default AuthController;
