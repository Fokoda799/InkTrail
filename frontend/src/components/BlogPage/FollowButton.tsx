import React, { useEffect } from 'react';
import { useData } from '../../context/dataContext';

interface FollowButtonProps {
  initialFollows?: number;
  initialFollowed?: boolean;
  onFollowChange?: (followCount: number, followed: boolean) => void;
  authorId: string | undefined;
  clickable?: boolean;
  withNumber?: boolean;
  style?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  initialFollows = 0,
  initialFollowed = false,
  onFollowChange,
  authorId,
  clickable = true,
}) => {

  const { setAction } = useData();

  const [isLoading, setIsLoading] = React.useState(false);
  const [isFollowed, setIsFollowed] = React.useState(initialFollowed);
  const [followCount, setFollowCount] = React.useState(initialFollows);
  const [isAnimating, setIsAnimating] = React.useState(false);

  useEffect(() => {
    setIsFollowed(initialFollowed);
    setFollowCount(initialFollows);
  }, [initialFollowed, initialFollows]);

  console.log('1. Animation: ', isAnimating);

  const handleFollow = async () => {
    setIsAnimating(true);
    setIsLoading(true);

    console.log('2. Animation: ', isAnimating);
    
    try {
      const newFollowedState = !isFollowed;
      const newCount = newFollowedState ? followCount + 1 : followCount - 1;

      setIsFollowed(newFollowedState);
      setFollowCount(newCount);

      // Call the callback if provided
      // Note: setFollow function is not defined in your code - you might need to implement this
      if (!authorId || !setAction) {
        console.error('Blog ID: ', authorId);
        console.error('setFollow function is not defined');
        setIsLoading(false);
        return;
      }

      await setAction(authorId, 'follow');
      if (onFollowChange) {
        onFollowChange(newCount, newFollowedState);
      }

      // Reset animation state
      setTimeout(() => setIsAnimating(false), 1000);
    } catch (error) {
      console.error('Error updating follow state:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      onClick={clickable ? handleFollow : undefined}
      className={`px-6 py-2 rounded-full font-semibold transition-all duration-200 
        ${!isFollowed 
          ? 'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600' 
          : 'bg-gray-300 text-gray-700'}
        ${isAnimating ? 'animate-pulse' : ''}
      `}
      disabled={isLoading}
    >
      {isFollowed ? 'Following' : 'Follow'}
    </button>
  );
};

export default FollowButton;