import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange, deepPurple } from '@mui/material/colors';

interface LetterAvatarsProps {
    username: string;
}

export default function LetterAvatars({username}: LetterAvatarsProps) {
  const firstLetter = username.charAt(0).toUpperCase();
  return (
    <Stack direction="row" spacing={2}>
      <Avatar>{firstLetter}</Avatar>
    </Stack>
  );
}
