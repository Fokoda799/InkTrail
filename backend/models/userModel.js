import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: false,
        maxlength: [30, "Full name cannot exceed 30 characters"],
        minlength: [5, "Full name must be at least 5 characters"] // Updated from 3 to 5
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username is already taken"],
        maxlength: [50, "Username cannot exceed 20 characters"],
        minlength: [5, "Username must be at least 5 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email already exists"], // Changed from "Email is already exists" to "Email already exists"
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: false,
        minlength: [6, "Password must be at least 6 characters"],
        maxlength: [20, "Password cannot exceed 20 characters"],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    avatar: {
        public_id: String,
        url: String
    },
    blogs: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog',
        }
    ]
}, { timestamps: true });

// Hash password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

// Generate JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET || 'default_secret', {
        expiresIn: process.env.JWT_EXPIRES || '1d',
    });
}

const User = mongoose.model('User', userSchema);
export default User;
