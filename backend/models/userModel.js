import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"],
        // unique: [true, "Username is already taken"],
        maxlength: [50, "Username cannot exceed 50 characters"],
        minlength: [5, "Username must be at least 5 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        // unique: [true, "Email already exists"],
        validate: [validator.isEmail, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: false,
        minlength: [6, "Password must be at least 6 characters"],
    },
    withPassword: {
        type: Boolean,
        required: true,
        default: false
    },
    lastLogin: {
        type: Date,
        default: Date.now,
    },
    isVerified: { type: Boolean, default: false },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    avatar: {
        type: String,
    },
    bio: {
        type: String,
        maxlength: [150, "Bio cannot exceed 150 characters"]
    },
    following: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    followers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    isFollowed: {
        type: Boolean,
        default: false
    },
    blogsCount: {
        type: Number,
        default: 0
    },
    history: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Blog',
        }
    ],
    bookmarks: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Blog'
    }],
    theme: {
        type: String,
        enum: ['light', 'dark', 'system'],
        default: 'system'
    },
    Language: {
        type: String,
        enum: ['en', 'fr', 'ar'],
        default: 'en'
    },
    notification: {
        like: {
            type: Boolean,
            default: true
        },
        comment: {
            type: Boolean,
            default: true
        },
        follow: {
            type: Boolean,
            default: true
        },
        custom: {
            type: Boolean,
            default: true
        }
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    verificationToken: String,
    verificationTokenExpiresAt: Date,
}, { timestamps: true });

userSchema.index({ username: 'text'});

userSchema.pre('remove', async function(next) {
  try {
    // `this` is the user document being removed
    await mongoose.model('Blog').deleteMany({ author: this._id });
    await mongoose.model('Comment').deleteMany({ author: this._id });
    await mongoose.model('Notification').deleteMany({ user: this._id });
    await mongoose.model('User').deleteOne({ _id: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

// Hash password before saving user
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }
    try {
        this.password = await bcrypt.hash(this.password, 10);
        this.withPassword = true;
        next();
    } catch (error) {
        next(error);
    }
});

// Compare password method
userSchema.methods.comparePassword = async function (password) {
    if (!this.password) {
        throw new Error('Password is not set for this user');
    }
    return await bcrypt.compare(password, this.password);
}

// Generate JWT Token
userSchema.methods.getJWTToken = function () {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET || 'default_secret', {
        expiresIn: process.env.JWT_EXPIRES || '1d',
    });
}

// Method to update password directly without comparing
userSchema.methods.updatePassword = async function (newPassword) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error('New password must be at least 6 characters long');
  }

  this.password = newPassword;
  this.withPassword = true;

  // Save user document (will trigger pre-save hook to hash)
  await this.save();

  return true;
};


// Generate password reset token
userSchema.methods.getResetPasswordToken = function () {
    const resetToken = crypto.randomBytes(20).toString('hex');
    this.resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // Token expires in 10 minutes
    return resetToken;
}

const User = mongoose.model('User', userSchema);
export default User;