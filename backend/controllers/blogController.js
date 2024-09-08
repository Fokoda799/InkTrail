import Blog from '../models/blogModel.js';
import User from '../models/userModel.js';
import idValidation from '../utils/idValidation.js';

class BlogController {
    static async postBlog(req, res) {
        try {
            const { title, content, image } = req.body;
            if (!title || !content) {
                return res.status(400).json({ message: 'Title and content are required' });
            }

            const newBlog = new Blog({ title, content, image });
            await newBlog.save();
            return res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getAllBlogs(req, res) {
        try {
            const blogs = await Blog.find({});
            return res.status(200).json({ blogs });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getBlogById(req, res) {
        try {
            const { id } = req.params;
            if (!idValidation(id)) return res.status(400).json({ message: 'Invalid id' });
            const blog = await Blog.findOne({ _id: id });
            if (!blog) return res.status(404).json({ message: 'Blog not found' });
            return res.status(200).json({ blog });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async updateBlog(req, res) {
        try {
            const { id } = req.params;
            if (!idValidation(id)) return res.status(400).json({ message: 'Invalid id' });
            const blog = await Blog.findOne({ _id: id });
            if (!blog) return res.status(404).json({ message: 'Blog not found' });
            const { title, content, image } = req.body;

            if (title) blog.title = title;
            if (content) blog.content = content;
            if (image) blog.image = image;

            await blog.save();
            return res.status(200).json({ message: 'Blog updated successfully', blog });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async deleteBlog(req, res) {
        try {
            const { id } = req.params;
            if (!idValidation(id)) return res.status(400).json({ message: 'Invalid id' });
            const blog = await Blog.deleteOne({ _id: id });
            if (!blog) return res.status(404).json({ message: 'Blog not found' });

            return res.status(200).json({ message: 'Blog deleted successfully' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getUserBlogs(req, res) {
        try {
            const { id } = req.params;
            if (!idValidation(id)) return res.status(400).json({ message: 'Invalid id' });
            const blogs = await Blog.find({ user: id });
            if (!blogs) return res.status(404).json({ message: 'Blogs not found' });
            return res.status(200).json({ blogs });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        };
    }

    static async getMyBlogs(req, res) {
        const { id } = req.params;

        // Extract the Authorization header
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: "Unauthorized, no token provided" });
        }

        // Extract the token from the "Bearer <token>" format
        const authToken = authHeader.split(' ')[1];

        // Verify the token
        const decoded = jwt.verify(authToken, process.env.JWT_SECRET);
        if (!decoded) {
            return res.status(401).json({ message: "Unauthorized, invalid token" });
        }

        // Get the user ID from the decoded token
        const userId = decoded.user.id;
        const user = await User.findOne({ _id: userId });

        // Find the user by ID
        if (id) {
            if (!idValidation(id)) return res.status(400).json({ message: 'Invalid id' });
            const userBlog = await User.findById(id).populate('blogs');
            if (!userBlog) return res.status(404).json({ message: 'User not found' });
        }
    }
}

export default BlogController;
