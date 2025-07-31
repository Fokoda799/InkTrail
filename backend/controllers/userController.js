import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import sendToken from '../utils/jwtToken.js';
import idValidation from '../utils/idValidation.js';
import { sendVerificationEmail } from '../nodemailer/email.js';
import { generateVerificationToken } from '../utils/jwtToken.js';
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
            // const existingUser = await User.findOne({ email });
            // if (existingUser) {
            //     console.log("Email already exists");
            //     return res.status(400).json({ message: "Email already exists" });
            // }

            const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

            // Create a new user instance
            const newUser = new User({
                username,
                email,
                password,
                verificationToken,
                verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000,
            });

            // Save the new user to the database
            await newUser.save();

            await sendVerificationEmail(newUser, verificationToken);

            // Send the JWT token in response
            sendToken(newUser, 201, res);
        } catch (error) {
            console.log("Error creating user:", error);
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
            ).populate('blogs', 'title content image');

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
            const { _id: id } = req.user;
            console.log(id);

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

    // @desc    Get the following status of the connected user
    // @route   GET /users/follow-status/:id
    // @access  User
    static async getFollowStatus (req, res) {
        try {
            const { targetUserId } = req.params;
            const currentUser = await User.findById(req.user._id);
            const isFollowing = currentUser.following.includes(targetUserId);
            return res.json({ isFollowing });
        } catch (error) {
            consol.log(error);
            return res.status(500).json({ error: 'Server error' });
        }
    }

    // @desc    Follow a user if not already following
    // @route   POST /users/follow
    // @access  User
    static async followUser (req, res) {
        try {
            const { targetUserId, action } = req.body;
            const currentUser = await User.findById(req.user._id);
            const targetUser = await User.findById(targetUserId);
        
            if (action === 'follow') {
              if (!currentUser.following.includes(targetUserId)) {
                currentUser.following.push(targetUserId);
                targetUser.followers.push(req.user._id);
              }
            } else if (action === 'unfollow') {
              currentUser.following = currentUser.following.filter(id => id.toString() !== targetUserId);
              targetUser.followers = targetUser.followers.filter(id => id.toString() !== currentUserId);
            }
        
            await currentUser.save();
            await targetUser.save();
        
            return res.json({ isFollowing: action === 'follow' });
          } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'Server error' });
          }
    }
    
};



export default UserController;
