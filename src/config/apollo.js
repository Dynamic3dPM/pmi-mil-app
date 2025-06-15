import { ApolloClient, InMemoryCache, createHttpLink, from } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { onError } from '@apollo/client/link/error';
import { fetchAuthSession } from 'aws-amplify/auth';

// AppSync configuration
const GRAPHQL_ENDPOINT = 'https://26xzbyjnoveuvlnqu53y46k2lm.appsync-api.us-west-2.amazonaws.com/graphql';
const APPSYNC_API_KEY = 'da2-ch3xvtwgszgjfphbt3xrhy7g4i';

// WebSocket endpoint for real-time subscriptions
const WS_ENDPOINT = 'wss://26xzbyjnoveuvlnqu53y46k2lm.appsync-realtime-api.us-west-2.amazonaws.com/graphql';

console.log('🔌 Connecting to AppSync:', GRAPHQL_ENDPOINT);

// Error handling link
const errorLink = onError(({ graphQLErrors, networkError, operation, forward }) => {
  console.log('GraphQL operation error:', { operation, graphQLErrors, networkError });
  
  if (graphQLErrors) {
    graphQLErrors.forEach(({ message, locations, path, extensions }) => {
      console.error(
        `[GraphQL error]: Message: ${message}, ` +
        `Location: ${JSON.stringify(locations)}, ` +
        `Path: ${path}, ` +
        `Extensions: ${JSON.stringify(extensions)}`
      );
    });
  }
  
  if (networkError) {
    console.error('[Network error]:', {
      message: networkError.message,
      statusCode: networkError.statusCode,
      response: networkError.response,
      bodyText: networkError.bodyText,
    });
    
    // Handle 401 Unauthorized
    if (networkError.statusCode === 401) {
      console.warn('Authentication failed, attempting to refresh token...');
      // For now, just redirect to login - token refresh can be implemented later
      if (window.location.pathname !== '/auth') {
        window.location.href = '/auth';
      }
    }
  }
});

// HTTP link with timeout and API key
const httpLink = createHttpLink({
  uri: GRAPHQL_ENDPOINT,
  headers: {
    'x-api-key': APPSYNC_API_KEY,
    'Content-Type': 'application/json',
  },
  credentials: 'same-origin',
  fetch: async (uri, options) => {
    try {
      const response = await fetch(uri, {
        ...options,
        signal: AbortSignal.timeout(15000), // 15 second timeout
      });
      
      if (!response.ok) {
        const error = new Error(`HTTP error! status: ${response.status}`);
        error.status = response.status;
        throw error;
      }
      
      return response;
    } catch (error) {
      console.error('Network request failed:', error);
      throw error;
    }
  },
});

// Authentication link that handles both API Key and Cognito JWT
const authLink = setContext(async (_, { headers }) => {
  try {
    // Get current authenticated session
    const session = await fetchAuthSession();
    
    // AppSync expects the access token, not the ID token
    const accessToken = session.tokens?.accessToken?.toString();
    
    if (accessToken) {
      console.log('🔐 Using Cognito Access Token for authentication');
      return {
        headers: {
          ...headers,
          'Content-Type': 'application/json',
          // For Cognito authentication, don't include API key to avoid conflicts
          Authorization: `Bearer ${accessToken}`,
        }
      };
    }
  } catch (error) {
    console.log('No authenticated session, using API Key only');
  }
  
  // Fall back to API Key for unauthenticated requests
  console.log('🔑 Using API Key for authentication');
  return {
    headers: {
      ...headers,
      'Content-Type': 'application/json',
      'x-api-key': APPSYNC_API_KEY,
    }
  };
});

// Create Apollo Client with proper link chaining
const client = new ApolloClient({
  // Chain the links: errorLink -> authLink -> httpLink
  link: from([errorLink, authLink, httpLink]),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          getMessages: {
            merge(existing = [], incoming) {
              return [...(existing || []), ...(incoming || [])];
            },
          },
          getActivities: {
            merge(existing = [], incoming) {
              return [...(existing || []), ...(incoming || [])];
            },
          },
        },
      },
    },
  }),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: 'cache-and-network',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    query: {
      fetchPolicy: 'network-only',
      errorPolicy: 'all',
      notifyOnNetworkStatusChange: true,
    },
    mutate: {
      errorPolicy: 'all',
    },
  },
  connectToDevTools: process.env.NODE_ENV === 'development',
});

export default client;
