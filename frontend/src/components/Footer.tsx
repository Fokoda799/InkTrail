import { Box, Typography, Container, Link, Grid } from '@mui/material';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
      }}
    >
      <Container maxWidth="lg" disableGutters>
        <Grid container spacing={1} sx={{ display: 'flex', flexDirection: 'column',
          justifyContent: 'center', alignItems: 'center'
         }}>
          <Grid item xs={12} sm={6} md={3}>
            <Typography>
                <Link href="/about" color="inherit" underline="none" aria-label="About us">
                  About us
                </Link>
            </Typography>
          </Grid>
          <Grid item
          sx={{ display: 'flex', flexDirection: 'row', width: 400,
            justifyItems: 'center', justifyContent: 'space-between'
           }}>
            <Typography>
              <Link href="#" color="inherit" underline="none" aria-label="Visit Facebook page">
                Discord
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
            <Typography>
              <Link href="#" color="inherit" underline="none" aria-label="Visit LinkedIn page">
                GitHub
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
