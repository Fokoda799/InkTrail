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

            const userId = req.user.id;

            const newBlog = new Blog({ userId, title, content, image });
            await newBlog.save();
            return res.status(201).json({ message: 'Blog created successfully', blog: newBlog });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async postBlogAsAdmin(req, res) {
        try {
            const { title, content, image } = req.body;
            let { userId } = req.body;
            if (!title || !content || !userId) {
                return res.status(400).json({ message: 'Title, content and userId are required' });
            }

            if (userId === 'me') userId = req.user.id;
            if (!idValidation(userId)) return res.status(400).json({ message: 'Invalid userId' });

            const user = await User.findOne({ _id: userId });
            if (!user) return res.status(404).json({ message: 'User not found' });

            const newBlog = new Blog({ userId, title, content, image });
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

            const blogs = await Blog.find({ userId: id });
            if (!blogs) return res.status(404).json({ message: 'Blogs not found' });

            return res.status(200).json(blogs);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        };
    }

    static async getUserBlogById(req, res) {
        try {
            const { userId, id } = req.params;
            if (!idValidation(userId) || !idValidation(id)) return res.status(400).json({ message: 'Invalid userId or id' });

            const blog = await Blog.findOne({ userId, _id: id });
            if (!blog) return res.status(404).json({ message: 'Blog not found' });

            return res.status(200).json(blog);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        };
    }

    static async getAuthUserBlogs(req, res) {
        try {
            const userId = req.user.id;
            const blogs = await Blog.find({ userId });
            if (!blogs) return res.status(404).json({ message: 'Blogs not found' });

            return res.status(200).json(blogs);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }

    static async getAuthUserBlogById(req, res) {
        try {
            const { id } = req.params;
            if (!idValidation(id)) return res.status(400).json({ message: 'Invalid id' });

            const userId = req.user.id;
            const blog = await Blog.findOne({ userId, _id: id });
            if (!blog) return res.status(404).json({ message: 'Blog not found' });

            return res.status(200).json(blog);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    }
}

export default BlogController;
