import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
interface LetterAvatarsProps {
    username: string;
}

interface SX {
  width: number | string;
  height: number | string;
  margin: string | number;
}

export default function LetterAvatars({username}: LetterAvatarsProps, sx?: SX) {
  const firstLetter = username.charAt(0).toUpperCase();
  return (
    
  );
}
