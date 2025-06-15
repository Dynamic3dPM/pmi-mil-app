import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link,
  CircularProgress,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const LoginForm = ({ onSwitchToSignup, onSwitchToForgotPassword }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    userType: 'military', // 'military' or 'champion'
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { signIn, clearAuthState } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleClearAuth = async () => {
    setLoading(true);
    setError('');
    try {
      await clearAuthState();
      setError(''); // Clear any previous errors
      window.location.reload(); // Refresh the page to reset state
    } catch (error) {
      console.error('Clear auth error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Configure Amplify for the selected user type before sign in
      const { configureAmplifyForUserType } = await import('../../config/amplify');
      configureAmplifyForUserType(formData.userType);
      
      console.log('🔑 Attempting sign in with:', { email: formData.email, userType: formData.userType });
      const result = await signIn(formData.email, formData.password);
      
      console.log('📝 Sign in result:', result);
      
      if (!result.success) {
        console.log('❌ Sign in failed:', result.error);
        setError(result.error);
      } else {
        console.log('✅ Sign in successful, should redirect automatically');
        // Success is handled by AuthContext and will redirect automatically
        // Clear the form
        setFormData({
          email: '',
          password: '',
          userType: 'military',
        });
      }
    } catch (error) {
      console.error('Login form error:', error);
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          PMI Military Champions
        </Typography>
        <Typography variant="h6" component="h2" gutterBottom align="center" color="text.secondary">
          Sign In
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <FormControl fullWidth margin="normal">
            <InputLabel>User Type</InputLabel>
            <Select
              name="userType"
              value={formData.userType}
              onChange={handleChange}
              label="User Type"
              required
            >
              <MenuItem value="military">Member</MenuItem>
              <MenuItem value="champion">PMI Champion</MenuItem>
            </Select>
          </FormControl>

          <TextField
            fullWidth
            margin="normal"
            name="email"
            label="Email Address"
            type="email"
            value={formData.email}
            onChange={handleChange}
            required
            autoComplete="email"
          />

          <TextField
            fullWidth
            margin="normal"
            name="password"
            label="Password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            required
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} /> : 'Sign In'}
          </Button>

          {error && (
            error.includes('already a signed in user') || 
            error.includes('UserAlreadyAuthenticated') ||
            error.includes('clear authentication state')
          ) && (
            <Button
              fullWidth
              variant="outlined"
              color="warning"
              sx={{ mb: 2 }}
              onClick={handleClearAuth}
              disabled={loading}
            >
              Clear Authentication State
            </Button>
          )}

          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={onSwitchToForgotPassword}
              sx={{ mr: 2 }}
            >
              Forgot password?
            </Link>
            <Link
              component="button"
              type="button"
              variant="body2"
              onClick={onSwitchToSignup}
            >
              Don't have an account? Sign up
            </Link>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default LoginForm;
