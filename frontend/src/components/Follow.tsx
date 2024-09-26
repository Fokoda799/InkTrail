import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../pages/styles/RaedBlog.css';

interface FollowProps {
  targetUserId: string;
}

const Follow: React.FC<FollowProps> = ({targetUserId }) => {
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const checkFollowStatus = async () => {
      try {
        const response = await axios.get(`/api/v1/user/follow-status/${targetUserId}`);
        setIsFollowing(response.data.isFollowing);
        setIsLoading(false);
      } catch (error) {
        console.error('Error checking follow status:', error);
        setIsLoading(false);
      }
    };

    checkFollowStatus();
  }, [targetUserId]);

  const handleFollowToggle = async () => {
    try {
      setIsLoading(true);
      const response = await axios.post('/api/v1/user/follow', {
        targetUserId,
        action: isFollowing ? 'unfollow' : 'follow'
      });
      setIsFollowing(response.data.isFollowing);
    } catch (error) {
      console.error('Error toggling follow status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <span className="text-gray-700 cursor-not-allowed">
        Loading...
      </span>
    );
  }

  return (
    <span
      onClick={handleFollowToggle}
      className={`${
        isFollowing
          ? 'Unfollow'
          : 'Follow'
      }`}
    >
      {isFollowing ? 'Unfollow' : 'Follow'}
    </span>
  );
};

export default Follow;