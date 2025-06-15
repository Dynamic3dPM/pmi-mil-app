import React, { useState } from 'react';
import { Container, Box, Card, CardContent } from '@mui/material';
import LoginForm from './LoginForm';
import SignupForm from './SignupForm';
import ConfirmSignupForm from './ConfirmSignupForm';
import ForgotPasswordForm from './ForgotPasswordForm';

const AuthPage = () => {
  const [currentView, setCurrentView] = useState('login'); // 'login', 'signup', 'confirm', 'forgot'
  const [signupEmail, setSignupEmail] = useState('');

  const handleSwitchToLogin = () => setCurrentView('login');
  const handleSwitchToSignup = () => setCurrentView('signup');
  const handleSwitchToForgotPassword = () => setCurrentView('forgot');
  
  const handleSignupSuccess = (email) => {
    setSignupEmail(email);
    setCurrentView('confirm');
  };

  const handleConfirmSuccess = () => {
    setCurrentView('login');
  };

  const renderCurrentView = () => {
    // Note: We've removed the cognitoUser && !user check here because 
    // the AuthContext now handles this scenario gracefully by creating
    // a fallback user object when GraphQL data is unavailable
    
    switch (currentView) {
      case 'signup':
        return (
          <SignupForm
            onSwitchToLogin={handleSwitchToLogin}
            onSignupSuccess={handleSignupSuccess}
          />
        );
      case 'confirm':
        return (
          <ConfirmSignupForm
            email={signupEmail}
            onConfirmSuccess={handleConfirmSuccess}
            onSwitchToLogin={handleSwitchToLogin}
          />
        );
      case 'forgot':
        return (
          <ForgotPasswordForm
            onSwitchToLogin={handleSwitchToLogin}
          />
        );
      default:
        return (
          <LoginForm
            onSwitchToSignup={handleSwitchToSignup}
            onSwitchToForgotPassword={handleSwitchToForgotPassword}
          />
        );
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
        {renderCurrentView()}
      </Box>
    </Container>
  );
};

export default AuthPage;
