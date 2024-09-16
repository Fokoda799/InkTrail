import Blog from '../models/blogModel.js';
import User from '../models/userModel.js';
import idValidation from '../utils/idValidation.js';

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
                message: error.message
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

            let userId = reqUserId === 'me' ? req.user.id : reqUserId;

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
            const limit = parseInt(req.query.limit, 10) || 10;
            const skip = (page - 1) * limit;
    
            if (page < 1 || limit < 1) {
                return res.status(400).json({ success: false, message: 'Page and limit must be positive integers' });
            }
    
            // Fetch blogs and populate user data in a single query
            const blogs = await Blog.find({})
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('userId', 'username avatar blogs'); // populate only necessary fields
    
            const totalBlogs = await Blog.countDocuments();
            const totalPages = Math.ceil(totalBlogs / limit);
    
            return res.status(200).json({
                success: true,
                blogs,
                pagination: { totalBlogs, totalPages, currentPage: page, perPage: limit }
            });
        } catch (error) {
            console.error('Error fetching all blogs:', error);
            return res.status(500).json({ success: false, message: error.message });
        }
    }
    
    
    static async getBlogById(req, res) {
        try {
            const { id } = req.params;
            if (!idValidation(id)) {
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

            const user = await User.findById(blog.userId);
            if (!user) return res.status(404).json({
                success: false,
                message: `User for blog ${blog._id} not found`
            });

            blog.user = user;

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
            if (!idValidation(id)) {
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
                    message: 'Invalid userId or id' 
                });
            }

            const blog = await Blog.findOne({ userId, _id: id });
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

    static async getAuthUserBlogs(req, res) {
        try {
            const userId = req.user.id;
            const blogs = await Blog.find({ userId });

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
            console.error('Error fetching authenticated user blogs:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }

    static async getAuthUserBlogById(req, res) {
        try {
            const { id } = req.params;
            if (!idValidation(id)) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Invalid id' 
                });
            }

            const userId = req.user.id;
            const blog = await Blog.findOne({ userId, _id: id });

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
            console.error('Error fetching authenticated user blog by ID:', error);
            return res.status(500).json({
                success: false,
                message: 'Internal server error'
            });
        }
    }
}

export default BlogController;
