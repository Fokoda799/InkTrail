import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    full_name: {
        type: String,
        required: false,
        maxlength: [30, "Full name cannot exceed 30 characters"],
        minlength: [5, "Full name must be at least 3 characters"]
    },
    username: {
        type: String,
        required: [true, "Username is required"],
        unique: [true, "Username is already taken"],
        maxlength: [20, "Username cannot exceed 20 characters"],
        minlength: [5, "Username must be at least 5 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: [true, "Email is already exists"],
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [6, "Password must be at least 6 characters"],
        maxlength: [20, "Password cannot exceed 20 characters"],
        select: false
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
}, { timestamps: true });

// Hash password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    this.password = await bcrypt.hash(this.password, 10);
})

// Compare password
userSchema.methods.comparePassword = async function (password) {
    return await bcrypt.compare(password, this.password);
}

const User = mongoose.model('User', userSchema);
export default User;