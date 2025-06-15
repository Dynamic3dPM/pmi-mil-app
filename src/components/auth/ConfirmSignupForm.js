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

const ConfirmSignupForm = ({ email, onConfirmSuccess, onSwitchToLogin }) => {
  const [confirmationCode, setConfirmationCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { confirmSignUp } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const result = await confirmSignUp(email, confirmationCode);
      
      if (result.success) {
        onConfirmSuccess();
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
          Confirm Your Account
        </Typography>
        <Typography variant="body1" align="center" color="text.secondary" sx={{ mb: 3 }}>
          We've sent a confirmation code to {email}. Please enter it below to complete your registration.
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
          <TextField
            fullWidth
            margin="normal"
            label="Confirmation Code"
            value={confirmationCode}
            onChange={(e) => setConfirmationCode(e.target.value)}
            required
            placeholder="Enter 6-digit code"
            inputProps={{ maxLength: 6 }}
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
            disabled={loading || confirmationCode.length !== 6}
          >
            {loading ? <CircularProgress size={24} /> : 'Confirm Account'}
          </Button>

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
        </Box>
      </CardContent>
    </Card>
  );
};

export default ConfirmSignupForm;
