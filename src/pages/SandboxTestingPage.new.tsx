import { useState } from 'react';
import { Copy, Play, Check, ChevronDown, ChevronUp } from 'lucide-react';
import ScrollRevealContainer from '../components/ScrollRevealContainer';
import clsx from 'clsx';
import { makeApiCall, authenticate } from '../api/apiClient';

const SandboxTestingPage = () => {
  const [activeTab, setActiveTab] = useState('authentication');
  const [accessToken, setAccessToken] = useState('');
  const [isTokenCopied, setIsTokenCopied] = useState(false);
  const [activeEndpoint, setActiveEndpoint] = useState<string | null>(null);
  const [requestBody, setRequestBody] = useState<Record<string, any>>({});
  const [responseData, setResponseData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Endpoint categories based on the Postman collection
  const endpointCategories = [
    {
      id: 'authentication',
      title: 'Authentication',
      description: 'Get access tokens for API authentication',
      endpoints: [
        {
          id: 'keycloak',
          name: 'KeyCloak Token',
          method: 'POST',
          url: '/auth/realms/cdp/protocol/openid-connect/token',
          description: 'Get an access token for API authentication',
          requestBody: {
            username: 'testagentae',
            password: 'Admin@123',
            grant_type: 'password',
            client_id: 'cdp_app',
            client_secret: 'mSh18BPiMZeQqFfOvWhgv8wzvnNVbj3Y'
          },
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      ]
    },
    // ... rest of your endpoint categories
  ];

  const handleCopyToken = () => {
    navigator.clipboard.writeText(accessToken);
    setIsTokenCopied(true);
    setTimeout(() => setIsTokenCopied(false), 2000);
  };

  const handleEndpointClick = (endpointId: string) => {
    if (activeEndpoint === endpointId) {
      setActiveEndpoint(null);
    } else {
      setActiveEndpoint(endpointId);
      
      // Find the endpoint and set initial request body if it exists
      const category = endpointCategories.find(cat => 
        cat.endpoints.some(ep => ep.id === endpointId)
      );
      
      if (category) {
        const endpoint = category.endpoints.find(ep => ep.id === endpointId);
        if (endpoint && 'requestBody' in endpoint) {
          setRequestBody(endpoint.requestBody);
        } else {
          setRequestBody({});
        }
      }
    }
  };

  const handleRequestBodyChange = (value: string) => {
    try {
      const parsedValue = JSON.parse(value);
      setRequestBody(parsedValue);
    } catch (err) {
      console.error('Invalid JSON:', err);
      // Don't update state if JSON is invalid
    }
  };

  const handleSendRequest = async (endpoint: any) => {
    setIsLoading(true);
    setError(null);
    setResponseData(null);

    try {
      // Set up headers
      const headers = { ...endpoint.headers };
      
      // Add authorization header if we have an access token and it's not the auth endpoint
      if (accessToken && endpoint.id !== 'keycloak') {
        headers['Authorization'] = Bearer ;
      }

      // Log what we're about to do
      console.log(Sending  request to );
      console.log('Headers:', headers);
      
      let response;

      // Handle authentication endpoint specially
      if (endpoint.id === 'keycloak') {
        response = await authenticate(endpoint.requestBody);
        
        // Save the access token if this is the auth endpoint
        if (response.data && response.data.access_token) {
          setAccessToken(response.data.access_token);
        }
      } else {
        // For all other endpoints, use makeApiCall
        const method = endpoint.method;
        const url = endpoint.url;
        const data = method === 'GET' ? undefined : requestBody;
        const queryParams = endpoint.queryParams;
        
        // Make the API call - this will be visible in the network tab
        response = await makeApiCall(method, url, data, headers, queryParams);
      }

      console.log('Response received:', response.data);
      
      // Set the response data
      setResponseData(response.data);
    } catch (err: any) {
      console.error('API call error:', err);
      setError(
        err.response 
          ? Error:  -  
          : err.message || 'An error occurred while processing your request'
      );
      setResponseData(err.response ? err.response.data : null);
    } finally {
      setIsLoading(false);
    }
  };

  // ... rest of your component
};
