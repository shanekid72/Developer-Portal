import { useState, useEffect } from 'react';
import { Copy, Play, Check, ChevronDown, ChevronUp } from 'lucide-react';
import ScrollRevealContainer from '../components/ScrollRevealContainer';
import clsx from 'clsx';

// Base URL for API calls through CORS proxy
const API_BASE_URL = 'http://localhost:3001/api';

// Simple token management
let currentToken = localStorage.getItem('raas_access_token') || '';

const getAccessToken = () => {
  // Always get the latest token from localStorage
  const token = localStorage.getItem('raas_access_token') || '';
  currentToken = token; // Keep global variable in sync
  return token;
};

const setAccessToken = (token: string) => {
  currentToken = token;
  localStorage.setItem('raas_access_token', token);
  console.log('💾 Token saved to localStorage and global variable');
};

// Debug function to check token status
const debugToken = () => {
  const localToken = localStorage.getItem('raas_access_token');
  console.log('🔍 === TOKEN DEBUG ===');
  console.log('Global token:', currentToken ? currentToken.substring(0, 20) + '...' : 'None');
  console.log('localStorage token:', localToken ? localToken.substring(0, 20) + '...' : 'None');
  console.log('Token length:', currentToken.length);
  console.log('localStorage token length:', localToken ? localToken.length : 0);
  console.log('=====================');
};

const SandboxTestingPage = () => {
  const [activeTab, setActiveTab] = useState('authentication');
  const [accessToken, setAccessTokenState] = useState(getAccessToken);
  const [isTokenCopied, setIsTokenCopied] = useState(false);
  
  // Simple effect to sync state with global token
  useEffect(() => {
    const interval = setInterval(() => {
      const token = getAccessToken();
      if (token !== accessToken) {
        setAccessTokenState(token);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [accessToken]);
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
    {
      id: 'codes-master',
      title: 'Codes and Master Data',
      description: 'Retrieve reference data like codes, corridors, rates, and banks',
      endpoints: [
        {
          id: 'get-codes',
          name: 'Get Codes',
          method: 'GET',
          url: '/raas/masters/v1/codes',
          description: 'Get reference codes for the system',
          headers: {
            'Content-Type': 'application/json',
            'sender': 'testagentae',
            'channel': 'Direct',
            'company': '784825',
            'branch': '784826'
          }
        },
        {
          id: 'get-service-corridor',
          name: 'Get Service Corridor',
          method: 'GET',
          url: '/raas/masters/v1/service-corridor',
          description: 'Get available service corridors for remittance',
          headers: {
            'Content-Type': 'application/json',
            'sender': 'testagentae',
            'channel': 'Direct',
            'company': '784825',
            'branch': '784826'
          }
        },
        {
          id: 'get-rates',
          name: 'Get Rates',
          method: 'GET',
          url: '/raas/masters/v1/rates',
          description: 'Get current exchange rates',
          headers: {
            'Content-Type': 'application/json',
            'sender': 'testagentae',
            'channel': 'Direct',
            'company': '784825',
            'branch': '784826'
          }
        },
        {
          id: 'master-banks',
          name: 'Master Banks',
          method: 'GET',
          url: '/raas/masters/v1/banks',
          description: 'Get list of available banks',
          queryParams: {
            receiving_country_code: 'PK',
            receiving_mode: 'CASHPICKUP'
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ]
    },
    {
      id: 'transactions',
      title: 'Transactions',
      description: 'Create and manage remittance transactions',
      endpoints: [
        {
          id: 'create-quote',
          name: 'Create Quote',
          method: 'POST',
          url: '/amr/ras/api/v1_0/ras/quote',
          description: 'Create a quote for a remittance transaction',
          requestBody: {
            sending_country_code: 'AE',
            sending_currency_code: 'AED',
            receiving_country_code: 'PK',
            receiving_currency_code: 'PKR',
            sending_amount: 300,
            receiving_mode: 'BANK',
            type: 'SEND',
            instrument: 'REMITTANCE'
          },
          headers: {
            'Content-Type': 'application/json',
            'sender': 'testagentae',
            'channel': 'Direct',
            'company': '784825',
            'branch': '784826'
          }
        },
        {
          id: 'create-transaction',
          name: 'Create Transaction',
          method: 'POST',
          url: '/amr/ras/api/v1_0/ras/createtransaction',
          description: 'Create a remittance transaction',
          requestBody: {
            type: 'SEND',
            source_of_income: 'SLRY',
            purpose_of_txn: 'SAVG',
            instrument: 'REMITTANCE',
            message: 'Agency transaction',
            sender: {
              customer_number: '7841001220007002'
            },
            receiver: {
              mobile_number: '+919586741508',
              first_name: 'Anija FirstName',
              last_name: 'Anija Lastname',
              nationality: 'IN',
              relation_code: '32',
              bank_details: {
                account_type_code: '1',
                iso_code: 'BKIPPKKA',
                iban: 'PK12ABCD1234567891234567'
              }
            },
            transaction: {
              quote_id: '{{quote_id}}',
              agent_transaction_ref_number: '{{quote_id}}'
            }
          },
          headers: {
            'Content-Type': 'application/json',
            'sender': 'testagentae',
            'channel': 'Direct',
            'company': '784825',
            'branch': '784826'
          }
        },
        {
          id: 'confirm-transaction',
          name: 'Confirm Transaction',
          method: 'POST',
          url: '/amr/ras/api/v1_0/ras/confirmtransaction',
          description: 'Confirm a created transaction',
          requestBody: {
            transaction_ref_number: '{{transaction_ref_number}}'
          },
          headers: {
            'Content-Type': 'application/json',
            'sender': 'testagentae',
            'channel': 'Direct',
            'company': '784825',
            'branch': '784826'
          }
        },
        {
          id: 'enquire-transaction',
          name: 'Enquire Transaction',
          method: 'GET',
          url: '/amr/ras/api/v1_0/ras/enquire-transaction',
          description: 'Get details of a transaction',
          queryParams: {
            transaction_ref_number: '{{transaction_ref_number}}'
          },
          headers: {
            'Content-Type': 'application/json',
            'sender': 'testagentae',
            'channel': 'Direct',
            'company': '784825',
            'branch': '784826'
          }
        }
      ]
    }
  ];

  const handleCopyToken = () => {
    const token = getAccessToken();
    if (token) {
      navigator.clipboard.writeText(token);
      setIsTokenCopied(true);
      setTimeout(() => setIsTokenCopied(false), 2000);
    }
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
        if (endpoint && 'requestBody' in endpoint && endpoint.requestBody) {
          // Create a deep copy to avoid reference issues
          setRequestBody(JSON.parse(JSON.stringify(endpoint.requestBody)));
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

  // Modified handleSendRequest function to use direct fetch calls
  const handleSendRequest = async (endpoint: any) => {
    setIsLoading(true);
    setError(null);
    setResponseData(null);

    try {
      // Set up headers
      const headers: Record<string, string> = { ...endpoint.headers };
      
      // Add authorization header if it's not the auth endpoint
      if (endpoint.id !== 'keycloak') {
        // Force refresh token from localStorage before making request
        const token = getAccessToken();
        
        if (token && token.length > 0) {
          headers['Authorization'] = `Bearer ${token}`;
          console.log('🔑 Using token:', token.substring(0, 20) + '...');
          console.log('🔑 Full token for debugging:', token);
          console.log('🔑 Authorization header set:', `Bearer ${token.substring(0, 20)}...`);
        } else {
          console.warn('❌ No access token available! Please authenticate first.');
          console.log('🔍 Current localStorage token:', localStorage.getItem('raas_access_token'));
          throw new Error('Authentication required: Please get an access token first');
        }
        
        // Always ensure required headers are present for all API calls
        headers['sender'] = 'testagentae';
        headers['channel'] = 'Direct';
        headers['company'] = '784825';
        headers['branch'] = '784826';
      }

      // Full URL for the API call
      const url = `${API_BASE_URL}${endpoint.url}`;
      
      // Debug token before making request
      if (endpoint.id !== 'keycloak') {
        debugToken();
      }
      
      // Log all request details
      console.log('📤 Request headers:', JSON.stringify(headers, null, 2));
      console.log('🔗 Request URL:', url);
      console.log('📋 Request method:', endpoint.method);
      
      // Verify Authorization header is set
      if (endpoint.id !== 'keycloak') {
        if (headers['Authorization']) {
          console.log('✅ Authorization header is set correctly');
        } else {
          console.error('❌ Authorization header is missing!');
          console.error('Available headers:', Object.keys(headers));
        }
      }
      
      console.log(`Making ${endpoint.method} request to ${url}`);
      console.log('Headers:', headers);

      let response;

      // Handle authentication endpoint specially
      if (endpoint.id === 'keycloak') {
        // Convert credentials to form data for authentication
        const formData = new URLSearchParams();
        for (const [key, value] of Object.entries(endpoint.requestBody)) {
          formData.append(key, value as string);
        }
        
        // Make direct fetch call for authentication
        response = await fetch(url, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
          body: formData
        });
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        
        // Save the access token if this is the auth endpoint
        if (data && data.access_token) {
          // Save token using our global function
          setAccessToken(data.access_token);
          console.log('✅ Token saved:', data.access_token.substring(0, 20) + '...');
          debugToken(); // Debug the token after saving
        }
        
        // Set the response data
        setResponseData(data);
      } else {
        // For all other endpoints
        const method = endpoint.method;
        
        // Add query parameters for GET requests
        let fullUrl = url;
        if (method === 'GET' && endpoint.queryParams) {
          const queryString = Object.entries(endpoint.queryParams)
            .map(([key, value]) => `${key}=${encodeURIComponent(value as string)}`)
            .join('&');
          fullUrl = `${url}?${queryString}`;
        }
        
        // Prepare fetch options
        const options: RequestInit = {
          method,
          headers
        };
        
        // Add body for POST/PUT requests
        if (method === 'POST' || method === 'PUT') {
          // If the endpoint has a predefined requestBody and no custom one has been set,
          // use the predefined one
          const bodyToSend = Object.keys(requestBody).length > 0 
            ? requestBody 
            : ('requestBody' in endpoint && endpoint.requestBody ? endpoint.requestBody : {});
            
          const body = JSON.stringify(bodyToSend);
          options.body = body;
          console.log(`${method} body:`, body);
        }
        
        // Make direct fetch call
        response = await fetch(fullUrl, options);
        
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        setResponseData(data);
      }

      console.log('Response received:', responseData);
    } catch (err: any) {
      console.error('API call error:', err);
      
      // Enhanced error handling with more detailed information
      if (err.response) {
        const status = err.response.status;
        const statusText = err.response.statusText;
        setError(`HTTP ${status} - ${statusText}: ${err.message}`);
      } else if (err instanceof Error) {
        // Check if it's an authentication issue
        if (err.message.includes('401') || err.message.toLowerCase().includes('unauthorized')) {
          setError(`Authentication Error: Make sure you've obtained a valid token first. ${err.message}`);
          console.warn('Authentication issue detected. Current token status:', accessToken ? 'Token exists' : 'No token');
        } else {
          setError(err.message || 'An error occurred while processing your request');
        }
      } else {
        setError('An unexpected error occurred');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ScrollRevealContainer>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            Sandbox Testing
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Test the RaaS API endpoints in our sandbox environment. This interactive console allows you to send requests and view responses without writing any code.
          </p>
        </div>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Getting Started with the API Console
          </h2>
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <ol className="list-decimal pl-5 space-y-2">
              <li>Start by getting an access token from the Authentication section</li>
              <li>The token will be automatically used for subsequent API calls</li>
              <li>Explore different API categories and endpoints</li>
              <li>Modify request parameters as needed</li>
              <li>Send requests and view the responses</li>
            </ol>
          </div>
        </div>
      </ScrollRevealContainer>

      {/* Access Token Display */}
      {getAccessToken() && (
        <ScrollRevealContainer>
          <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-900 rounded-lg p-4 mb-8">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Check className="h-5 w-5 text-green-500 mr-2" />
                <span className="font-medium text-green-800 dark:text-green-400">Access Token Acquired</span>
              </div>
              <button 
                onClick={handleCopyToken}
                className="text-sm flex items-center text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {isTokenCopied ? (
                  <>
                    <Check className="h-4 w-4 mr-1" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4 mr-1" />
                    Copy Token
                  </>
                )}
              </button>
            </div>
            <div className="mt-2 bg-white dark:bg-gray-800 rounded p-2 overflow-x-auto">
              <code className="text-xs text-gray-800 dark:text-gray-300">
                {getAccessToken().substring(0, 20)}...{getAccessToken().substring(getAccessToken().length - 10)}
              </code>
            </div>
          </div>
        </ScrollRevealContainer>
      )}

      {/* API Categories Tabs */}
      <div className="mb-8">
        <ScrollRevealContainer>
          <div className="border-b border-gray-200 dark:border-gray-700">
            <nav className="-mb-px flex space-x-8 overflow-x-auto">
              {endpointCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setActiveTab(category.id)}
                  className={clsx(
                    'whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm',
                    activeTab === category.id
                      ? 'border-blue-500 text-blue-600 dark:text-blue-400'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                  )}
                >
                  {category.title}
                </button>
              ))}
            </nav>
          </div>
        </ScrollRevealContainer>
      </div>

      {/* Active Category Content */}
      {endpointCategories.map((category) => (
        activeTab === category.id && (
          <div key={category.id}>
            <ScrollRevealContainer>
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  {category.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {category.description}
                </p>
              </div>
            </ScrollRevealContainer>

            {/* Endpoints */}
            <div className="space-y-4">
              {category.endpoints.map((endpoint) => (
                <ScrollRevealContainer key={endpoint.id}>
                  <div className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                    {/* Endpoint Header */}
                    <button
                      onClick={() => handleEndpointClick(endpoint.id)}
                      className="w-full flex items-center justify-between bg-gray-50 dark:bg-gray-800 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-750 transition-colors"
                    >
                      <div className="flex items-center">
                        <span className={clsx(
                          'inline-block rounded px-2 py-1 text-xs font-medium mr-3',
                          endpoint.method === 'GET' ? 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300' : 
                          'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
                        )}>
                          {endpoint.method}
                        </span>
                        <span className="font-medium text-gray-900 dark:text-white">{endpoint.name}</span>
                      </div>
                      {activeEndpoint === endpoint.id ? (
                        <ChevronUp className="h-5 w-5 text-gray-400" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-gray-400" />
                      )}
                    </button>

                    {/* Endpoint Details */}
                    {activeEndpoint === endpoint.id && (
                      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="mb-4">
                          <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">{endpoint.description}</p>
                          <div className="bg-gray-100 dark:bg-gray-750 rounded p-2">
                            <code className="text-sm text-gray-800 dark:text-gray-300">
                              {endpoint.method} {endpoint.url}
                              {'queryParams' in endpoint && endpoint.queryParams && Object.keys(endpoint.queryParams).length > 0 && '?'}
                              {'queryParams' in endpoint && endpoint.queryParams && 
                                Object.entries(endpoint.queryParams)
                                  .map(([key, value]) => `${key}=${value}`)
                                  .join('&')
                              }
                            </code>
                          </div>
                        </div>

                        {/* Request Body Editor (for POST/PUT) */}
                        {(endpoint.method === 'POST' || endpoint.method === 'PUT') && 'requestBody' in endpoint && (
                          <div className="mb-4">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Request Body</h3>
                            <div className="relative">
                              <textarea
                                value={JSON.stringify(requestBody, null, 2)}
                                onChange={(e) => handleRequestBodyChange(e.target.value)}
                                className="w-full h-40 font-mono text-sm p-3 bg-gray-100 dark:bg-gray-750 border border-gray-300 dark:border-gray-600 rounded focus:ring-blue-500 focus:border-blue-500"
                              />
                            </div>
                          </div>
                        )}

                        {/* Headers */}
                        <div className="mb-4">
                          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Headers</h3>
                          <div className="bg-gray-100 dark:bg-gray-750 rounded p-2">
                            <code className="text-xs text-gray-800 dark:text-gray-300 whitespace-pre">
                              {JSON.stringify(endpoint.headers, null, 2)}
                            </code>
                          </div>
                        </div>

                        {/* Send Request Button */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleSendRequest(endpoint)}
                            disabled={isLoading}
                            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                          >
                            {isLoading ? (
                              <span className="inline-block animate-spin mr-2"></span>
                            ) : (
                              <Play className="h-4 w-4 mr-2" />
                            )}
                            Try It
                          </button>
                        </div>

                        {/* Response */}
                        {(responseData || error) && activeEndpoint === endpoint.id && (
                          <div className="mt-6">
                            <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Response</h3>
                            
                            {error && (
                              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900 rounded p-3 mb-4">
                                <p className="text-red-800 dark:text-red-400 text-sm">{error}</p>
                              </div>
                            )}
                            
                            {responseData && (
                              <div className="bg-gray-100 dark:bg-gray-750 rounded p-2 overflow-x-auto">
                                <pre className="text-xs text-gray-800 dark:text-gray-300">
                                  {JSON.stringify(responseData, null, 2)}
                                </pre>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </ScrollRevealContainer>
              ))}
            </div>
          </div>
        )
      ))}
    </div>
  );
};

export default SandboxTestingPage;
