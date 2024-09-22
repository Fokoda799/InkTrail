import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { Grid, Box, Stack } from '@mui/material';
import { red } from '@mui/material/colors';
import { Blog } from '../types/blogTypes';
import { format } from 'date-fns';
import ThumbUpTwoToneIcon from '@mui/icons-material/ThumbUpTwoTone';

export default function BlogCard({ title, content, image, author, createdAt, likes }: Blog) {
  const date = createdAt ? format(new Date(createdAt), 'MMMM dd, yyyy') : 'Unknown Date';

  return (
      <Card sx={{ Width: 400, minHeight: '200px', borderRadius: 3 }}>
        {/* Blog image */}
        <CardMedia
          component="img"
          height="200"
          image={image || 'https://via.placeholder.com/200x400'}
          alt={title}
          sx={{ borderRadius: '8px 8px 0 0' }} // Rounded corners for the top of the image
        />
      
        <CardContent sx={{ padding: 2 }}>
          {/* Blog category and like button (moved to right) */}
          <Grid container justifyContent="space-between" alignItems="center" sx={{ marginBottom: 1 }}>
            <Grid item>
              <Typography variant="caption" color="textSecondary" sx={{ textTransform: 'uppercase' }}>
                Engineering {/* Replace with a dynamic category */}
              </Typography>
            </Grid>
            <Grid item>
              <Stack direction="row" spacing={1} alignItems="center">
                <ThumbUpTwoToneIcon fontSize="small" />
                <Typography variant="body1" color="textSecondary">
                  {likes?.length || 0}
                </Typography>
              </Stack>
            </Grid>
          </Grid>
          {/* Blog title */}
          <Typography variant="h6" component="div" gutterBottom sx={{ fontWeight: 'bold' }}>
            {title}
          </Typography>
          {/* Blog summary */}
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2, maxHeight: 60, minHeight: 60 }}>
            {content.slice(0, 100)}... {/* Show a short preview of the content */}
          </Typography>
          {/* Blog footer: Author and Date */}
          <Grid container justifyContent="space-between" alignItems="center" sx={{ marginBottom: 0 }}>
            <Grid item>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {/* Author avatar and name */}
                {
                  author && author.username ? (
                    <Avatar alt={author.username} src={author.avatar || ''} sx={{ height: 20, width: 20 }} />
                  ) : (
                    <Avatar sx={{ bgcolor: red[500], height: 20, width: 20 }} aria-label="recipe">
                      {author?.username?.[0]?.toUpperCase() || 'U'}
                    </Avatar>
                  )
                }
                <Typography variant="body2" sx={{ marginLeft: 1 }}>
                  {author?.username || 'Unknown'}
                </Typography>
              </Box>
            </Grid>
            {/* Post date */}
            <Grid item>
              <Typography variant="body2" color="textSecondary">
                {date}
              </Typography>
            </Grid>
          </Grid>
        </CardContent>
      </Card>
  );
}
