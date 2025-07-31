import Blog from '../models/blogModel.js';
import User from '../models/userModel.js';

class BlogController {
    static async postBlog(req, res) {
        try {
            const { title, content, coverImage } = req.body;
            
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
                coverImage,
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

    static async getAllBlogs(req, res) {
        // Validate and sanitize input
        const { page = 1, limit = 9, viewType, sortBy } = req.query;
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);
        
        // Input validation
        if (pageInt < 1 || limitInt < 1 || isNaN(pageInt) || isNaN(limitInt)) {
            return res.status(400).json({ 
                success: false, 
                message: 'Page and limit must be positive integers',
                code: 'INVALID_PAGINATION_PARAMS'
            });
        }
        
        let sort = { createdAt: -1 }; // Default sort
        if (sortBy === "latest") {
            sort = { createdAt: -1 };
        } else if (sortBy === "trending") { // Fixed typo from "trending"
            sort = { views: -1, createdAt: -1 };
        } else if (sortBy === "popular") {
            sort = { likes: -1, createdAt: -1 };
        }

        try {
            // Build query conditions
            const queryConditions = {};
            
            if (viewType === "following") {
                if (!req.user?.id) {
                    return res.status(401).json({
                        success: false,
                        message: 'Authentication required for following view',
                        code: 'UNAUTHORIZED'
                    });
                }

                const user = await User.findById(req.user.id).select('following');
                if (!user) {
                    return res.status(404).json({
                        success: false,
                        message: 'User not found',
                        code: 'USER_NOT_FOUND'
                    });
                }

                if (user.following.length === 0) {
                    return res.status(200).json({
                        success: true,
                        data: {
                            blogs: [],
                            pagination: {
                                totalItems: 0,
                                totalPages: 0,
                                currentPage: pageInt,
                                itemsPerPage: limitInt,
                                hasNextPage: false,
                                hasPrevPage: false
                            }
                        },
                        meta: {
                            requestStatus: 'COMPLETED',
                            timestamp: new Date().toISOString()
                        },
                        code: 'NO_FOLLOWING_BLOGS'
                    });
                }

                queryConditions.author = { $in: user.following };
            }

            // Execute paginated query
            const [blogs, totalBlogs] = await Promise.all([
                Blog.find(queryConditions)
                    .sort(sort)
                    .skip((pageInt - 1) * limitInt)
                    .limit(limitInt)
                    .populate('author', 'username avatar isVerified bio followers')
                    .lean(),
                Blog.countDocuments(queryConditions)
            ]);

            // Calculate pagination metadata
            const totalPages = Math.ceil(totalBlogs / limitInt);

            // Format the response data
            const formattedBlogs = blogs.map(blog => ({
                _id: blog._id,
                title: blog.title,
                content: blog.content,
                coverImage: blog.coverImage,
                likes: blog.likes?.length || 0,
                isLiked: blog.likes?.some(like => like.user.toString() === req.user?.id) || false,
                comments: blog.comments?.length || 0,
                views: blog.views || 0,
                readTime: blog.readTime,
                createdAt: blog.createdAt,
                images: blog.images || [],
                tags: blog.tags || [],
                excerpt: blog.excerpt,
                author: {
                    username: blog.author?.username,
                    avatar: blog.author?.avatar,
                    isVerified: blog.author?.isVerified || false,
                    bio: blog.author?.bio,
                    followers: blog.author?.followers?.length || 0
                }
            }));

            console.log(`Fetched ${blogs.length} blogs for page ${pageInt} with limit ${limitInt} (viewType: ${viewType})`);
            
            // Response formatting
            return res.status(200).json({
                success: true,
                data: {
                    blogs: formattedBlogs,
                    pagination: {
                        totalItems: totalBlogs,
                        totalPages,
                        currentPage: pageInt,
                        itemsPerPage: limitInt,
                        hasNextPage: pageInt < totalPages,
                        hasPrevPage: pageInt > 1
                    }
                },
                meta: {
                    requestStatus: 'COMPLETED',
                    timestamp: new Date().toISOString()
                }
            });

        } catch (error) {
            // Structured error handling
            console.error(`BlogController Error: ${error.message}`, {
                stack: error.stack,
                queryParams: req.query,
                userId: req.user?.id
            });

            return res.status(500).json({
                success: false,
                message: 'Failed to retrieve blogs',
                code: 'SERVER_ERROR',
                systemMessage: process.env.NODE_ENV === 'development' ? error.message : undefined
            });
        }
    }
 
    static async getBlogById(req, res) {
        try {
            const { id } = req.params;
            const userId = req.user?.id || null;

            const blogDoc = await Blog.findById(id)
            .populate('author', 'avatar username isVerified bio followers following');

            if (!blogDoc) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
            }

            const isLiked = blogDoc.likes.find(like => like.user.toString() === userId) ? true : false;

            return res.status(200).json({
                success: true,
                blog:{
                    _id: blogDoc._id,
                    title: blogDoc.title,
                    content: blogDoc.content,
                    coverImage: blogDoc.coverImage,
                    isLiked,
                    likes: blogDoc.likes.length,
                    comments: blogDoc.comments.length,
                    views: blogDoc.views,
                    readTime: blogDoc.readTime,
                    createdAt: blogDoc.createdAt,
                    images: blogDoc.images,
                    tags: blogDoc.tags,
                    excerpt: blogDoc.excerpt,
                    author: {
                        username: blogDoc.author.username,
                        avatar: blogDoc.author.avatar,
                        isVerified: blogDoc.author.isVerified,
                        bio: blogDoc.author.bio,
                        following: blogDoc.author.following.length,
                        followers: blogDoc.author.followers.length
                    },
                }
            });

        } catch (error) {
            console.error('Error fetching blog by ID:', error);
            return res.status(500).json({
            success: false,
            message: error.message || 'Internal server error',
            });
        }
        }


    static async updateBlog(req, res) {
        try {
            const { id } = req.params;
            const { id: userId } = req.user;
            const { actionType, ...body } = req.body; // 'like', 'bookmark', etc.

            const blog = await Blog.findById(id);
            if (!blog) {
                return res.status(404).json({
                    success: false,
                    message: 'Blog not found'
                });
            }

            let message = '';

            if (actionType === 'like') {
                const hasLiked = blog.likes.includes(userId);
                if (hasLiked) {
                    blog.likes.pull(userId);
                    message = 'Like removed';
                } else {
                    blog.likes.push(userId);
                    message = 'Blog liked';
                }
            }

            if (actionType === 'bookmark') {
                const hasBookmarked = blog.bookmarks.includes(userId);
                if (hasBookmarked) {
                    blog.bookmarks.pull(userId);
                    message = 'Bookmark removed';
                } else {
                    blog.bookmarks.push(userId);
                    message = 'Blog bookmarked';
                }
            }

            if (body) {
                Object.assign(blog, body)
            }

            await blog.save();

            return res.status(200).json({
                success: true,
                message: message || 'Blog updated successfully',
                blog
            });

        } catch (error) {
            console.error('Error updating blog:', error);
                return res.status(500).json({
                success: false,
                message: 'An error occurred while updating the blog'
            });
        }
    }



    static async deleteBlog(req, res) {
        try {
            const { id } = req.params;

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

    static async likeBlog(req, res) {
        try {
            const blogDoc = await Blog.findById(req.params.id);

            if (!blogDoc) {
                return res.status(404).json({ error: 'Blog not found' });
            }

            // Check if user already liked the blog
            const existingLikeIndex = blogDoc.likes.findIndex(like => like.user.toString() === req.user._id.toString());

            let liked = false;
            
            if (existingLikeIndex > -1) {
                // User already liked, remove the like
                blogDoc.likes.splice(existingLikeIndex, 1);
                console.log(`Like removed`);
            } else {
                // User hasn't liked, add the like
                blogDoc.likes.push({
                    user: req.user._id,
                    createdAt: new Date()
                });
                console.log(`Like added`);
            }

            await blogDoc.save();

            res.json({
                message: liked ? 'Post liked successfully' : 'Post unliked successfully'
            });
        } catch (error) {
            res.status(500).json({ error: error.message });
            console.error('Error liking blog:', error);
        }
    }
}

export default BlogController;
