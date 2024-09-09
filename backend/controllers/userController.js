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
            const user = await User.findOne({ _id: id });
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
            const {
                full_name, username,
                email, password,
                role
            } = req.body;
            const newUser = new User({
                full_name, username,
                email, password,
                role
            });
            await newUser.save();
            if (!newUser) return res.status(400).json({ message: "User not created" });
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
            const {
                full_name, username,
                password,
            } = req.body;
            const user = await User.findOne({ _id: id });
            if (!user) return res.status(404).json({ message: "User not found" });
            user.updateOne({
                full_name, username,
                password
            });
            await user.save();
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
            const user = await User.findOne({ _id: id });
            if (!user) return res.status(404).json({ message: "User not found" });
            await user.deleteOne()
            res.status(200).json({ message: "User removed" });
        } catch (error) {
            res.status(500).json({ message: error.message });
        }
    }

    static async updateUserRole(req, res) {
        try {
            const { id } = req.params
            if (!idValidation(id)) return res.status(400).json({ message: "Invalid ID" });

            const { role } = req.body;
            if (!role) return res.status(400).json({ message: "Role is required" });
            const roles = ["user", "admin"];
            if (!roles.includes(role)) return res.status(400).json({ message: "Invalid role" });
        
            const user = await User.findByIdAndUpdate(id, { role });
            if (!user) return res.status(404).json({ message: "User not found" });

            return res.status(200).json({ message: "User role updated" });
        } catch (error) {
            return res.status(500).json({ message: "Internal server error" });
        }
    }

    // @desc    Get the connected user
    // @route   Get /users/me
    //@ access  User
    static async getMe(req, res) {
        try {
            const userId = req.user._id;
    
            // Find the user by ID
            const user = await User.findOne({ _id: userId });
            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }
    
            // Respond with user details
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
            console.error(error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }    
};

export default UserController;
