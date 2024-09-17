import React from 'react';
import { Box, Typography, Container, Link, Grid } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light' ? theme.palette.grey[200] : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Company
            </Typography>
            <Link href="#" color="inherit" underline="none">
              About Us
            </Link>
            <br />
            <Link href="#" color="inherit" underline="none">
              Careers
            </Link>
            <br />
            <Link href="#" color="inherit" underline="none">
              Contact
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Resources
            </Typography>
            <Link href="#" color="inherit" underline="none">
              Blog
            </Link>
            <br />
            <Link href="#" color="inherit" underline="none">
              Support
            </Link>
            <br />
            <Link href="#" color="inherit" underline="none">
              Documentation
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Legal
            </Typography>
            <Link href="#" color="inherit" underline="none">
              Privacy Policy
            </Link>
            <br />
            <Link href="#" color="inherit" underline="none">
              Terms of Service
            </Link>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Social Media
            </Typography>
            <Link href="#" color="inherit" underline="none">
              Facebook
            </Link>
            <br />
            <Link href="#" color="inherit" underline="none">
              Twitter
            </Link>
            <br />
            <Link href="#" color="inherit" underline="none">
              LinkedIn
            </Link>
          </Grid>
        </Grid>

        <Box mt={4} textAlign="center">
          <Typography variant="body2" color="text.secondary">
            &copy; {new Date().getFullYear()} InkTrail. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;
