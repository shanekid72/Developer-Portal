import axios from 'axios';

// Base URL for the API
const BASE_URL = 'https://drap-sandbox.digitnine.com';

// CORS proxy to help with cross-origin requests
const CORS_PROXY = 'https://corsproxy.io/?';

// Flag to enable/disable the CORS proxy (can be toggled for debugging)
const USE_CORS_PROXY = true;

/**
 * Makes API calls to the backend
 * @param method HTTP method (GET, POST, PUT, DELETE)
 * @param endpoint API endpoint path
 * @param data Request body for POST/PUT requests
 * @param headers Request headers
 * @param queryParams Query parameters for GET requests
 * @returns Promise with the API response
 */
export const makeApiCall = async (
  method: string,
  endpoint: string,
  data?: any,
  headers?: Record<string, string>,
  queryParams?: Record<string, string>
) => {
  try {
    // Prepare the URL with CORS proxy if enabled
    let url = `${USE_CORS_PROXY ? CORS_PROXY : ''}${BASE_URL}${endpoint}`;
    
    // Add query parameters for GET requests
    if (method === 'GET' && queryParams) {
      const queryString = Object.entries(queryParams)
        .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
        .join('&');
      url = `${url}?${queryString}`;
    }

    console.log(`Making ${method} request to ${url}`);
    console.log('Headers:', headers);
    
    // Make the API call based on the HTTP method
    switch (method) {
      case 'GET':
        return await axios.get(url, { headers });
        
      case 'POST':
        console.log('POST body:', data);
        return await axios.post(url, data, { headers });
        
      case 'PUT':
        console.log('PUT body:', data);
        return await axios.put(url, data, { headers });
        
      case 'DELETE':
        return await axios.delete(url, { headers });
        
      default:
        throw new Error(`Unsupported HTTP method: ${method}`);
    }
  } catch (error) {
    console.error('API call error:', error);
    throw error;
  }
};

/**
 * Handles authentication API call specifically
 * @param credentials Authentication credentials
 * @returns Promise with the authentication response
 */
export const authenticate = async (credentials: Record<string, string>) => {
  try {
    const url = `${USE_CORS_PROXY ? CORS_PROXY : ''}${BASE_URL}/auth/realms/cdp/protocol/openid-connect/token`;
    const headers = { 'Content-Type': 'application/x-www-form-urlencoded' };
    
    // Convert credentials to form data
    const formData = new URLSearchParams();
    for (const [key, value] of Object.entries(credentials)) {
      formData.append(key, value);
    }
    
    console.log('Authentication request to:', url);
    console.log('Form data:', Object.fromEntries(formData));
    
    return await axios.post(url, formData, { headers });
  } catch (error) {
    console.error('Authentication error:', error);
    throw error;
  }
}; 