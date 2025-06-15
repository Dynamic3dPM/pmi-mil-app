import React from 'react';
import { Container, Typography, Box } from '@mui/material';
import Layout from '../components/layout/Layout';
import ProfileForm from '../components/profile/ProfileForm';

const Profile = () => {
  return (
    <Layout>
      <Container maxWidth="lg">
        <Box py={4}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            My Profile
          </Typography>
          <ProfileForm />
        </Box>
      </Container>
    </Layout>
  );
};

export default Profile;
