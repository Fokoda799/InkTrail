import { useNavigate } from 'react-router-dom';

export default function useToProfile(userId: string) {
  const navigate = useNavigate();

  const toProfile = () => {
    navigate(`/profile/${userId}`);
  };

  return { toProfile };
  
}
