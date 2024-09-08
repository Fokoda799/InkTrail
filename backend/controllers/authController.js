import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

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

            // Create JWT payload
            const payload = { user: { id: user._id } };

            // Generate token
            const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
            if (!token) return res.status(500).json({ message: error.message });
            return res.status(200).json({ token });

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
            const authHeader = req.headers.authorization;
            if (!authHeader || !authHeader.startsWith('Bearer ')) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            
            const authToken = authHeader.split(' ')[1];
            const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
            if (!decoded) return res.status(401).json({ message: "Unauthorized" });

            return res.status(200).json({ message: "Logged out" });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default AuthController;
