import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/client';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Grid,
  Avatar
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';
import { GET_ME } from '../../graphql/queries';
import { UPDATE_USER } from '../../graphql/mutations';

const ProfileForm = () => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    profileImage: '',
    linkedinUrl: '',
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  // Query current user data
  const { data: userData, loading: userLoading, refetch } = useQuery(GET_ME, {
    skip: !user,
    onCompleted: (data) => {
      if (data?.getCurrentUser) {
        setFormData({
          firstName: data.getCurrentUser.firstName || '',
          lastName: data.getCurrentUser.lastName || '',
          profileImage: data.getCurrentUser.profileImage || '',
          linkedinUrl: data.getCurrentUser.linkedinUrl || '',
        });
      }
    },
  });

  // Mutation for updating user profile
  const [updateUser] = useMutation(UPDATE_USER, {
    onCompleted: () => {
      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setLoading(false);
      refetch(); // Refresh user data
    },
    onError: (error) => {
      setMessage({ type: 'error', text: `Failed to update profile: ${error.message}` });
      setLoading(false);
    },
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    try {
      await updateUser({
        variables: {
          input: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            profileImage: formData.profileImage,
            linkedinUrl: formData.linkedinUrl,
          }
        }
      });
    } catch (error) {
      console.error('Profile update error:', error);
    }
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <Typography>Please sign in to view your profile.</Typography>
      </Box>
    );
  }

  if (userLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box maxWidth="600px" mx="auto" p={3}>
      <Card>
        <CardContent>
          <Typography variant="h5" component="h1" gutterBottom>
            Profile Settings
          </Typography>
          
          {message.text && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="First Name"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  variant="outlined"
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Profile Image URL"
                  name="profileImage"
                  value={formData.profileImage}
                  onChange={handleInputChange}
                  variant="outlined"
                  placeholder="https://www.linkedin.com/in/your-profile-picture"
                  helperText="Paste the direct URL of your LinkedIn photo"
                />
              </Grid>
              
              {/* Profile Picture Preview */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mt: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Profile Picture Preview:
                  </Typography>
                  <Avatar
                    src={formData.profileImage || undefined}
                    alt={`${formData.firstName} ${formData.lastName}`.trim()}
                    sx={{ 
                      width: 60, 
                      height: 60,
                      bgcolor: formData.profileImage ? 'transparent' : 'primary.main',
                      color: 'white'
                    }}
                  >
                    {!formData.profileImage && (
                      <>{formData.firstName?.[0]?.toUpperCase() || 'U'}{formData.lastName?.[0]?.toUpperCase() || ''}</>
                    )}
                  </Avatar>
                  {formData.profileImage && (
                    <Typography variant="caption" color="text.secondary">
                      Image loaded successfully
                    </Typography>
                  )}
                </Box>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="LinkedIn Profile URL"
                  name="linkedinUrl"
                  value={formData.linkedinUrl}
                  onChange={handleInputChange}
                  variant="outlined"
                  placeholder="https://www.linkedin.com/in/your-profile"
                  helperText="Paste the direct URL of your LinkedIn profile"
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size="large"
                  disabled={loading}
                  sx={{ mt: 2 }}
                >
                  {loading ? <CircularProgress size={24} /> : 'Update Profile'}
                </Button>
              </Grid>
            </Grid>
          </Box>

          {userData?.getCurrentUser && (
            <Box mt={3} p={2} bgcolor="grey.50" borderRadius={1}>
              <Typography variant="h6" gutterBottom>
                Current Profile Data
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Email:</strong> {userData.getCurrentUser.email}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>User Type:</strong> {userData.getCurrentUser.userType}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>Profile Image:</strong> {userData.getCurrentUser.profileImage ? 'Set' : 'Not set'}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <strong>LinkedIn Profile:</strong> {userData.getCurrentUser.linkedinUrl ? 'Set' : 'Not set'}
              </Typography>
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileForm;
