import Blog from '../models/blogModel.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';

class BlogController {
    static async postBlog(req, res) {
        try {
            const { title, content, image } = req.body;
            if (!title || !content) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Title and content are required' 
                });
            }

            const userId = req.user.id;

            const newBlog = new Blog({ userId, title, content, image });
            await newBlog.save();

            const user = await User.findById(userId);
            if (user) {
                user.blogs.push(newBlog._id);
                await user.save();
            }

            return res.status(201).json({ 
                success: true, 
                blog: newBlog 
            });
        } catch (error) {
            console.error('Error creating blog:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async postBlogAsAdmin(req, res) {
        try {
            const { title, content, image, userId: reqUserId } = req.body;
            if (!title || !content || !reqUserId) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Title, content, and userId are required' 
                });
            }

            const userId = reqUserId === 'me' ? req.user.id : reqUserId;

            if (!idValidation(userId)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid userId' 
                });
            }

            const user = await User.findById(userId);
            if (!user) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'User not found' 
                });
            }

            const newBlog = new Blog({ userId, title, content, image });
            await newBlog.save();

            return res.status(201).json({ 
                success: true, 
                blog: newBlog 
            });
        } catch (error) {
            console.error('Error creating blog as admin:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getAllBlogs(req, res) {
        try {
            const page = parseInt(req.query.page, 10) || 1;
            const limit = parseInt(req.query.limit, 10) || 9;
            const skip = (page - 1) * limit;

            if (page < 1 || limit < 1) {
                return res.status(400).json({ success: false, message: 'Page and limit must be positive integers' });
            }

            let blogsQuery = {};
            
            if (req.query.following) {
                const user = req.user;
                if (!user) return res.status(401).json({ success: false, message: 'Unauthorized' });

                const followingList = user.following;
                
                if (!followingList || followingList.length === 0) {
                    return res.status(404).json({ success: false, message: 'No blogs found from the users you are following' });
                }

                blogsQuery = { userId: { $in: followingList } };
            }

            const blogs = await Blog.find(blogsQuery)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('userId', 'username avatar blogs');

            if (blogs.length === 0) {
                return res.status(404).json({ success: false, message: 'Blogs not found' });
            }

            const totalBlogs = await Blog.countDocuments(blogsQuery);
            const totalPages = Math.ceil(totalBlogs / limit);

            return res.status(200).json({
                success: true,
                blogs,
                pagination: { totalBlogs, totalPages, currentPage: page, perPage: limit }
            });
        } catch (error) {
            console.error('Error fetching all blogs:', error);
            return res.status(500).json({ success: false, message: 'Internal server error' });
        }
    }

    static async getBlogById(req, res) {
        try {
            const { id } = req.params;
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid id' 
                });
            }

            const blog = await Blog.findById(id).populate('userId', 'username avatar blogs ');
            if (!blog) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Blog not found' 
                });
            }

            return res.status(200).json({ 
                success: true, 
                blog 
            });
        } catch (error) {
            console.error('Error fetching blog by ID:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async updateBlog(req, res) {
        try {
            const { id } = req.params;
            if (mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid id' 
                });
            }

            const blog = await Blog.findById(id);
            if (!blog) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Blog not found' 
                });
            }

            const { title, content, image } = req.body;

            if (title) blog.title = title;
            if (content) blog.content = content;
            if (image) blog.image = image;

            await blog.save();
            return res.status(200).json({ 
                success: true, 
                blog 
            });
        } catch (error) {
            console.error('Error updating blog:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async deleteBlog(req, res) {
        try {
            const { id } = req.params;
            if (!idValidation(id)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid id' 
                });
            }

            const result = await Blog.deleteOne({ _id: id });
            if (result.deletedCount === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Blog not found' 
                });
            }

            return res.status(200).json({ 
                success: true 
            });
        } catch (error) {
            console.error('Error deleting blog:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getUserBlogs(req, res) {
        try {
            const { id } = req.params;
            if (!idValidation(id)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid id' 
                });
            }

            const blogs = await Blog.find({ userId: id });

            if (blogs.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Blogs not found' 
                });
            }

            return res.status(200).json({ 
                success: true, 
                blogs 
            });
        } catch (error) {
            console.error('Error fetching user blogs:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getUserBlogById(req, res) {
        try {
            const { userId, id } = req.params;
            if (!idValidation(userId) || !idValidation(id)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid id' 
                });
            }

            const blog = await Blog.findOne({ _id: id, userId });

            if (!blog) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Blog not found' 
                });
            }

            return res.status(200).json({ 
                success: true, 
                blog 
            });
        } catch (error) {
            console.error('Error fetching user blog by ID:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async likeBlog(req, res) {
        try {
            const { id } = req.params;
    
            // Validate blog ID
            if (!mongoose.Types.ObjectId.isValid(id)) {
                return res.status(400).json({
                    success: false,
                    message: 'Invalid blog ID'
                });
            }
    
            // Find the blog by ID
            const blog = await Blog.findById(id);
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: 'Blog not found'
                });
            }
    
            const userId = req.user.id;
    
            // Use MongoDB operators to like/unlike the blog
            const updateOperation = blog.likes.includes(userId)
                ? { $pull: { likes: userId } }
                : { $addToSet: { likes: userId } };
    
            // Update the blog's likes
            const updatedBlog = await Blog.findByIdAndUpdate(id, updateOperation, { new: true });
    
            // Return the updated blog with the updated likes
            return res.status(200).json({
                success: true,
                blog: updatedBlog
            });
        } catch (error) {
            console.error('Error liking blog:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
    
    

    static async commentOnBlog(req, res) {
        try {
            const { id } = req.params;
            const { comment } = req.body;

            if (!idValidation(id)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid id' 
                });
            }

            if (!comment) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Comment is required' 
                });
            }

            const blog = await Blog.findById(id);
            if (!blog) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'Blog not found' 
                });
            }

            blog.comments.push({
                userId: req.user.id,
                comment,
                createdAt: new Date()
            });
            await blog.save();

            return res.status(200).json({ 
                success: true, 
                blog 
            });
        } catch (error) {
            console.error('Error commenting on blog:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async searchBlogs(req, res) {
        try {
            const { query } = req.query;
            if (!query || query.trim() === '') {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Search query is required' 
                });
            }

            const blogs = await Blog.find({
                title: { $regex: query, $options: 'i' }
            });

            if (blogs.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'No blogs found' 
                });
            }

            return res.status(200).json({ 
                success: true, 
                blogs 
            });
        } catch (error) {
            console.error('Error searching blogs:', error.message);
            return res.status(500).json({
                success: false,
                message: error.message
            });
        }
    }

    static async getTrendingBlogs(req, res) {
        try {
            const blogs = await Blog.find({ likes: { $gt: 0 } })
                .sort({ likes: -1 })
                .limit(5);

            if (blogs.length === 0) {
                return res.status(404).json({ 
                    success: false, 
                    message: 'No trending blogs found' 
                });
            }

            return res.status(200).json({ 
                success: true, 
                blogs 
            });
        } catch (error) {
            console.error('Error fetching trending blogs:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

export default BlogController;
