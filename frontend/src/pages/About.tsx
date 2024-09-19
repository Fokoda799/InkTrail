import { Container, Box, Typography, Grid, Card, CardContent, Avatar } from '@mui/material';

const About = () => {
  const handleRedirect = () => {
    window.open('https://www.linkedin.com/in/fokoda-code/', '_blank');
  };
  const teamMembers = [
    { name: 'Abdellah Nait Hadid', role: 'CEO', avatar: 'https://via.placeholder.com/150' },
  ];

  return (
    <Container sx={{ marginBottom: 10 }}>
      {/* Intro Section */}
      <Box sx={{ py: 5 }}>
        <Typography variant="h4" align="center" gutterBottom>
          About Us
        </Typography>
        <Typography variant="body1" align="center" sx={{ mx: 'auto', maxWidth: '800px' }}>
          Welcome to our platform! We are committed to delivering exceptional services and fostering an engaging community.
          Our goal is to revolutionize the way you experience InkTrail. With a dedicated team and innovative 
          solutions, we are constantly striving to push boundaries.
        </Typography>
      </Box>

      {/* Mission Section */}
      <Box sx={{ py: 5, backgroundColor: '#f5f5f5', textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Our Mission
        </Typography>
        <Typography variant="body1" sx={{ mx: 'auto', maxWidth: '800px' }}>
          To provide the best solutions that empower individuals and businesses alike. We believe in making a difference
          through cutting-edge technology and a customer-centric approach.
        </Typography>
      </Box>

      {/* Vision Section */}
      <Box sx={{ py: 5 }}>
        <Typography variant="h5" align="center" gutterBottom>
          Our Vision
        </Typography>
        <Typography variant="body1" align="center" sx={{ mx: 'auto', maxWidth: '800px' }}>
          To be a global leader in Tech, recognized for our commitment to innovation and excellence.
        </Typography>
      </Box>

      {/* Team Section */}
      <Box sx={{ py: 5, backgroundColor: '#f5f5f5', textAlign: 'center' }}>
        <Typography variant="h5" gutterBottom>
          Meet Our Team
        </Typography>
        <Grid container spacing={3} justifyContent="center">
          {teamMembers.map((member, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card onClick={handleRedirect} sx={{ cursor: 'pointer' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <Avatar alt={member.name} src={member.avatar} sx={{ width: 80, height: 80, mb: 2 }} />
                  <Typography variant="h6">{member.name}</Typography>
                  <Typography variant="body2" color="text.secondary">
                    {member.role}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Container>
  );
};

export default About;
