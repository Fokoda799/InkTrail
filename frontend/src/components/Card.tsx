import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import CardActions from '@mui/material/CardActions';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { red } from '@mui/material/colors';
import FavoriteIcon from '@mui/icons-material/Favorite';
import ShareIcon from '@mui/icons-material/Share';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Blog } from '../types/blogTypes';
import { format } from 'date-fns';

export default function BlogCard({ title, content, image, userId, createdAt }: Blog) {
  const date = createdAt ? format(new Date(createdAt), 'MMMM dd, yyyy') : 'Unknown Date';

  // Check if userId exists and has a username
  const avatar = userId && userId.username ? (
    <Avatar alt={userId.username} src={userId.avatar || ''} />
  ) : (
    <Avatar sx={{ bgcolor: red[500] }} aria-label="recipe">
      {userId?.username?.[0]?.toUpperCase() || 'U'}
    </Avatar>
  );

  return (
    <Card sx={{ maxWidth: 345 }}>
      <CardHeader
        avatar={avatar}
        action={
          <IconButton aria-label="settings">
            <MoreVertIcon />
          </IconButton>
        }
        title={title}
        subheader={date}
      />
      <CardMedia
        component="img"
        height="194"
        image={image || 'https://via.placeholder.com/800x400'}
        alt={title}
      />
      <CardContent>
        <Typography variant="body2" color="text.secondary">
          {content.slice(0, 100)}...
        </Typography>
      </CardContent>
      <CardActions disableSpacing>
        <IconButton aria-label="add to favorites">
          <FavoriteIcon />
        </IconButton>
        <IconButton aria-label="share">
          <ShareIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
}
