/**
 * Enhanced HTTP Proxy Server with Caching and Advanced Retry Logic
 * 
 * This is a lightweight proxy server built with Node.js core modules.
 * It handles authentication, caching, and advanced retry mechanisms.
 */

const http = require('http');
const https = require('https');
const url = require('url');
const querystring = require('querystring');
const { Buffer } = require('buffer');

// Authentication cache
let authToken = null;
let tokenExpiry = 0;

// Get Codes API cache (since it returns master data that rarely changes)
let codesCache = null;
let codesCacheExpiry = 0;
const CODES_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Service Corridor API cache
let serviceCorridorCache = null;
let serviceCorridorCacheExpiry = 0;
const SERVICE_CORRIDOR_CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

// Configuration
const PORT = 3001;
const TARGET_HOST = 'drap-sandbox.digitnine.com';
const AUTH_ENDPOINT = '/auth/realms/cdp/protocol/openid-connect/token';

// Authentication credentials
const AUTH_CREDENTIALS = {
  username: 'testagentae',
  password: 'Admin@123',
  grant_type: 'password',
  client_id: 'cdp_app',
  client_secret: 'mSh18BPiMZeQqFfOvWhgv8wzvnNVbj3Y'
};

/**
 * Get authentication token
 * @returns {Promise<string>} The authentication token
 */
async function getAuthToken() {
  if (authToken && Date.now() < tokenExpiry) {
    console.log('Using cached auth token');
    return authToken;
  }

  console.log('Getting new auth token...');
  
  return new Promise((resolve, reject) => {
    const postData = querystring.stringify(AUTH_CREDENTIALS);
    
    const options = {
      hostname: TARGET_HOST,
      port: 443,
      path: AUTH_ENDPOINT,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 30000 // 30 seconds timeout for auth
    };

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        if (res.statusCode !== 200) {
          console.error(`Auth request failed with status ${res.statusCode}`);
          console.error(`Response: ${data}`);
          return reject(new Error(`Auth failed with status ${res.statusCode}`));
        }
        
        try {
          const response = JSON.parse(data);
          authToken = response.access_token;
          // Set expiry to 4 minutes (token is valid for 5 minutes)
          tokenExpiry = Date.now() + (4 * 60 * 1000);
          console.log('New auth token obtained');
          resolve(authToken);
        } catch (error) {
          console.error('Error parsing auth response:', error);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('Error in auth request:', error);
      reject(error);
    });
    
    req.write(postData);
    req.end();
  });
}

/**
 * Parse request body from incoming requests
 * @param {http.IncomingMessage} req - The request object
 * @returns {Promise<any>} - Parsed request body
 */
function parseRequestBody(req) {
  return new Promise((resolve) => {
    const bodyParts = [];
    
    req.on('data', (chunk) => {
      bodyParts.push(chunk);
    });
    
    req.on('end', () => {
      const bodyBuffer = Buffer.concat(bodyParts);
      const contentType = req.headers['content-type'] || '';
      
      if (contentType.includes('application/json')) {
        try {
          const jsonBody = JSON.parse(bodyBuffer.toString());
          resolve(jsonBody);
        } catch (e) {
          console.error('Error parsing JSON body:', e);
          resolve({});
        }
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        try {
          const formBody = querystring.parse(bodyBuffer.toString());
          resolve(formBody);
        } catch (e) {
          console.error('Error parsing form body:', e);
          resolve({});
        }
      } else {
        // Return raw body as string for other content types
        resolve(bodyBuffer.toString());
      }
    });
  });
}

/**
 * Forward the request to the target server with enhanced retry mechanism
 * @param {http.IncomingMessage} req - The client request
 * @param {http.ServerResponse} res - The client response
 * @param {string} path - The target path
 * @param {any} body - The request body
 * @param {string} token - The authentication token
 */
async function forwardRequest(req, res, path, body, token) {
  // More retries for Get Codes API due to large response and intermittent timeouts
  const maxRetries = path.includes('/raas/masters/v1/codes') || path.includes('/raas/masters/v1/service-corridor') ? 5 : 3;
  let retryCount = 0;
  
  const attemptRequest = () => {
    return new Promise((resolve, reject) => {
      // Prepare headers
      const headers = {
        'Content-Type': req.headers['content-type'] || 'application/json',
        'Authorization': `Bearer ${token}`,
        'sender': req.headers['sender'] || 'testagentae',
        'channel': req.headers['channel'] || 'Direct',
        'company': req.headers['company'] || '784825',
        'branch': req.headers['branch'] || '784826',
        'Connection': 'keep-alive',
        'Accept': 'application/json',
        'Accept-Encoding': 'gzip, deflate'
      };
      
      // Prepare request body
      let postData = '';
      if (body) {
        if (typeof body === 'string') {
          postData = body;
        } else if (headers['Content-Type'].includes('application/json')) {
          postData = JSON.stringify(body);
          headers['Content-Length'] = Buffer.byteLength(postData);
        } else if (headers['Content-Type'].includes('application/x-www-form-urlencoded')) {
          postData = querystring.stringify(body);
          headers['Content-Length'] = Buffer.byteLength(postData);
        }
      }
      
      // Request options with longer timeout for Get Codes API
      const options = {
        hostname: TARGET_HOST,
        port: 443,
        path: path,
        method: req.method,
        headers: headers,
        timeout: path.includes('/raas/masters/v1/codes') || path.includes('/raas/masters/v1/service-corridor') ? 180000 : 120000 // 3 minutes for Get Codes and Service Corridor, 2 minutes for others
      };
      
      console.log(`Forwarding ${req.method} request to: https://${TARGET_HOST}${path} (attempt ${retryCount + 1}/${maxRetries})`);
      
      const proxyReq = https.request(options, (proxyRes) => {
        // Set status code
        res.statusCode = proxyRes.statusCode;
        
        // Forward response headers
        Object.keys(proxyRes.headers).forEach((key) => {
          if (!['transfer-encoding', 'connection'].includes(key.toLowerCase())) {
            res.setHeader(key, proxyRes.headers[key]);
          }
        });
        
        // Set CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        
        // Forward response body
        proxyRes.pipe(res);
        
        // Log response
        let responseData = '';
        proxyRes.on('data', (chunk) => {
          responseData += chunk;
        });
        
        proxyRes.on('end', () => {
          console.log(`Response status: ${proxyRes.statusCode}`);
          
          // Check if it's a timeout error and should retry
          if (proxyRes.statusCode === 408) {
            console.log('Detected 408 timeout, will retry...');
            reject(new Error('Request timeout - will retry'));
            return;
          }
          
          // Cache successful Get Codes responses
          if (path.includes('/raas/masters/v1/codes') && proxyRes.statusCode === 200) {
            codesCache = responseData;
            codesCacheExpiry = Date.now() + CODES_CACHE_DURATION;
            console.log('Cached Get Codes response for 30 minutes');
          }

          // Cache successful Service Corridor responses
          if (path.includes('/raas/masters/v1/service-corridor') && proxyRes.statusCode === 200) {
            serviceCorridorCache = responseData;
            serviceCorridorCacheExpiry = Date.now() + SERVICE_CORRIDOR_CACHE_DURATION;
            console.log('Cached Service Corridor response for 30 minutes');
          }
          
          try {
            // Try to parse and log JSON response
            const jsonResponse = JSON.parse(responseData);
            console.log('Response data:', JSON.stringify(jsonResponse).substring(0, 200) + '...');
          } catch (e) {
            // Log raw response if not JSON
            console.log('Response data:', responseData.substring(0, 200) + '...');
          }
          
          // Resolve on successful response
          resolve();
        });
      });
      
      proxyReq.on('error', (error) => {
        console.error(`Error in proxy request (attempt ${retryCount + 1}):`, error);
        reject(error);
      });
      
      proxyReq.on('timeout', () => {
        console.error(`Timeout in proxy request (attempt ${retryCount + 1})`);
        proxyReq.destroy();
        reject(new Error('Request timeout'));
      });
      
      // Write request body for non-GET requests
      if (req.method !== 'GET' && postData) {
        proxyReq.write(postData);
      }
      
      proxyReq.end();
    });
  };
  
  // Retry logic with exponential backoff
  while (retryCount < maxRetries) {
    try {
      await attemptRequest();
      return; // Success, exit the function
    } catch (error) {
      retryCount++;
      console.log(`Request failed (attempt ${retryCount}/${maxRetries}):`, error.message);
      
      if (retryCount >= maxRetries) {
        // All retries exhausted
        console.error('All retry attempts failed');
        
        // Return cached data as fallback for service corridor API
        if (path.includes('/raas/masters/v1/service-corridor') && serviceCorridorCache) {
          console.log('Returning cached Service Corridor response as fallback');
          res.statusCode = 200;
          res.setHeader('Content-Type', 'application/json');
          res.setHeader('Access-Control-Allow-Origin', '*');
          res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
          res.setHeader('Access-Control-Allow-Headers', '*');
          res.setHeader('X-Cache', 'FALLBACK');
          res.end(serviceCorridorCache);
          return;
        }
        
        res.statusCode = 500;
        res.end(JSON.stringify({
          status: 'failure',
          error_code: 50000,
          message: 'Proxy request failed after retries',
          details: { description: error.message, retries: retryCount }
        }));
        return;
      }
      
      // Wait before retrying (exponential backoff with longer delays for Get Codes)
      const baseDelay = path.includes('/raas/masters/v1/codes') || path.includes('/raas/masters/v1/service-corridor') ? 2000 : 1000;
      const delay = Math.min(baseDelay * Math.pow(2, retryCount - 1), 10000);
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

/**
 * Handle special case for quote endpoint
 * @param {http.IncomingMessage} req - The client request
 * @param {http.ServerResponse} res - The client response
 * @param {string} path - The target path
 */
async function handleQuoteRequest(req, res, path) {
  try {
    // Get auth token
    const token = await getAuthToken();
    
    // Parse request body
    const body = await parseRequestBody(req);
    
    // Use sample quote data if body is empty
    const sampleQuoteData = {
      "sending_country_code": "AE",
      "sending_currency_code": "AED",
      "receiving_country_code": "PK",
      "receiving_currency_code": "PKR",
      "sending_amount": 200,
      "receiving_mode": "BANK",
      "type": "SEND",
      "instrument": "REMITTANCE"
    };
    
    // Use sample data if body is empty for POST requests
    const requestBody = req.method === 'POST' && (!body || Object.keys(body).length === 0) 
      ? sampleQuoteData 
      : body;
    
    // Forward the request
    await forwardRequest(req, res, path, requestBody, token);
  } catch (error) {
    console.error('Error handling quote request:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({
      status: 'failure',
      error_code: 50000,
      message: 'Quote request failed',
      details: { description: error.message }
    }));
  }
}

/**
 * Handle direct auth requests
 * @param {http.IncomingMessage} req - The client request
 * @param {http.ServerResponse} res - The client response
 * @param {string} path - The target path
 */
async function handleAuthRequest(req, res, path) {
  try {
    // Parse request body
    const body = await parseRequestBody(req);
    
    // Forward the request without adding auth token
    const postData = querystring.stringify(body);
    
    const options = {
      hostname: TARGET_HOST,
      port: 443,
      path: path,
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': Buffer.byteLength(postData)
      },
      timeout: 30000 // 30 seconds timeout for auth
    };
    
    console.log(`Forwarding auth request to: https://${TARGET_HOST}${path}`);
    
    const proxyReq = https.request(options, (proxyRes) => {
      // Set status code
      res.statusCode = proxyRes.statusCode;
      
      // Forward response headers
      Object.keys(proxyRes.headers).forEach((key) => {
        if (!['transfer-encoding', 'connection'].includes(key.toLowerCase())) {
          res.setHeader(key, proxyRes.headers[key]);
        }
      });
      
      // Set CORS headers
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');
      
      // Collect response data
      let responseData = '';
      proxyRes.on('data', (chunk) => {
        responseData += chunk;
        res.write(chunk);
      });
      
      proxyRes.on('end', () => {
        console.log(`Auth response status: ${proxyRes.statusCode}`);
        
        // Cache the token if successful
        try {
          const response = JSON.parse(responseData);
          if (response.access_token) {
            authToken = response.access_token;
            tokenExpiry = Date.now() + (4 * 60 * 1000);
            console.log('Auth token updated from direct request');
          }
        } catch (e) {
          console.error('Error parsing auth response:', e);
        }
        
        res.end();
      });
    });
    
    proxyReq.on('error', (error) => {
      console.error('Error in auth request:', error);
      res.statusCode = 500;
      res.end(JSON.stringify({
        status: 'failure',
        error_code: 50000,
        message: 'Authentication failed',
        details: { description: error.message }
      }));
    });
    
    proxyReq.write(postData);
    proxyReq.end();
  } catch (error) {
    console.error('Error handling auth request:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({
      status: 'failure',
      error_code: 50000,
      message: 'Authentication failed',
      details: { description: error.message }
    }));
  }
}

/**
 * Handle generic API requests with caching for Get Codes
 * @param {http.IncomingMessage} req - The client request
 * @param {http.ServerResponse} res - The client response
 * @param {string} path - The target path
 */
async function handleGenericRequest(req, res, path) {
  try {
    // Check cache for Get Codes API
    if (path.includes('/raas/masters/v1/codes') && codesCache && Date.now() < codesCacheExpiry) {
      console.log('Returning cached Get Codes response');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('X-Cache', 'HIT');
      res.end(codesCache);
      return;
    }

    // Check cache for Service Corridor API
    if (path.includes('/raas/masters/v1/service-corridor') && serviceCorridorCache && Date.now() < serviceCorridorCacheExpiry) {
      console.log('Returning cached Service Corridor response');
      res.statusCode = 200;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.setHeader('X-Cache', 'HIT');
      res.end(serviceCorridorCache);
      return;
    }
    
    // Get auth token
    const token = await getAuthToken();
    
    // Parse request body
    const body = await parseRequestBody(req);
    
    // Forward the request
    await forwardRequest(req, res, path, body, token);
  } catch (error) {
    console.error('Error handling generic request:', error);
    res.statusCode = 500;
    res.end(JSON.stringify({
      status: 'failure',
      error_code: 50000,
      message: 'Request failed',
      details: { description: error.message }
    }));
  }
}

/**
 * Handle OPTIONS requests for CORS preflight
 * @param {http.ServerResponse} res - The client response
 */
function handleOptionsRequest(res) {
  res.statusCode = 200;
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Access-Control-Max-Age', '86400'); // 24 hours
  res.end();
}

// Create the HTTP server
const server = http.createServer(async (req, res) => {
  // Set default content type
  res.setHeader('Content-Type', 'application/json');
  
  // Parse the URL
  const parsedUrl = url.parse(req.url || '', true);
  const path = parsedUrl.pathname || '';
  
  console.log(`Received ${req.method} request for: ${path}`);
  
  // Handle OPTIONS requests for CORS preflight
  if (req.method === 'OPTIONS') {
    return handleOptionsRequest(res);
  }
  
  // Health check endpoint
  if (path === '/' || path === '/health') {
    res.statusCode = 200;
    return res.end(JSON.stringify({
      status: 'success',
      message: 'Enhanced HTTP Proxy Server is running with caching and advanced retry logic',
      features: {
        caching: 'Get Codes API responses cached for 30 minutes',
        retry: 'Up to 5 retries for Get Codes API with exponential backoff',
        timeout: '3-minute timeout for Get Codes API'
      }
    }));
  }
  
  // Check if this is an API request
  if (path.startsWith('/api/')) {
    // Remove the /api prefix to get the actual target path
    const targetPath = path.replace(/^\/api/, '');
    
    // Handle auth endpoint separately
    if (targetPath.includes('/auth/realms/cdp/protocol/openid-connect/token')) {
      return handleAuthRequest(req, res, targetPath);
    }
    
    // Handle quote endpoint specially
    if (targetPath.includes('/amr/ras/api/v1_0/ras/quote')) {
      return handleQuoteRequest(req, res, targetPath);
    }
    
    // Handle all other API requests
    return handleGenericRequest(req, res, targetPath);
  }
  
  // Handle 404 for unknown endpoints
  res.statusCode = 404;
  res.end(JSON.stringify({
    status: 'failure',
    error_code: 40400,
    message: 'Endpoint not found',
    details: { description: `No handler defined for ${path}` }
  }));
});

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Enhanced HTTP Proxy Server running on port ${PORT}`);
  console.log(`Access the API through: http://localhost:${PORT}/api/...`);
  console.log('Features: Caching, Advanced Retry Logic, Extended Timeouts');
  console.log('Get Codes API: 5 retries, 3-minute timeout, 30-minute cache');
}); 