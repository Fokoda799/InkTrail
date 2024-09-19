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
      <Container maxWidth="lg" disableGutters>
        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Company
            </Typography>
            <Typography>
              <Link href="#" color="inherit" underline="none" aria-label="Visit About Us page">
                About Us
              </Link>
            </Typography>
            <Typography>
              <Link href="#" color="inherit" underline="none" aria-label="Visit Careers page">
                Careers
              </Link>
            </Typography>
            <Typography>
              <Link href="#" color="inherit" underline="none" aria-label="Visit Contact page">
                Contact
              </Link>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Resources
            </Typography>
            <Typography>
              <Link href="#" color="inherit" underline="none" aria-label="Visit Blog page">
                Blog
              </Link>
            </Typography>
            <Typography>
              <Link href="#" color="inherit" underline="none" aria-label="Visit Support page">
                Support
              </Link>
            </Typography>
            <Typography>
              <Link href="#" color="inherit" underline="none" aria-label="Visit Documentation page">
                Documentation
              </Link>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Legal
            </Typography>
            <Typography>
              <Link href="#" color="inherit" underline="none" aria-label="View Privacy Policy">
                Privacy Policy
              </Link>
            </Typography>
            <Typography>
              <Link href="#" color="inherit" underline="none" aria-label="View Terms of Service">
                Terms of Service
              </Link>
            </Typography>
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <Typography variant="h6" color="text.primary" gutterBottom>
              Social Media
            </Typography>
            <Typography>
              <Link href="#" color="inherit" underline="none" aria-label="Visit Facebook page">
                Facebook
              </Link>
            </Typography>
            <Typography>
              <Link href="#" color="inherit" underline="none" aria-label="Visit Twitter page">
                Twitter
              </Link>
            </Typography>
            <Typography>
              <Link href="#" color="inherit" underline="none" aria-label="Visit LinkedIn page">
                LinkedIn
              </Link>
            </Typography>
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
