import React from 'react';
import { 
  Box, 
  Alert, 
  AlertTitle, 
  Typography, 
  Button,
  Card,
  CardContent 
} from '@mui/material';
import { Refresh, CloudOff } from '@mui/icons-material';

const NetworkError = ({ onRetry, message }) => {
  const defaultMessage = "Unable to connect to the server. Please check your internet connection and try again.";

  return (
    <Box sx={{ p: 3, display: 'flex', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 500, width: '100%' }}>
        <CardContent sx={{ textAlign: 'center', py: 4 }}>
          <CloudOff sx={{ fontSize: 64, color: 'error.main', mb: 2 }} />
          
          <Typography variant="h5" gutterBottom color="error">
            Connection Error
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            {message || defaultMessage}
          </Typography>
          
          <Alert severity="info" sx={{ mb: 3, textAlign: 'left' }}>
            <AlertTitle>Development Note</AlertTitle>
            The GraphQL API endpoint may not be accessible. This is normal in development mode.
            You can still explore the UI components and authentication flow.
          </Alert>

          {onRetry && (
            <Button 
              variant="contained" 
              startIcon={<Refresh />}
              onClick={onRetry}
              size="large"
            >
              Retry Connection
            </Button>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default NetworkError;
