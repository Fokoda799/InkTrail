import Blog from '../models/blogModel.js';
import User from '../models/userModel.js';
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

class BlogController {
    

    static async postBlog(req, res) {
        try {
            const { title, content, image } = req.body;
            
            // Validate required fields
            if (!title || !content) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Title and content are required' 
                });
            }

            // Retrieve author ID from authenticated user
            const author = req.user.id

            // Create new blog document
            const newBlog = new Blog({
                author,
                title,
                content,
                image,
            });

            // Save the new blog to the database
            await newBlog.save();

            // Add the new blog ID to the user's blogs array
            const user = await User.findById(author);
            if (user) {
                user.blogs.push(newBlog._id);
                await user.save();
            }

            // Respond with the created blog
            return res.status(201).json({ 
                success: true, 
                blog: newBlog 
            });
        } catch (error) {
            console.error('Error creating blog:', error);
            // Respond with a generic error message
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
                const {id} = req.user;
                const user = await User.findById(id);

                const following = user.following;
                
                if (following.length === 0) {
                    return res.status(404).json({ success: false, message: 'No blogs found from the users you are following' });
                }

                blogsQuery = { author: { $in: following } };
            }

            const blogs = await Blog.find(blogsQuery)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit)
                .populate('author', 'username avatar blogs following');

            if (blogs.length === 0) {
                return res.status(404).json({ success: false, message: `Blogs not found ${req.user.following.length}` });
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

            const blog = await Blog.findById(id).populate('author', 'username avatar blogs followers');
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
          const { term, sort = 'desc', category, limit = 10, page = 1 } = req.query;
      
          // Validate and sanitize search term
          if (!term || typeof term !== 'string' || term.trim() === '') {
            return res.status(400).json({
              success: false,
              message: 'A valid search term is required.',
            });
          }
      
          // Construct the search query object
          const searchQuery = {
            title: { $regex: term, $options: 'i' }, // Trim and use case-insensitive search
          };
      
          // Add category filter if provided and not 'all'
          if (category && category !== 'all') {
            searchQuery.category = category;
          }
      
          // Determine sort order and options for pagination
          const sortOrder = sort === 'asc' ? 1 : -1;
          const options = {
            sort: { createdAt: sortOrder },
            limit: parseInt(limit, 10), // Limit the number of results per page
            skip: (parseInt(page, 10) - 1) * parseInt(limit, 10), // Skip documents for pagination
          };
      
          // Fetch blogs with search filters, sorting, pagination, and populate author fields
          const blogs = await Blog.find(searchQuery, null, options)
            .populate('author', 'username avatar blogs')
            .exec();
      
          // Check if any blogs are found
          if (!blogs.length) {
            return res.status(404).json({
              success: false,
              message: 'No blogs found for the given search criteria.',
            });
          }
      
          // Count total documents matching the search criteria (for pagination info)
          const totalBlogs = await Blog.countDocuments(searchQuery);
      
          return res.status(200).json({
            success: true,
            totalBlogs, // Total matching blogs count
            currentPage: parseInt(page, 10),
            totalPages: Math.ceil(totalBlogs / parseInt(limit, 10)),
            blogs,
          });
        } catch (error) {
          console.error('Error searching blogs:', error.message);
          return res.status(500).json({
            success: false,
            message: 'Server Error. Please try again later.',
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
