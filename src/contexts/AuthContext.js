import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { 
  getCurrentUser, 
  signIn, 
  signUp, 
  confirmSignUp, 
  signOut,
  resetPassword,
  confirmResetPassword,
  updatePassword
} from 'aws-amplify/auth';
import { useQuery, useApolloClient, useMutation } from '@apollo/client';
import { GET_ME } from '../graphql/queries';
import { SIGNUP } from '../graphql/mutations';
import { configureAmplifyForUserType } from '../config/amplify';

const AuthContext = createContext({});

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cognitoUser, setCognitoUser] = useState(null);
  const apolloClient = useApolloClient();
  const [signup] = useMutation(SIGNUP);

  // Query user data from GraphQL API - only when authenticated
  const { refetch: refetchUser } = useQuery(GET_ME, {
    skip: !cognitoUser || !user, // Skip if no user is authenticated
    errorPolicy: 'all', // Get both data and errors
    fetchPolicy: 'network-only', // Always fetch from network
    onCompleted: (data) => {
      console.log('📊 GraphQL response data:', data);
      if (data?.getCurrentUser) {
        console.log('✅ User data received from GraphQL:', data.getCurrentUser);
        // Update user with database data
        setUser(prevUser => ({
          ...prevUser,
          firstName: data.getCurrentUser.firstName || prevUser.firstName,
          lastName: data.getCurrentUser.lastName || prevUser.lastName,
          profileImage: data.getCurrentUser.profileImage,
          createdAt: data.getCurrentUser.createdAt,
          updatedAt: data.getCurrentUser.updatedAt
        }));
      } else {
        console.log('ℹ️ No user data returned from GraphQL, using Cognito attributes');
      }
    },
    onError: (error) => {
      console.error('❌ Error fetching user data from GraphQL:', error);
    }
  });

  // Check authentication status on mount
  const checkAuthState = useCallback(async () => {
    // Set fallback user data when GraphQL query fails or returns no data
    const setFallbackUser = (cognitoUser) => {
      if (!cognitoUser) {
        setUser(null);
        return;
      }
      
      // Try to extract name from Cognito attributes
      const firstName = cognitoUser.attributes?.given_name || cognitoUser.attributes?.name?.split(' ')[0] || 'User';
      const lastName = cognitoUser.attributes?.family_name || cognitoUser.attributes?.name?.split(' ').slice(1).join(' ') || '';
      
      const fallbackUser = {
        id: cognitoUser.userId,
        email: cognitoUser.signInDetails?.loginId || cognitoUser.attributes?.email || 'unknown@email.com',
        userType: cognitoUser.attributes?.['custom:userType'] || 'CHAMPION',
        firstName: firstName,
        lastName: lastName,
      };
      
      console.log('🔄 Using fallback user data:', fallbackUser);
      setUser(fallbackUser);
    };

    try {
      setLoading(true);
      console.log('🔍 Checking authentication state...');
      const currentUser = await getCurrentUser();
      console.log('✅ Current user found:', currentUser);
      setCognitoUser(currentUser);
      
      // Set a temporary user object while we fetch from GraphQL
      const firstName = currentUser.attributes?.given_name || currentUser.attributes?.name?.split(' ')[0] || 'Loading...';
      const lastName = currentUser.attributes?.family_name || currentUser.attributes?.name?.split(' ').slice(1).join(' ') || '';
      
      const tempUser = {
        id: currentUser.userId,
        email: currentUser.signInDetails?.loginId || currentUser.attributes?.email || 'unknown@email.com',
        userType: currentUser.attributes?.['custom:userType'] || 'CHAMPION',
        firstName: firstName,
        lastName: lastName,
      };
      
      console.log('👤 Setting temporary user data:', tempUser);
      setUser(tempUser);
      
      // Fetch user data from GraphQL with the user ID
      try {
        console.log('🔍 Fetching user data from GraphQL for ID:', currentUser.userId);
        const { data, error } = await refetchUser();
        
        if (error) {
          console.error('❌ Error in refetchUser:', error);
          setFallbackUser(currentUser);
          return;
        }
        
        console.log('📊 GraphQL response data:', data);
        
        if (!data?.getCurrentUser) {
          console.log('ℹ️ No user data returned from GraphQL, using Cognito attributes');
          setFallbackUser(currentUser);
        }
      } catch (graphqlError) {
        console.error('❌ GraphQL error fetching user data:', graphqlError);
        console.error('Error details:', graphqlError.graphQLErrors || graphqlError.networkError || graphqlError);
        setFallbackUser(currentUser);
      }
    } catch (error) {
      console.log('❌ No authenticated user:', error);
      setCognitoUser(null);
      setUser(null);
    } finally {
      console.log('🏁 Auth check complete, setting loading to false');
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    checkAuthState();
  }, [checkAuthState]);

  // Debug logging for user state changes
  useEffect(() => {
    console.log('🔄 User state changed:', { user, cognitoUser, loading });
  }, [user, cognitoUser, loading]);

  const handleSignIn = async (email, password) => {
    try {
      // Configure Amplify for the selected user type before sign in
      const { configureAmplifyForUserType } = await import('../config/amplify');
      
      // Normalize email to lowercase to match Cognito storage
      const normalizedEmail = email.toLowerCase();
      console.log('🔑 Attempting sign in with:', { email: normalizedEmail, userType: 'champion' });
      
      const result = await signIn({ username: normalizedEmail, password });
      console.log('🔐 Sign in successful:', result);
      setCognitoUser(result);
      
      // Create fallback user object immediately after successful sign in
      const fallbackUser = {
        id: result.userId,
        email: result.signInDetails?.loginId || normalizedEmail,
        userType: 'CHAMPION', // Default to CHAMPION for testing
        firstName: 'John', // More realistic fallback name
        lastName: 'Doe', // More realistic fallback name
        profilePictureUrl: null,
        linkedinUrl: null,
      };
      
      console.log('👤 Setting user after sign in:', fallbackUser);
      setUser(fallbackUser);
      
      // Try to fetch user data from GraphQL with the user ID
      try {
        await refetchUser();
      } catch (graphqlError) {
        console.log('GraphQL user data not available after sign in, using Cognito data');
        // Fallback user object already set above
      }
      
      console.log('✅ Sign in complete, user should be redirected');
      return { success: true, user: result };
    } catch (error) {
      console.error('Sign in error:', error);
      
      // Provide more specific error messages
      let errorMessage = 'An error occurred during sign in. Please try again.';
      
      if (error.name === 'UserNotFoundException') {
        errorMessage = 'No account found with this email address. Please check your email or sign up for a new account.';
      } else if (error.name === 'NotAuthorizedException') {
        errorMessage = 'Incorrect email or password. Please try again.';
      } else if (error.name === 'UserNotConfirmedException') {
        errorMessage = 'Please confirm your email address before signing in.';
      } else if (error.name === 'PasswordResetRequiredException') {
        errorMessage = 'Password reset required. Please reset your password.';
      } else if (error.name === 'TooManyRequestsException') {
        errorMessage = 'Too many failed attempts. Please wait a moment and try again.';
      } else if (error.name === 'UserAlreadyAuthenticatedException') {
        errorMessage = 'There is already a signed in user. Please clear authentication state and try again.';
      }
      
      return { success: false, error: errorMessage };
    }
  };

  const handleSignUp = async (email, password, attributes = {}, userType = 'military') => {
    try {
      // Configure Amplify for the correct User Pool based on user type
      configureAmplifyForUserType(userType);
      
      // For military members, we don't use the GraphQL mutation in AuthContext
      // Instead, the SignupForm handles the military member signup directly
      if (userType === 'military' || userType === 'military_member') {
        // Return early - SignupForm will handle military member signup
        return { 
          success: false, 
          error: 'Military member signup should be handled by SignupForm directly' 
        };
      }
      
      // Extract attributes for GraphQL SignupInput
      const { 
        'given_name': firstName, 
        'family_name': lastName, 
        'custom:userType': customUserType, 
        'custom:championName': championName,
        'custom:rank': rank,
        'custom:military_base': militaryBase,
        ...otherAttributes 
      } = attributes;
      
      // Build ChampionSignupInput for GraphQL mutation
      const signupInput = {
        email: email.toLowerCase(),
        password,
        firstName: firstName || '',
        lastName: lastName || '',
        userType: (customUserType || userType).toUpperCase(),
        // Required fields with defaults
        championName: championName || 'Tim Carrender',
        accessCode: '32580', // PMI Champion access code
        region: 'South Central',
        expertise: ['Project Management', 'Leadership'],
        // Optional fields
        certifications: [],
        availableHours: 0,
        menteeCapacity: 0,
        bio: '',
        linkedInProfile: '',
        yearsExperience: 0,
        industries: [],
        phoneNumber: ''
      };

      console.log('Attempting signup with input:', JSON.stringify(signupInput, null, 2));

      const result = await signup({
        variables: {
          input: signupInput
        },
      });
      
      console.log('Signup result:', JSON.stringify(result, null, 2));
      
      if (result.data?.championSignup?.success) {
        return { 
          success: true, 
          user: result.data.championSignup.user, 
          userType: customUserType || userType, 
          championName: championName || 'Tim Carrender',
          message: result.data.championSignup.message 
        };
      } else {
        const errorMessage = result.data?.championSignup?.message || result.errors?.[0]?.message || 'Signup failed';
        console.error('Signup failed:', errorMessage);
        return { 
          success: false, 
          error: errorMessage 
        };
      }
    } catch (error) {
      console.error('Sign up error:', error);
      const errorMessage = error.message || 'An unexpected error occurred during signup';
      return { success: false, error: errorMessage };
    }
  };

  const handleConfirmSignUp = async (email, code) => {
    try {
      await confirmSignUp({ username: email, confirmationCode: code });
      return { success: true };
    } catch (error) {
      console.error('Confirm sign up error:', error);
      return { success: false, error: error.message };
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      setCognitoUser(null);
      setUser(null);
      
      // Clear Apollo Client cache
      await apolloClient.clearStore();
      
      return { success: true };
    } catch (error) {
      console.error('Sign out error:', error);
      // Even if sign out fails, clear local state
      setCognitoUser(null);
      setUser(null);
      await apolloClient.clearStore();
      return { success: false, error: error.message };
    }
  };

  const handleForgotPassword = async (email) => {
    try {
      await resetPassword({ username: email });
      return { success: true };
    } catch (error) {
      console.error('Forgot password error:', error);
      return { success: false, error: error.message };
    }
  };

  const handleForgotPasswordSubmit = async (email, code, newPassword) => {
    try {
      await confirmResetPassword({ 
        username: email, 
        confirmationCode: code, 
        newPassword 
      });
      return { success: true };
    } catch (error) {
      console.error('Forgot password submit error:', error);
      return { success: false, error: error.message };
    }
  };

  const handleChangePassword = async (oldPassword, newPassword) => {
    try {
      await updatePassword({ oldPassword, newPassword });
      return { success: true };
    } catch (error) {
      console.error('Change password error:', error);
      return { success: false, error: error.message };
    }
  };

  const clearAuthState = async () => {
    try {
      // Try to sign out first
      await signOut();
    } catch (error) {
      console.log('Sign out error (expected if no user):', error);
    }
    
    // Clear local state regardless
    setCognitoUser(null);
    setUser(null);
    
    // Clear Apollo Client cache
    await apolloClient.clearStore();
    
    // Clear any localStorage items that might be related to auth
    try {
      localStorage.clear();
    } catch (error) {
      console.log('localStorage clear error:', error);
    }
  };

  const value = {
    user,
    cognitoUser,
    loading,
    signIn: handleSignIn,
    signUp: handleSignUp,
    confirmSignUp: handleConfirmSignUp,
    signOut: handleSignOut,
    forgotPassword: handleForgotPassword,
    forgotPasswordSubmit: handleForgotPasswordSubmit,
    changePassword: handleChangePassword,
    checkAuthState,
    refetchUser,
    clearAuthState,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
