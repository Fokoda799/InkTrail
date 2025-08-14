import React, { useEffect, useState } from 'react';
import { Bookmark } from 'lucide-react';
import { useData } from '../../context/dataContext';

interface BookMarkButtonProps {
  initialBookmarked?: boolean;
  initialBookmarkCount?: number;
  onBookmarkChange?: (bookmarked: boolean) => void;
  blogId: string;
  size?: 'sm' | 'md' | 'lg';
  clickable?: boolean;
  withNumber?: boolean;
  style?: string;
}

const BookMarkButton: React.FC<BookMarkButtonProps> = ({
  initialBookmarked = false,
  initialBookmarkCount = 0,
  onBookmarkChange,
  blogId,
  clickable = true,
  style,
}) => {
  const { setAction } = useData();

  const [isBookmarked, setIsBookmarked] = useState(initialBookmarked);
  const [bookmarkCount, setBookmarkCount] = useState(initialBookmarkCount);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    setIsBookmarked(initialBookmarked);
    setBookmarkCount(initialBookmarkCount);
  }, [initialBookmarked, initialBookmarkCount]);

  const handleBookmark = () => {
    setIsAnimating(true);
    
    try {
      const newBookmarkedState = !isBookmarked;
      const newCount = newBookmarkedState ? bookmarkCount + 1 : bookmarkCount - 1;

      setIsBookmarked(newBookmarkedState);
      setBookmarkCount(newCount);

      // Call the callback if provided
      setAction(blogId, 'bookmark');
      if (onBookmarkChange) {
        onBookmarkChange(newBookmarkedState);
      }
      
      // Reset animation state
      setTimeout(() => setIsAnimating(false), 300)
    } catch (error) {
      console.error('Error updating like state:', error);
    }
  };

  return (
    <button
      onClick={clickable ? handleBookmark : undefined}
      className={`
        rounded-full transition-all duration-200 ease-out
        ${style || ''}
        ${isBookmarked
          ? 'bg-red-50 border-orange-200 text-red-600 hover:bg-orange-100 hover:border-orange-300'
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }
        hover:shadow-md active:scale-95 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50
      `}
    >
      <Bookmark
        className={`
          w-5 h-5
          transition-all duration-200 ease-out
          ${isBookmarked ? 'fill-orange-500 text-orange-500' : ''}
          ${isAnimating ? 'scale-125' : 'scale-100'}
        `}
      />
    </button>
  );
};

export default BookMarkButton;