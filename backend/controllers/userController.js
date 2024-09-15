import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';
import sendToken from '../utils/jwtToken.js';
import idValidation from '../utils/idValidation.js';

class UserController {
    // @desc    Get all users
    // @route   GET /users
    // @access  Admin
    static async getAllUsers(req, res) {
        try {
            const users = await User.find();
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
    // @access  User
    static async createUser(req, res) {
        try {
            const { full_name, username, email, password, role } = req.body;

            const newUser = new User({
                full_name, username, email, password, role
            });

            await newUser.save();
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
            if (!idValidation(id)) return res.status(400).json({ message: "Invalid ID" });

            const { full_name, username, password } = req.body;

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
            const userId = req.user._id;

            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ message: "User not found" });

            return res.status(200).json({
                message: "Welcome back",
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                }
            });
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
            );

            if (!user) return res.status(404).json({
                success: false,
                message: "User not found"
            });

            return res.status(200).json({
                success: true,
                user: {
                    id: user._id,
                    username: user.username,
                    bio: user.bio,
                    avatar: user.avatar
                }
            });
        } catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
};

export default UserController;
