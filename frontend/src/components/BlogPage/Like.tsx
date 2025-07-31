import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';
import { useData } from '../../context/dataContext';

interface LikeButtonProps {
  initialLikes?: number;
  initialLiked?: boolean;
  onLikeChange?: (likeCount: number, liked: boolean) => void;
  blogId: string;
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  withNumber?: boolean;
  style?: string;
}

const LikeButton: React.FC<LikeButtonProps> = ({
  initialLikes = 0,
  initialLiked = false,
  onLikeChange,
  blogId,
  size = 'md',
  clickable = true,
  withNumber = true,
  style,
}) => {
  const { setLike } = useData();

  const [isLoading, setIsLoading] = useState(false);
  const [isLiked, setIsLiked] = useState(initialLiked);
  const [likeCount, setLikeCount] = useState(initialLikes);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsLiked(initialLiked);
    setLikeCount(initialLikes);
  }, [initialLiked, initialLikes]);

  const sizeClasses = {
    sm: {
      button: 'px-3 py-2 text-sm',
      icon: 'w-4 h-4',
      text: 'text-sm'
    },
    md: {
      button: 'px-4 py-2',
      icon: 'w-5 h-5',
      text: 'text-base'
    },
    lg: {
      button: 'px-6 py-3 text-lg',
      icon: 'w-6 h-6',
      text: 'text-lg'
    }
  };

  const handleLike = () => {
    setIsAnimating(true);
    setIsLoading(true);
    
    try {
      const newLikedState = !isLiked;
      const newCount = newLikedState ? likeCount + 1 : likeCount - 1;
      
      setIsLiked(newLikedState);
      setLikeCount(newCount);
      
      // Call the callback if provided
      setLike(blogId);
      if (onLikeChange) {
        onLikeChange(newCount, newLikedState);
      }
      
      // Reset animation state
      setTimeout(() => setIsAnimating(false), 300)
    } catch (error) {
      console.error('Error updating like state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={clickable ? handleLike : undefined}
      className={`
        inline-flex items-center gap-1 
        ${style || 'rounded-full border transition-all duration-200 ease-out'}
        ${sizeClasses[size].button}
        ${isLiked 
          ? 'bg-red-50 border-red-200 text-red-600 hover:bg-red-100 hover:border-red-300' 
          : !style && 'bg-gray-100 border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300'
        }
        ${style || 'hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50'}
      `}
    >
      <Heart
        className={`
          ${sizeClasses[size].icon}
          transition-all duration-200 ease-out
          ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-400'}
          ${isAnimating ? 'scale-125' : 'scale-100'}
        `}
      />
      {withNumber && <span className={`font-medium ${sizeClasses[size].text}`}>
        {likeCount.toLocaleString()}
      </span>}

    </button>
  );
};

export default LikeButton;