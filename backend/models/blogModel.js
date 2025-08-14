import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { comment } from 'postcss';

dotenv.config();

const blogSchema = new mongoose.Schema({
    author: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    title: {
        type: String,
        required: true,
        maxLength: 200,
        minLength: 6, // Fixed typo from `minLengrh` to `minLength`
    },
    content: {
        type: String,
        required: true,
        maxLength: 200000,
        minLength: 100, // Fixed typo from `minLengrh` to `minLength`
    },
    coverImage: {
        type: String,
        default: process.env.IMAGE_PLACEHOLDER, // Optional: Provide a default value if the image field is not required
    },
    excerpt: {
        type: String,
    },
    tags: {
        type: [String],
        default: [], // Optional: Provide a default empty array for tags
    },
    state: {
        type: String,
        enum: ['draft', 'published', 'archived'],
        default: 'draft',
    },
    likes: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    bookmarks: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'User',
        default: []
    },
    comments: {
        type: Number,
        default: 0,
    },
    views: {
        type: Number,
        default: 0, // Default value for views
    },
    readTime: {
        type: Number,
        default: 0, // Default value for read time
    },
    images: {
        type: [String],
        default: [], // Optional: Provide a default empty array for images
    },
}, { timestamps: true });

blogSchema.index({ title: 'text' });

blogSchema.pre('remove', async function(next) {
  try {
    // `this` is the blog document being removed
    await mongoose.model('Comment').deleteMany({ blog: this._id });
    next();
  } catch (err) {
    next(err);
  }
});

const Blog = mongoose.model('Blog', blogSchema);
export default Blog;
