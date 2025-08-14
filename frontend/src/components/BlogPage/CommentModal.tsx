import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, Heart, Reply, Edit2, Trash2, Send, 
  User, CheckCircle, Loader2, AlertCircle, X,
  ArrowDown,
  ArrowRight
} from 'lucide-react';
import { useData } from '../../context/dataContext';
import { Comment } from '../../types/blogTypes';
import { useAuth } from '../../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface CommentSectionProps {
  blogId: string;
  isOpen: boolean;
  onClose: () => void;
  highlightComment: {
    highlightComment: boolean;
    hashText: string | null;
  };
}

interface CommentItemProps {
  comment: Comment;
  currentUserId?: string;
  onReply: (parentId: string) => void;
  onEdit: (comment: Comment) => void;
  onDelete: (commentId: string) => void;
  onLike: (commentId: string) => void;
  highlightComment?: {
    highlightComment: boolean;
    hashText: string | null;
  };
  level?: number;
}

const CommentItem: React.FC<CommentItemProps> = ({
  comment,
  currentUserId,
  onReply,
  onEdit,
  onDelete,
  onLike,
  highlightComment,
  level = 0
}) => {
  const [liked, setLiked] = useState(comment.liked || false);
  const [likeCount, setLikeCount] = useState(comment.likeCount || 0);
  const [showReplies, setShowReplies] = useState(false);
  const highlight = highlightComment?.highlightComment && highlightComment?.hashText === comment._id;

  const navigate = useNavigate();

  const author = comment.user;
  const isOwner = currentUserId === author._id;
  const isPostAuthor = comment.isAuthor || false; // Content owner
  const isAuthorLiked = comment.isAuthorLiked || false; // Liked by author badge

  const maxLevel = 3;

  // Format relative time for display
  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

    return date.toLocaleDateString();
  };

  // Handle like toggle
  const handleLikeComment = () => {
    onLike(comment._id);
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
  };

  return (
    <div
      id={comment._id}
      className={`${level > 0 ? 'ml-6 mt-1 pl-4 border-l-2 border-gray-100' : 'mb-2'} ${
        isAuthorLiked ? 'relative' : ''
      }`}
    >

      {/* Badge if liked by author but not the author’s own comment */}
      {isAuthorLiked && !isPostAuthor && (
        <div className="absolute -top-2 -right-2 z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full blur-sm opacity-75 animate-pulse"></div>
            <div className="relative bg-gradient-to-r from-amber-400 to-orange-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg flex items-center gap-1">
              ❤️ by {author.username}
            </div>
          </div>
        </div>
      )}

      {/* Main comment container */}
      <div
        className={`rounded-lg p-4 ${
          highlight
            ? 'bg-gradient-to-r from-yellow-100 to-red-100 border border-orange-200 animate-pulse'
            : isPostAuthor
            ? 'border-2 border-blue-300 bg-blue-50'
            : isAuthorLiked
            ? 'bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200'
            : 'bg-white border border-gray-200'
        }`}
      >
        <div className="flex gap-3">
          {/* Avatar with special rings for author / author-liked */}
          <div
            onClick={() => navigate(`/profile/${author.username}`)}
            className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden cursor-pointer ${
              isAuthorLiked
                ? 'bg-gradient-to-br from-amber-400 to-orange-500 ring-2 ring-amber-300 ring-offset-2'
                : isPostAuthor
                ? 'bg-gradient-to-br from-blue-400 to-blue-600 ring-2 ring-blue-300 ring-offset-2'
                : 'bg-gradient-to-br from-gray-400 to-gray-600'
            }`}
          >
            {author.avatar ? (
              <img
                src={author.avatar}
                alt={author.username}
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="w-4 h-4 text-white" />
            )}
          </div>

          {/* Comment content */}
          <div className="flex-1 min-w-0">
            {/* Header: username, verified, author badge, author liked badge, time */}
            <div className="flex items-center gap-2 mb-1 flex-wrap">
              <span className="font-semibold text-gray-900 text-sm">{author.username}</span>
              {author.isVerified && <CheckCircle className="w-3 h-3 text-blue-500" />}

              {isPostAuthor && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-0.5 rounded-full">Author</span>
              )}

              {isAuthorLiked && !isPostAuthor && (
                <div className="flex items-center gap-1 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 px-2 py-0.5 rounded-full text-xs font-medium">
                  <Heart className="w-2.5 h-2.5 fill-current" />
                  Loved by author
                </div>
              )}

              <span className="text-xs text-gray-500">{formatTimeAgo(comment.createdAt)}</span>
            </div>

            {/* Comment text */}
            <div
              className={`text-gray-700 text-sm mb-3 leading-relaxed rounded-lg p-3 ${
                isAuthorLiked
                  ? 'bg-white border border-amber-100'
                  : isPostAuthor
                  ? 'bg-white border border-blue-100'
                  : 'bg-gray-50'
              }`}
            >
              {comment.content}
            </div>

            {/* Actions: Like, Reply, Edit, Delete */}
            <div className="flex items-center gap-4 text-xs">
              <button
                onClick={handleLikeComment}
                className={`flex items-center gap-1 px-2 py-1 rounded-full hover:bg-red-50 transition-all ${
                  liked ? 'text-red-600 bg-red-50' : 'text-gray-500 hover:text-red-600'
                }`}
              >
                <Heart className={`w-3 h-3 ${liked ? 'fill-current' : ''}`} />
                <span>{likeCount}</span>
              </button>

              {level < maxLevel && (
                <button
                  onClick={() => onReply(comment._id)}
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-all"
                >
                  <Reply className="w-3 h-3" />
                  <span>Reply</span>
                </button>
              )}
                <button
                  onClick={() => setShowReplies(!showReplies)}
                  className="flex items-center gap-1 px-2 py-1 rounded-full text-gray-500 hover:text-amber-600 hover:bg-amber-50 transition-all"
                >
                  {showReplies ? (
                    <ArrowDown className="w-3 h-3" />
                  ) : (
                    <ArrowRight className="w-3 h-3" />
                  )}
                  <span>{comment.repliesCount} Replies</span>
                </button>

              {isOwner && (
                <>
                  <button
                    onClick={() => onEdit(comment)}
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-all"
                  >
                    <Edit2 className="w-3 h-3" />
                    <span>Edit</span>
                  </button>
                  <button
                    onClick={() => onDelete(comment._id)}
                    className="flex items-center gap-1 px-2 py-1 rounded-full text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all"
                  >
                    <Trash2 className="w-3 h-3" />
                    <span>Delete</span>
                  </button>
                </>
              )}
            </div>

            {/* Nested replies */}
            {comment.replies && comment.replies.length > 0 && showReplies && (
              <div className="mt-4">
                {comment.replies.map((reply: Comment) => (
                  <CommentItem
                    key={reply._id}
                    comment={reply}
                    currentUserId={currentUserId}
                    onReply={onReply}
                    onEdit={onEdit}
                    onDelete={onDelete}
                    onLike={onLike}
                    level={level + 1}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};


const CommentSection: React.FC<CommentSectionProps> = ({ blogId, isOpen, onClose, highlightComment }) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [newComment, setNewComment] = useState('');
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [editingComment, setEditingComment] = useState<Comment | null>(null);
  const [editContent, setEditContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [isAtBottom, setIsAtBottom] = useState(false);

  const { user: currentUser } = useAuth();
  const { CommentActions } = useData();

  // Load comments when modal opens
  useEffect(() => {
    if (isOpen && blogId) {
      loadComments();
    }
  }, [isOpen, blogId]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const element = e.currentTarget;
    const bottom = element.scrollHeight - element.scrollTop === element.clientHeight;
    setIsAtBottom(bottom);
  };

  const loadComments = async () => {
    setLoading(true);
    setError(null);
    try {
      const commentsData = await CommentActions.getComments(blogId);
      setComments(commentsData);
    } catch (err) {
      setError('Failed to load comments');
      console.error('Error loading comments:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || !currentUser) return;

    setSubmitting(true);
    try {
      const comment = await CommentActions.addComment(blogId, newComment, replyingTo || undefined);
      
      console.log('Received comment:', comment); // Debug log

      if (replyingTo) {
        setComments(prev => {
          const updated = updateCommentsWithReply(prev, replyingTo, comment);
          console.log('Updated with reply:', updated);
          return updated;
        });
        setReplyingTo(null);
      } else {
        setComments(prev => {
          const newComments = [comment, ...prev];
          console.log('New comments state:', newComments); // Debug log
          return newComments;
        });
      }
      
      setNewComment('');
    } catch (err) {
      setError('Failed to add comment');
      console.error('Error adding comment:', err);
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    console.log("Comments: ", comments);
  }, [comments])

  const updateCommentsWithReply = (comments: Comment[], parentId: string, reply: Comment): Comment[] => {
    return comments.map(comment => {
      if (comment._id === parentId) {
        return {
          ...comment,
          replies: [...(comment.replies || []), reply],
          repliesCount: (comment.repliesCount || 0) + 1
        };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: updateCommentsWithReply(comment.replies, parentId, reply)
        };
      }
      return comment;
    });
  };

  const handleEditComment = async () => {
    if (!editContent.trim() || !editingComment) return;

    try {
      await CommentActions.updateComment(editingComment._id, editContent);
      setComments(prev => updateCommentContent(prev, editingComment._id, editContent));
      setEditingComment(null);
      setEditContent('');
    } catch (err) {
      setError('Failed to update comment');
      console.error('Error updating comment:', err);
    }
  };

  const updateCommentContent = (comments: Comment[], commentId: string, content: string): Comment[] => {
    return comments.map(comment => {
      if (comment._id === commentId) {
        return { ...comment, content };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: updateCommentContent(comment.replies, commentId, content)
        };
      }
      return comment;
    });
  };

  const handleDeleteComment = async (commentId: string) => {
    if (!confirm('Are you sure you want to delete this comment?')) return;

    try {
      await CommentActions.deleteComment(commentId);
      setComments(prev => removeComment(prev, commentId));
    } catch (err) {
      setError('Failed to delete comment');
      console.error('Error deleting comment:', err);
    }
  };

  const removeComment = (comments: Comment[], commentId: string): Comment[] => {
    return comments.filter(comment => {
      if (comment._id === commentId) return false;
      if (comment.replies) {
        comment.replies = removeComment(comment.replies, commentId);
      }
      return true;
    });
  };

  const handleLikeComment = async (commentId: string) => {
    if (!currentUser) return;

    try {
      const { liked, likeCount } = await CommentActions.toggleCommentLike(commentId, blogId);
      setComments(prev => updateCommentLike(prev, commentId, liked, likeCount));
    } catch (err) {
      setError('Failed to like comment');
      console.error('Error liking comment:', err);
    }
  };

  const updateCommentLike = (comments: Comment[], commentId: string, liked: boolean, likeCount: number): Comment[] => {
    return comments.map(comment => {
      if (comment._id === commentId) {
        return { ...comment, liked, likeCount };
      }
      if (comment.replies) {
        return {
          ...comment,
          replies: updateCommentLike(comment.replies, commentId, liked, likeCount)
        };
      }
      return comment;
    });
  };

  const startReply = (parentId: string) => {
    console.log('Starting reply to comment:', parentId);
    setReplyingTo(parentId);
    setNewComment('');
  };

  const startEdit = (comment: Comment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[85vh] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-amber-50 to-orange-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                Comments
              </h3>
              <p className="text-sm text-gray-600">{comments.length} {comments.length === 1 ? 'comment' : 'comments'}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-white/50 transition-colors"
          >
            <X className="w-5 h-5 text-gray-600" />
          </button>
        </div>

        {/* Error message */}
        {error && (
          <div className="p-4 bg-red-50 border-b border-red-200">
            <div className="flex items-center gap-2 text-red-700">
              <AlertCircle className="w-4 h-4" />
              <span className="text-sm">{error}</span>
              <button 
                onClick={() => setError(null)}
                className="ml-auto text-red-600 hover:text-red-800"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Comment input */}
        {currentUser && (
          <div className="p-6 border-b border-gray-200 bg-gray-50">
            {editingComment ? (
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Edit2 className="w-4 h-4" />
                  <span>Editing comment</span>
                </div>
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                  rows={3}
                  placeholder="Edit your comment..."
                />
                <div className="flex gap-3">
                  <button
                    onClick={handleEditComment}
                    disabled={!editContent.trim()}
                    className="px-6 py-2 bg-amber-500 text-white rounded-lg hover:bg-amber-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all text-sm font-medium"
                  >
                    Save Changes
                  </button>
                  <button
                    onClick={() => {
                      setEditingComment(null);
                      setEditContent('');
                    }}
                    className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all text-sm font-medium"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {replyingTo && (
                  <div className="flex items-center gap-2 text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                    <Reply className="w-4 h-4" />
                    <span>Replying to comment</span>
                    <button
                      onClick={() => setReplyingTo(null)}
                      className="ml-auto text-red-600 hover:text-red-700 p-1"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                    {currentUser.avatar ? (
                      <img
                        src={currentUser.avatar}
                        alt={currentUser.username}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-5 h-5 text-white" />
                    )}
                  </div>
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder={replyingTo ? "Write a thoughtful reply..." : "Share your thoughts..."}
                      className="w-full p-4 border border-gray-200 rounded-xl resize-none focus:ring-2 focus:ring-amber-500 focus:border-transparent transition-all"
                      rows={3}
                    />
                    <div className="flex justify-end mt-3">
                      <button
                        onClick={handleAddComment}
                        disabled={!newComment.trim() || submitting}
                        className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all font-medium"
                      >
                        {submitting ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          <Send className="w-4 h-4" />
                        )}
                        {replyingTo ? 'Reply' : 'Comment'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto" style={{ 
          maxHeight: 'calc(85vh - 300px)', // Adjust based on your header/footer heights
          minHeight: '200px' // Ensure minimum space
        }}
          onScroll={handleScroll}
        >
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="text-center">
                <Loader2 className="w-8 h-8 animate-spin text-amber-500 mx-auto mb-3" />
                <span className="text-gray-600">Loading comments...</span>
              </div>
            </div>
          ) : comments.length === 0 ? (
            <div className="text-center py-12 px-6">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageCircle className="w-8 h-8 text-gray-400" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">No comments yet</h4>
              <p className="text-gray-500">Be the first to share your thoughts!</p>
            </div>
          ) : (
            <div className="p-6">
              {comments.map((comment) => (
                <CommentItem
                  key={'comment-' + comment._id}
                  comment={comment}
                  currentUserId={currentUser?._id}
                  onReply={startReply}
                  onEdit={startEdit}
                  onDelete={handleDeleteComment}
                  onLike={handleLikeComment}
                  highlightComment={highlightComment}
                />
              ))}
            </div>
          )}
          {comments.length > 0 && !isAtBottom && (
            <div className="text-center py-4 text-gray-500 text-sm">
              You've reached the end of comments
            </div>
          )}
        </div>

        {/* Auth prompt for non-authenticated users */}
        {!currentUser && (
          <div className="p-6 bg-gradient-to-r from-amber-50 to-orange-50 border-t border-gray-200 text-center">
            <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-3">
              <User className="w-6 h-6 text-white" />
            </div>
            <h4 className="font-semibold text-gray-900 mb-2">Join the conversation</h4>
            <p className="text-gray-600 mb-4">Sign in to share your thoughts and engage with the community</p>
            <button className="px-6 py-2 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-lg hover:from-amber-600 hover:to-orange-600 transition-all font-medium">
              Sign In
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommentSection;