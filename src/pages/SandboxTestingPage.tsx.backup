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

  // Base URL for the API
  const BASE_URL = 'https://drap-sandbox.digitnine.com';
  
  // CORS proxy to help with cross-origin requests
  const CORS_PROXY = 'https://cors-anywhere.herokuapp.com/';
  
  // Flag to enable/disable the CORS proxy (can be toggled for debugging)
  const USE_CORS_PROXY = true;

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
    },
    {
      id: 'customer',
      title: 'Customer Management',
      description: 'Validate and manage customer information',
      endpoints: [
        {
          id: 'validate-customer',
          name: 'Validate Customer',
          method: 'POST',
          url: '/caas/api/v2/customer/validate',
          description: 'Validate customer identity',
          requestBody: {
            idNumber: '784199554586091',
            idType: '4'
          },
          headers: {
            'Content-Type': 'application/json'
          }
        },
        {
          id: 'get-customer',
          name: 'Get Customer',
          method: 'GET',
          url: '/caas/api/v2/customer/7841003235214285',
          description: 'Get customer details by ID',
          headers: {
            'Content-Type': 'application/json'
          }
        }
      ]
    }
  ];

  const handleCopyToken = () => {
    if (accessToken) {
      navigator.clipboard.writeText(accessToken);
      setIsTokenCopied(true);
      setTimeout(() => setIsTokenCopied(false), 2000);
    }
  };

  const handleEndpointClick = (endpointId: string) => {
    if (activeEndpoint === endpointId) {
      setActiveEndpoint(null);
    } else {
      setActiveEndpoint(endpointId);
      // Find the endpoint and set its request body as the current one
      for (const category of endpointCategories) {
        const endpoint = category.endpoints.find(e => e.id === endpointId);
        if (endpoint) {
          // Use type assertion to handle the requestBody property
          const endpointWithBody = endpoint as { requestBody?: Record<string, any> };
          setRequestBody(endpointWithBody.requestBody || {});
          break;
        }
      }
    }
  };

  const handleRequestBodyChange = (value: string) => {
    try {
      setRequestBody(JSON.parse(value));
      setError(null);
    } catch (err) {
      setError('Invalid JSON format');
    }
  };

  const handleSendRequest = async (endpoint: any) => {
    setIsLoading(true);
    setError(null);
    setResponseData(null);

    try {
      // Prepare the API call based on the endpoint
      const url = `${BASE_URL}${endpoint.url}`;
      let response;

      // Set up headers
      const headers = { ...endpoint.headers };
      
      // Add authorization header if we have an access token and it's not the auth endpoint
      if (accessToken && endpoint.id !== 'keycloak') {
        headers['Authorization'] = `Bearer ${accessToken}`;
      }

      console.log(`Making ${endpoint.method} request to ${url}`);
      console.log('Headers:', headers);
      
      // Make the API call based on the HTTP method
      switch (endpoint.method) {
        case 'GET':
          // Handle query parameters for GET requests
          let queryUrl = url;
          if (endpoint.queryParams) {
            const queryString = Object.entries(endpoint.queryParams)
              .map(([key, value]) => `${key}=${value}`)
              .join('&');
            queryUrl = `${url}?${queryString}`;
          }
          console.log('GET request to:', queryUrl);
          response = await axios.get(queryUrl, { headers });
          break;

        case 'POST':
          // For auth endpoint, handle form data differently
          if (endpoint.id === 'keycloak') {
            const formData = new URLSearchParams();
            for (const [key, value] of Object.entries(endpoint.requestBody || {})) {
              formData.append(key, value as string);
            }
            console.log('POST form data:', Object.fromEntries(formData));
            response = await axios.post(url, formData, { headers });
            
            // Save the access token if this is the auth endpoint
            if (response.data && response.data.access_token) {
              setAccessToken(response.data.access_token);
            }
          } else {
            console.log('POST JSON body:', requestBody);
            response = await axios.post(url, requestBody, { headers });
          }
          break;

        case 'PUT':
          console.log('PUT request body:', requestBody);
          response = await axios.put(url, requestBody, { headers });
          break;

        case 'DELETE':
          response = await axios.delete(url, { headers });
          break;

        default:
          throw new Error(`Unsupported HTTP method: ${endpoint.method}`);
      }

      console.log('Response received:', response.data);
      
      // Set the response data
      setResponseData(response.data);
    } catch (err: any) {
      console.error('API call error:', err);
      setError(
        err.response 
          ? `Error: ${err.response.status} - ${err.response.statusText}` 
          : err.message || 'An error occurred while processing your request'
      );
      setResponseData(err.response ? err.response.data : null);
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
      {accessToken && (
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
                {accessToken.substring(0, 20)}...{accessToken.substring(accessToken.length - 10)}
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

                        {/* Headers */}
                        {endpoint.headers && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Headers</h4>
                            <div className="bg-gray-100 dark:bg-gray-750 rounded p-2 overflow-x-auto">
                              <pre className="text-xs text-gray-800 dark:text-gray-300">
                                {JSON.stringify(endpoint.headers, null, 2)}
                              </pre>
                            </div>
                          </div>
                        )}

                        {/* Request Body */}
                        {(endpoint.method === 'POST' || endpoint.method === 'PUT') && (
                          <div className="mb-4">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Request Body</h4>
                            <div className="relative">
                              <textarea
                                className="w-full h-40 p-2 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-750 text-gray-800 dark:text-gray-300 font-mono text-sm"
                                value={JSON.stringify(requestBody, null, 2)}
                                onChange={(e) => handleRequestBodyChange(e.target.value)}
                              />
                              {error && (
                                <div className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs px-2 py-1 rounded">
                                  {error}
                                </div>
                              )}
                            </div>
                          </div>
                        )}

                        {/* Send Button */}
                        <div className="flex justify-end">
                          <button
                            onClick={() => handleSendRequest(endpoint)}
                            disabled={isLoading}
                            className={clsx(
                              'flex items-center px-4 py-2 rounded text-white',
                              isLoading 
                                ? 'bg-gray-400 cursor-not-allowed' 
                                : 'bg-blue-600 hover:bg-blue-700 dark:bg-blue-700 dark:hover:bg-blue-800'
                            )}
                          >
                            {isLoading ? (
                              <span>Processing...</span>
                            ) : (
                              <>
                                <Play className="h-4 w-4 mr-2" />
                                <span>Send Request</span>
                              </>
                            )}
                          </button>
                        </div>

                        {/* Response */}
                        {responseData && (
                          <div className="mt-6">
                            <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Response</h4>
                            <div className="bg-gray-100 dark:bg-gray-750 rounded p-2 overflow-x-auto">
                              <pre className="text-xs text-gray-800 dark:text-gray-300">
                                {JSON.stringify(responseData, null, 2)}
                              </pre>
                            </div>
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

      {/* Environment Information */}
      <ScrollRevealContainer>
        <div className="mt-12 bg-gray-50 dark:bg-gray-800/50 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Sandbox Environment
          </h2>
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Base URL</h3>
              <div className="flex items-center mt-1">
                <code className="bg-gray-100 dark:bg-gray-750 px-3 py-1 rounded text-sm text-gray-800 dark:text-gray-300">
                  https://drap-sandbox.digitnine.com
                </code>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">Test Credentials</h3>
              <div className="mt-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white dark:bg-gray-750 p-3 rounded border border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Username</p>
                  <p className="text-sm text-gray-800 dark:text-gray-300 mt-1">testagentae</p>
                </div>
                <div className="bg-white dark:bg-gray-750 p-3 rounded border border-gray-200 dark:border-gray-700">
                  <p className="text-xs font-medium text-gray-500 dark:text-gray-400">Password</p>
                  <p className="text-sm text-gray-800 dark:text-gray-300 mt-1">Admin@123</p>
                </div>
              </div>
            </div>
            <div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Note: This sandbox environment is isolated from production systems. No real transactions will be processed, and no actual money will be transferred.
              </p>
            </div>
          </div>
        </div>
      </ScrollRevealContainer>
    </div>
  );
};

export default SandboxTestingPage; 