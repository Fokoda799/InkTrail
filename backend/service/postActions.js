import Blog from "../models/blogModel.js";
import User from "../models/userModel.js";
import Notification from "../models/notificationModel.js";

export const createNotification = async (recipient, sender, type, target, title, message, link = '', relatedContent) => {
  const notification = await Notification.addNotification({
    recipient,
    sender,
    type,
    target,
    title,
    message,
    link,
    relatedContent
  })

  if (!notification) {
    console.error(`❌ Error creating notification for ${type} action`);
  }

  console.log(`Notification created for ${type} action`);
}

export const handlePostActions = async (actionType, req) => {

  let blogDoc;
  let authorDoc;

  if (actionType === "follow") {
    authorDoc = await User.findById(req.params.id);
  } else {
    blogDoc = await Blog.findById(req.params.id); 
    authorDoc = await User.findById(blogDoc.author);
  }


  const user = await User.findById(req.user._id);

  try {
    switch (actionType) {
      case 'like':
        // Handle like action
        // Check if user already liked the blog
        const existingLikeIndex = blogDoc.likes.findIndex(like => like.user.toString() === req.user._id.toString());
        
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

        if (!(existingLikeIndex > -1) && authorDoc.notification.like) {
          createNotification(
            authorDoc._id,
            req.user._id,
            'like',
            { id: blogDoc._id, type: 'Blog' },
            `${req.user.username} liked your post`,
            `${req.user.username} enjoyed your article: '${blogDoc.title}' — keep inspiring minds!`,
            `/blog/${blogDoc._id}`,
          );
        }

        return blogDoc._id.toString();
      case 'bookmark':
        // Handle bookmark action


        // Check if user already liked the blog
        const BookMarked = blogDoc.bookmarks.includes(req.user._id);

        if (BookMarked) {
            // User already bookmarked, remove the bookmark
            blogDoc.bookmarks.pull(req.user._id);
            user.bookmarks.pull(blogDoc._id);
            console.log(`Bookmark removed`);
        } else {
            // User hasn't bookmarked, add the bookmark
            blogDoc.bookmarks.push(req.user._id);
            user.bookmarks.push(blogDoc._id);
            console.log(`Bookmark added`);
        }

        await user.save();
        await blogDoc.save();
        return blogDoc._id.toString();

      case 'follow':
        // Check if user is already following the author
        const me = user._id.toString() === authorDoc._id.toString();
        const isFollowing = user.following.includes(authorDoc._id);

        if (me) {
          throw new Error('You cannot follow yourself');
        }

        if (isFollowing) {
            // User is already following, remove the author from following list
            user.following.pull(authorDoc._id);
            authorDoc.followers.pull(user._id);
            console.log(`Unfollowed author`);
        } else {
            // User is not following, add the author to following list
            user.following.push(authorDoc._id);
            authorDoc.followers.push(user._id);
            console.log(`Followed author`);
        }

        await user.save();
        await authorDoc.save();

        if (!(isFollowing) && authorDoc.notification.follow) {
          createNotification(
            authorDoc._id,
            req.user._id,
            'follow',
            { id: authorDoc._id, type: 'User' }, 
            `${req.user.username} started following you`,
            `${req.user.username} just joined your learning journey`,
            `/profile/${req.user.username}`,
          );
        }

        return authorDoc._id.toString();
      case 'view':
        // Handle view action
        const viewed = user.history.includes(blogDoc._id);

        if (!viewed) {
          user.history.push(blogDoc._id);
          blogDoc.views += 1;
          console.log(`View added`);
        }

        await user.save();
        await blogDoc.save();
        return blogDoc._id.toString();
      default:
        throw new Error('Invalid action type');
    }
  } catch (error) {
    console.error('Error handling post action:', error);
    throw error;
  }
}