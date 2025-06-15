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
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const ForgotPasswordForm = ({ onSwitchToLogin }) => {
  const [step, setStep] = useState('request'); // 'request' or 'reset'
  const [formData, setFormData] = useState({
    email: '',
    code: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const { forgotPassword, forgotPasswordSubmit } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError('');
  };

  const handleRequestReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await forgotPassword(formData.email);
      
      if (result.success) {
        setSuccess('Password reset code sent to your email');
        setStep('reset');
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const result = await forgotPasswordSubmit(
        formData.email,
        formData.code,
        formData.newPassword
      );
      
      if (result.success) {
        setSuccess('Password reset successfully! You can now sign in.');
        setTimeout(() => {
          onSwitchToLogin();
        }, 2000);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError('An unexpected error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card sx={{ maxWidth: 400, mx: 'auto', mt: 4 }}>
      <CardContent sx={{ p: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Reset Password
        </Typography>
        
        {step === 'request' ? (
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Enter your email address and we'll send you a reset code.
          </Typography>
        ) : (
          <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
            Enter the reset code and your new password.
          </Typography>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            {success}
          </Alert>
        )}

        {step === 'request' ? (
          <Box component="form" onSubmit={handleRequestReset} sx={{ mt: 2 }}>
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

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Send Reset Code'}
            </Button>
          </Box>
        ) : (
          <Box component="form" onSubmit={handleResetPassword} sx={{ mt: 2 }}>
            <TextField
              fullWidth
              margin="normal"
              name="code"
              label="Reset Code"
              value={formData.code}
              onChange={handleChange}
              required
              placeholder="Enter 6-digit code"
            />

            <TextField
              fullWidth
              margin="normal"
              name="newPassword"
              label="New Password"
              type="password"
              value={formData.newPassword}
              onChange={handleChange}
              required
              helperText="Must be at least 8 characters"
            />

            <TextField
              fullWidth
              margin="normal"
              name="confirmPassword"
              label="Confirm New Password"
              type="password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : 'Reset Password'}
            </Button>
          </Box>
        )}

        <Box sx={{ textAlign: 'center', mt: 2 }}>
          <Link
            component="button"
            type="button"
            variant="body2"
            onClick={onSwitchToLogin}
          >
            Back to Sign In
          </Link>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ForgotPasswordForm;
