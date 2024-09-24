import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import sendToken from '../utils/jwtToken.js';
import idValidation from '../utils/idValidation.js';
import {sendVierificationEmail} from '../mailtrap/emails.js';

class UserController {
    // @desc    Get all users
    // @route   GET /users
    // @access  Admin
    static async getAllUsers(req, res) {
        try {
            const users = await User.find().populate('blogs', 'title content image');
            res.status(200).json(users);
        } catch (error) {
            res.status(500).json({ message: error.message });
        };
    }

    // @desc    Get user by ID
    // @route   GET /users/:id
    // @access  Admin
    static async getUserById(req, res) {
        try {
            const { id } = req.params;
            if (!idValidation(id)) return res.status(400).json({ message: "Invalid ID" });

            const user = await User.findById(id);
            if (!user) return res.status(404).json({ message: "User not found" });

            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Create a new user
    // @route   POST /users
    // @access  Public
    static async createUser(req, res) {
        try {
            const { username, email, password } = req.body;

            // Check if email already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: "Email already exists" });
            }

            // Create a new user instance
            const newUser = new User({
                username,
                email,
                password,
                verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
            });

            // Generate the verification token and save it to the user instance
            await newUser.getVerificationToken();

            // Save the new user to the database
            await newUser.save();

            // Send verification email with the generated token
            await sendVierificationEmail(newUser.email, newUser.verficationToken);

            // Send the JWT token in response
            sendToken(newUser, 201, res);
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }


    // @desc    Update a user
    // @route   PUT /users/:id
    // @access  User
    static async updateUser(req, res) {
        try {
            const { id } = req.params;

            const { username, password } = req.body;

            const user = await User.findByIdAndUpdate(
                id,
                { full_name, username, password },
                { new: true, runValidators: true }
            );

            if (!user) return res.status(404).json({ message: "User not found" });

            res.status(200).json({
                id: user._id,
                username: user.username,
                email: user.email,
                role: user.role
            });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Delete a user
    // @route   DELETE /users/:id
    // @access  Admin
    static async deleteUser(req, res) {
        try {
            const { id } = req.params;
            if (!idValidation(id)) return res.status(400).json({ message: "Invalid ID" });

            const user = await User.findByIdAndDelete(id);
            if (!user) return res.status(404).json({ message: "User not found" });

            res.status(200).json({ message: "User removed" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    // @desc    Update user role
    // @route   PUT /users/:id/role
    // @access  Admin
    static async updateUserRole(req, res) {
        try {
            const { id } = req.params;
            if (!idValidation(id)) return res.status(400).json({ message: "Invalid ID" });

            const { role } = req.body;
            if (!role) return res.status(400).json({ message: "Role is required" });

            const validRoles = ["user", "admin"];
            if (!validRoles.includes(role)) return res.status(400).json({ message: "Invalid role" });

            const user = await User.findByIdAndUpdate(id, { role }, { new: true });
            if (!user) return res.status(404).json({ message: "User not found" });

            return res.status(200).json({ message: "User role updated" });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // @desc    Get the connected user
    // @route   GET /users/me
    // @access  User
    static async getMe(req, res) {
        try {
            const { id: userId } = req.user;

            const user = await User.findById(userId).populate('blogs', 'title content image');
            if (!user) return res.status(404).json({ message: "User not found" });

            return res.status(200).json({
                success: true,
                user: {
                    ...user._doc,
                    password: undefined,
                    verificationToken: undefined,
                    verificationTokenExpires: undefined
                },
            });
        } catch (error) {
            return res.status(500).json({ message: `Internal server error: ${error.message}` });
        }
    }

    // @desc    Update the connected user
    // @route   PUT /users/me
    // @access  User
    static async updateMe(req, res) {
        try {
            const { id } = req.user;
            const { username, bio, avatar } = req.body;

            const user = await User.findByIdAndUpdate(
                id,
                { username, bio, avatar },
                { new: true, runValidators: true }
            ).populate('blogs', 'title content image');

            if (!user) return res.status(404).json({
                success: false,
                message: "User not found"
            });

            return res.status(200).json({
                success: true,
                user
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }

    static async followUser(req, res) {
        try {
            const { id: userId } = req.params; // Destructure userId from params
            if (!userId) {
                return res.status(400).json({ success: false, message: 'Missing id' });
            }
    
            // Find the user to be followed
            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ success: false, message: 'User not found' });
            }
    
            const { id: meId } = req.user; // Destructure the ID of the current user
    
            if (user.id === meId) {
                return res.status(400).json({ success: false, message: 'Cannot follow yourself' });
            }
    
            // Check if the current user is already following the other user
            const isFollowing = user.followers.includes(meId);
    
            if (isFollowing) {
                // Unfollow user
                user.followers = user.followers.filter(follower => follower.toString() !== meId);
                req.user.following = req.user.following.filter(followed => followed.toString() !== user.id);
            } else {
                // Follow user
                user.followers.push(meId);
                req.user.following.push(user.id);
            }
    
            // Save both the user being followed/unfollowed and the current user
            await Promise.all([user.save(), req.user.save()]);
    
            return res.status(200).json({
                success: true,
                user: req.user,
                isFollowing: !isFollowing,
                message: isFollowing ? 'Unfollowed successfully' : 'Followed successfully',
            });
        } catch (error) {
            console.error('Error following user:', error); // Log the error for debugging
            return res.status(500).json({ message: error.message, success: false });
        }
    }
    
};



export default UserController;
