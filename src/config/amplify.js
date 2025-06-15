import { Amplify } from 'aws-amplify';

// Using a single Cognito User Pool; IDs come from environment variables
// Groups (Admin, Champions, Military) are used for role separation.

// Base AWS Amplify v6 configuration for PMI Military Champions
const getAmplifyConfig = () => ({
  Auth: {
    Cognito: {
      region: process.env.REACT_APP_COGNITO_REGION,
      userPoolId: process.env.REACT_APP_COGNITO_USER_POOL_ID,
      userPoolClientId: process.env.REACT_APP_COGNITO_USER_POOL_CLIENT_ID,
      loginWith: { email: true },
    },
  },
  API: {
    GraphQL: {
      endpoint: process.env.REACT_APP_APPSYNC_GRAPHQL_ENDPOINT,
      region: process.env.REACT_APP_COGNITO_REGION,
      defaultAuthMode: 'apiKey',
      apiKey: process.env.REACT_APP_APPSYNC_API_KEY,
    },
  },
});
// Configure Amplify once at app start
Amplify.configure(getAmplifyConfig());

// Function to reconfigure Amplify for different user types
export const configureAmplifyForUserType = (userType) => {
  Amplify.configure(getAmplifyConfig(userType));
};

export default getAmplifyConfig;
