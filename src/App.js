import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ApolloProvider } from '@apollo/client';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { Box, Alert, Typography } from '@mui/material'; // Import necessary MUI components
import './config/amplify'; // Initialize AWS Amplify
import apolloClient from './config/apollo';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import AuthPage from './components/auth/AuthPage';
import Layout from './components/layout/Layout';
import MilitaryMemberDashboard from './components/dashboard/MilitaryMemberDashboard';
import ChampionDashboard from './components/dashboard/ChampionDashboard';
import LoadingScreen from './components/common/LoadingScreen';
import Profile from './pages/Profile';

// Create Material-UI theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
});

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('🛡️ ProtectedRoute - loading:', loading, 'user:', user);

  if (loading) {
    console.log('⏳ ProtectedRoute: Showing loading screen');
    return <LoadingScreen />;
  }

  if (!user) {
    console.log('🚫 ProtectedRoute: No user, redirecting to /auth');
    return <Navigate to="/auth" replace />;
  }

  console.log('✅ ProtectedRoute: User authenticated, showing protected content');
  return <Layout>{children}</Layout>;
};

// Public Route component (redirects to dashboard if authenticated)
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  console.log('🌐 PublicRoute - loading:', loading, 'user:', user);

  if (loading) {
    console.log('⏳ PublicRoute: Showing loading screen');
    return <LoadingScreen />;
  }

  if (user) {
    console.log('✅ PublicRoute: User authenticated, redirecting to /dashboard');
    return <Navigate to="/dashboard" replace />;
  }

  console.log('🌐 PublicRoute: No user, showing public content');
  return children;
};

// Dashboard Route component (renders appropriate dashboard based on user type)
const DashboardRoute = () => {
  const { user } = useAuth();

  console.log('📊 DashboardRoute - user:', user);

  if (user?.userType === 'MILITARY_MEMBER' || user?.userType === 'MILITARY') {
    console.log('🪖 Rendering MilitaryMemberDashboard');
    return <MilitaryMemberDashboard />;
  } else if (user?.userType === 'CHAMPION') {
    console.log('🏆 Rendering ChampionDashboard');
    return <ChampionDashboard />;
  } else if (user?.userType === 'UNKNOWN') {
    console.log('❓ Rendering unknown user type warning');
    return (
      <Layout>
        <Box p={3}>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Unable to load user profile data. Please try signing out and signing in again.
          </Alert>
          <Typography variant="h6">Welcome, {user.firstName}</Typography>
          <Typography variant="body2" color="text.secondary">
            Email: {user.email}
          </Typography>
        </Box>
      </Layout>
    );
  }

  console.log('⏳ DashboardRoute: Loading user data...');
  return (
    <Layout>
      <Box p={3}>
        <Typography variant="h6">Loading user data...</Typography>
      </Box>
    </Layout>
  );
};

function App() {
  return (
    <ApolloProvider client={apolloClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true,
          }}
        >
          <AuthProvider>
            <Routes>
              {/* Public routes */}
              <Route
                path="/auth"
                element={
                  <PublicRoute>
                    <AuthPage />
                  </PublicRoute>
                }
              />

              {/* Protected routes */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardRoute />
                  </ProtectedRoute>
                }
              />

              {/* Placeholder routes for future implementation */}
              <Route
                path="/progress"
                element={
                  <ProtectedRoute>
                    <div>Progress page coming soon...</div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/champion"
                element={
                  <ProtectedRoute>
                    <div>Champion page coming soon...</div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/members"
                element={
                  <ProtectedRoute>
                    <div>Members page coming soon...</div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/assignments"
                element={
                  <ProtectedRoute>
                    <div>Assignments page coming soon...</div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/reports"
                element={
                  <ProtectedRoute>
                    <div>Reports page coming soon...</div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <div>Messages page coming soon...</div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <div>Settings page coming soon...</div>
                  </ProtectedRoute>
                }
              />

              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />

              {/* Default redirect */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Catch all route */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </Router>
      </ThemeProvider>
    </ApolloProvider>
  );
}

export default App;
