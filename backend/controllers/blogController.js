import Blog from '../models/blogModel.js';
import User from '../models/userModel.js';
import Comment from '../models/commentModel.js';
import { handlePostActions, createNotification } from '../service/postActions.js';

class BlogController {
    static async postBlog(req, res) {
        try {
            const { title, content, coverImage, excerpt, tags } = req.body;
            
            // Validate required fields
            if (!title || !content) {
                return res.status(400).json({ 
                    success: false, 
                    message: 'Title and content are required' 
                });
            }

            // Retrieve author ID from authenticated user
            const authorId = req.user.id

            const author = await User.findById(authorId);

            // Create new blog document
            const newBlog = new Blog({
                author,
                title,
                content,
                coverImage,
                excerpt,
                tags
            });

            // Save the new blog to the database
            await newBlog.save();

            // Increase the number of blogs for the author
            author.blogsCount += 1;
            await author.save();

            if(newBlog) {
                createNotification(
                    author._id,
                    author._id,
                    'blog',
                    { id: newBlog._id, type: 'Blog' },
                    `Your blog has been published!`,
                    `Your blog "${newBlog.title}" is now live! Check it out and share your thoughts.`,
                    `/blog/${newBlog._id}`,
                    {
                        type: 'blog',
                        title: newBlog.title,
                        excerpt: newBlog.excerpt,
                    }
                );
            }

            // Respond with the created blog
            return res.status(201).json({ 
                success: true, 
                // blog: newBlog 
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
        const { page = 1, limit = 10, viewType, sortBy, selectedTags } = req.query;
        const pageInt = parseInt(page, 10);
        const limitInt = parseInt(limit, 10);
        
        // Input validation
        if (pageInt < 1 || limitInt < 1 || isNaN(pageInt) || isNaN(limitInt)) {
            console.error('Invalid pagination parameters:', { page: pageInt, limit: limitInt });
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

            if (selectedTags && selectedTags.length > 0) {
                queryConditions.tags = { $in: selectedTags };
            }

            // Execute paginated query
            const [blogs, totalBlogs] = await Promise.all([
                Blog.find(queryConditions,
                    'title content coverImage likes comments views readTime createdAt images tags excerpt'
                )
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
                ...blog,
                likes: blog.likes?.length || 0,
                isLiked: blog.likes?.some(like => like.user.toString() === req.user?.id) || false,
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
            .populate('author', 'username avatar isVerified bio followers following');

            if (!blogDoc) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found: ' + req.originalUrl,
            });
            }

            const isLiked = blogDoc.likes.find(like => like.user.toString() === userId) ? true : false;

            console.log("Avatar: ", blogDoc.author);

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
                    isBookmarked: blogDoc.bookmarks.includes(userId),
                    bookmarks: blogDoc.bookmarks.length,
                    views: blogDoc.views,
                    readTime: blogDoc.readTime,
                    createdAt: blogDoc.createdAt,
                    images: blogDoc.images,
                    tags: blogDoc.tags,
                    excerpt: blogDoc.excerpt,
                    author: {
                        _id: blogDoc.author._id,
                        username: blogDoc.author.username,
                        avatar: blogDoc.author.avatar,
                        isVerified: blogDoc.author.isVerified,
                        bio: blogDoc.author.bio,
                        follows: blogDoc.author.followers.length,
                        isFollowed: userId ? blogDoc.author.followers.includes(userId) : false
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

    static async BlogActions(req, res) {
        try {
            const { actionType } = req.body;
            if (!actionType) {
                console.error('Action type is required');
                return res.status(400).json({ error: 'Action type is required' });
            }
            const blogId = await handlePostActions(actionType, req);

            const updatedReq = {
                ...req,  // copy all existing properties
                params: { ...req.params, id: blogId },  // update the id param
                originalUrl: `/api/v1/blogs/${blogId}`,  // update the URL if needed
            };

            if (actionType !== 'follow') {
                return BlogController.getBlogById(updatedReq, res); // Fetch updated blog details
            }
            return res.status(200).json({
                success: true,
                message: `Action ${actionType} performed successfully`,
            });
        } catch (error) {
            console.error('Error liking blog:', error);
            res.status(500).json({ error: error.message });
        }
    }

    static async getBlogComments(req, res) {
        const { id } = req.params;
        const userId = req.user.id;

        try {
            // Check if blog exists
            const exists = await Blog.findOne({ _id: id }, { _id: 1 });
            if (!exists) {
            return res.status(404).json({
                success: false,
                message: 'Blog not found',
            });
            }

            // Find top-level comments (assuming replies are nested inside each comment)
            const comments = await Comment.find({ blog: id, replyTo: null }) // top-level comments only
            .populate('user', 'username avatar isVerified')
            .populate({
                path: 'replies',
                populate: [
                { path: 'user', select: 'username avatar isVerified' },
                {
                    path: 'replies',
                    populate: [
                    { path: 'user', select: 'username avatar isVerified' },
                    {
                        path: 'replies',
                        populate: { path: 'user', select: 'username avatar isVerified' },
                    },
                    ],
                },
                ],
            })
            .sort({ createdAt: -1 }) // newest first
            .lean();

            return res.status(200).json({
            success: true,
            comments,
            });
        } catch (error) {
            console.error('Error fetching blog comments:', error);
            return res.status(500).json({
            success: false,
            message: 'Server Error. Please try again later.',
            });
        }
        }
    static async commentCount(req, res) {
        const { id } = req.params;

        try {
            // Check if blog is exists
            const exists = await Blog.findOne({ _id: id }, { _id: 1 });
            if (!exists) {
                return res.status(404).json({
                    success: false,
                    message: 'Blog not found'
                });
            }

            // Count comments for the blog
            const count = await Comment.countDocuments({ blog: id });

            return res.status(200).json({
                success: true,
                count
            });
        } catch (error) {
            console.error('Error fetching blog comment count:', error);
            return res.status(500).json({
                success: false,
                message: 'Server Error. Please try again later.'
            });
        }
    }

    static async addComment(req, res) {
        const { id } = req.params;
        const { content, replyingTo } = req.body;

        try {
            const blogExists = await Blog.findById(id).populate('author', 'notification');
            if (!blogExists) {
                return res.status(404).json({
                    success: false,
                    message: 'Blog not found',
                });
            }

            const newCommentData = {
                user: req.user.id,
                blog: id,
                content,
                isAuthor: blogExists.author.equals(req.user.id),
                replyTo: replyingTo || null,  // <-- set parent comment ID or null
            };

            const newComment = new Comment(newCommentData);
            await newComment.save();    

            if (replyingTo) {
                const parentComment = await Comment.findById(replyingTo);
                if (!parentComment) {
                    return res.status(404).json({
                    success: false,
                    message: 'Comment not found',
                    });
                }
                if (!parentComment.blog.equals(id)) {
                    return res.status(400).json({
                    success: false,
                    message: 'Reply comment does not belong to the same blog',
                    });
                }

                await Comment.findByIdAndUpdate(replyingTo, {
                    $push: { replies: newComment._id },
                    $inc: { repliesCount: 1 },
                });
            }

            await newComment.populate('user', 'username avatar isVerified');

            if (blogExists.author.notification.comment) {
                createNotification(
                    blogExists.author._id,
                    req.user._id,
                    'comment',
                    { id: newComment._id, type: 'Comment' },
                    `${req.user.username} commented on your post`,
                    `${req.user.username} shared his thoughts on your article: 
                        '${newComment.content.slice(0, 20)}...' — join the discussion!`,
                    `/blog/${id}/comment#${newComment._id}`,
                );
            }

            return res.status(201).json({
                success: true,
                comment: newComment.toObject(),
            });
        } catch (error) {
            console.error('Error adding comment:', error);
            return res.status(500).json({
                success: false,
                message: 'Server Error. Please try again later.',
            });
        }
    }


    static async updateComment(req, res) {
        const { id } = req.params;
        const { content } = req.body;

        try {
            // Find the comment by ID
            const comment = await Comment.findById(id);
            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: 'Comment not found'
                });
            }

            // Update the comment content
            comment.content = content;
            comment.updatedAt = new Date(); // Update the timestamp
            await comment.save();

            return res.status(200).json({
                success: true,
                comment: comment.toObject() // Convert to plain object
            });
        } catch (error) {
            console.error('Error updating comment:', error);
            return res.status(500).json({
                success: false,
                message: 'Server Error. Please try again later.'
            });
        }
    }

    static async deleteComment(req, res) {
        const { id } = req.params;

        try {
            // Find the comment by ID
            const comment = await Comment.deleteOne({ _id: id });
            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: 'Comment not found'
                });
            }

            return res.status(200).json({
                success: true,
                message: 'Comment deleted successfully'
            });
        } catch (error) {
            console.error('Error deleting comment:', error);
            return res.status(500).json({
                success: false,
                message: 'Server Error. Please try again later.'
            });
        }
    }

    static async toggleCommentLike(req, res) {
        const { id } = req.params;
        const { blogId } = req.body; // Get blogId from request body

        try {
            const blog = await Blog.findOne({ _id: blogId }, { author: 1 }).populate('author', 'notification');
            // Find the comment by ID
            const comment = await Comment.findById(id)
            if (!comment) {
                return res.status(404).json({
                    success: false,
                    message: 'Comment not found'
                });
            }

            // Check if the user has already liked the comment
            const userId = req.user.id;

            const hasLiked = comment.likes?.includes(userId);

            if (hasLiked) {
                // Remove like
                comment.likes.pull(userId);
            } else {
                // Add like
                comment.likes.push(userId);
            }

            const isAuthorLiked = blog.author.equals(userId);
            console.log("Author: ", blog.author, "User: ", userId, "isAuthorLiked: ", isAuthorLiked);

            // Update the like status
            comment.isAuthorLiked = isAuthorLiked;
            comment.liked = !hasLiked;
            comment.likeCount = comment.likes.length;

            await comment.save();

            if (!hasLiked && blog.author.notification.like) {
                createNotification(
                    comment.user,
                    blog.author._id,
                    'like',
                    { id: comment._id, type: 'Like' },
                    `${req.user.username} liked your comment ${isAuthorLiked ? '🧡' : ''}`,
                    `${isAuthorLiked ? 'The author appreciated your comment on '
                    + blog.title + ' — your voice matters!' :
                    `${req.user.username} liked your comment on '${blog.title}' — keep sharing your thoughts!`}`,
                    `/blog/${blogId}/comment#${comment._id}`,
                );
            }

            return res.status(200).json({
                success: true,
                liked: !hasLiked, // Return the new like status
                likeCount: comment.likes.length
            });
        } catch (error) {
            console.error('Error toggling comment like:', error);
            return res.status(500).json({
                success: false,
                message: 'Server Error. Please try again later.'
            });
        }
    }

    static async getUserBlogs(req, res) {
        const { username } = req.params;
        const { limit, offset } = req.query;

        try {
            const exists = await User.findOne({ username }, { _id: 1 });
            if (!exists) {
                return res.status(404).json({
                    success: false,
                    message: 'User not found'
                });
            }

            const blogs = await Blog.find({ author: exists._id })
                .skip(parseInt(offset) || 0)
                .limit(parseInt(limit) || 10)
                .sort({ createdAt: -1 }) // Sort by creation date, newest first
                .populate('author', 'username avatar isVerified bio followers following')
                .lean(); // Use lean to get plain JavaScript objects
           
            return res.status(200).json({
                success: true,
                blogs
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                success: false,
                message: error.message
            })
        }

        }
}

export default BlogController;
