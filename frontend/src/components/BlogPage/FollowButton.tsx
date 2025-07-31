import React from 'react'

interface FollowButtonProps {
  initialFollows?: number;
  initialFollowed?: boolean;
  onFollowChange?: (followCount: number, followed: boolean) => void;
  userId: string;
  clickable?: boolean;
  withNumber?: boolean;
  style?: string;
}

const FollowButton: React.FC<FollowButtonProps> = ({
  initialFollows = 0,
  initialFollowed = false,
  onFollowChange,
  userId,
  clickable = true,
  withNumber = true,
  style,
}) => {

  const [isLoading, setIsLoading] = React.useState(false);
  const [isFollowed, setIsFollowed] = React.useState(initialFollowed);
  const [followCount, setFollowCount] = React.useState(initialFollows);
  const [isAnimating, setIsAnimating] = React.useState(false);

  useEffect(() => {
    setIsFollowed(initialFollowed);
    setFollowCount(initialFollows);
  }, [initialFollowed, initialFollows]);

  const handleFollow = () => {
    setIsAnimating(true);
    setIsLoading(true);
    
    try {
      const newFollowedState = !isFollowed;
      const newCount = newFollowedState ? followCount + 1 : followCount - 1;

      setIsFollowed(newFollowedState);
      setFollowCount(newCount);

      // Call the callback if provided
      setFollow(blogId);
      if (onFollowChange) {
        onFollowChange(newCount, newFollowedState);
      }

      // Reset animation state
      setTimeout(() => setIsAnimating(false), 300)
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
      ${isFollowed ? 
       :'bg-gradient-to-r from-amber-500 to-orange-500 text-white hover:from-amber-600 hover:to-orange-600' : 'bg-gray-300 text-gray-700'}
      ${isAnimating ? 'animate-pulse' : ''
      }`}
    >
      Follow
    </button>
  )
}
