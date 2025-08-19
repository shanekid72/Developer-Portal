/**
 * Simple HTTP Proxy Server
 * 
 * This is a lightweight proxy server built with Node.js core modules.
 * It handles CORS and forwards requests without automatic authentication.
 * Users must explicitly call the Access Token API first.
 */

const http = require('http');
const https = require('https');
const url = require('url');
const querystring = require('querystring');
const { Buffer } = require('buffer');

// Configuration
const PORT = 3001;
const TARGET_HOST = 'drap-sandbox.digitnine.com';

// List of eKYC APIs that don't require Bearer tokens
const EKYC_APIS = [
  '/ekyc/api/v1/efr/ocrDetection',
  '/ekyc/api/v1/efr/faceLiveness',
  '/ekyc/api/v1/efr/confirmIdentity',
  '/ekyc/api/v1/request'
];

/**
 * Check if an API is an eKYC API that doesn't require Bearer tokens
 * @param {string} path - The API path
 * @returns {boolean} - True if it's an eKYC API
 */
function isEkycApi(path) {
  return EKYC_APIS.some(ekycPath => path.includes(ekycPath));
}

/**
 * Parse request body from incoming requests
 * @param {http.IncomingMessage} req - The request object
 * @returns {Promise<any>} - Parsed request body
 */
function parseRequestBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      if (!body) {
        resolve(null);
        return;
      }
      
      const contentType = req.headers['content-type'] || '';
      
      if (contentType.includes('application/json')) {
        try {
          resolve(JSON.parse(body));
        } catch (error) {
          console.error('Error parsing JSON body:', error);
          reject(error);
        }
      } else if (contentType.includes('application/x-www-form-urlencoded')) {
        resolve(querystring.parse(body));
      } else {
        resolve(body);
      }
    });
    
    req.on('error', (error) => {
      reject(error);
    });
  });
}

/**
 * Forward request to target server
 * @param {http.IncomingMessage} req - The client request
 * @param {http.ServerResponse} res - The client response
 * @param {string} path - The target path
 * @param {any} body - The request body
 * @param {string} userToken - Optional Bearer token from user
 */
async function forwardRequest(req, res, path, body, userToken = null) {
  const maxRetries = 3;
  let retryCount = 0;
  
  const attemptRequest = () => {
    return new Promise((resolve, reject) => {
      // Prepare request body
      let postData = null;
      if (body && req.method !== 'GET') {
        const contentType = (req.headers['content-type'] || '').toLowerCase();
        if (typeof body === 'object') {
          if (contentType.includes('application/x-www-form-urlencoded')) {
            // Forward as URL-encoded, not JSON
            postData = querystring.stringify(body);
          } else if (contentType.includes('application/json')) {
            postData = JSON.stringify(body);
          } else {
            // Fallback: attempt string conversion
            postData = String(body);
          }
        } else {
          postData = body;
        }
      }
      
      // Prepare headers
      const headers = { ...req.headers };
      
      // Remove headers that shouldn't be forwarded
      delete headers.host;
      delete headers['content-length'];
      
      // Add Bearer token if provided by user (not for eKYC APIs)
      if (userToken && !isEkycApi(path)) {
        headers['authorization'] = `Bearer ${userToken}`;
      }
      
      // Ensure correct content-type for urlencoded bodies when client forgot
      if (postData && (!headers['content-type'] || headers['content-type'].toLowerCase().includes('application/x-www-form-urlencoded'))) {
        headers['content-type'] = headers['content-type'] || 'application/x-www-form-urlencoded';
      }
      // Update content length if we have a body
      if (postData) {
        headers['content-length'] = Buffer.byteLength(postData);
      }
      
      const options = {
        hostname: TARGET_HOST,
        port: 443,
        path: path,
        method: req.method,
        headers: headers,
        timeout: 30000
      };
      
      console.log(`Forwarding ${req.method} request to: https://${TARGET_HOST}${path}`);
      if (userToken && !isEkycApi(path)) {
        console.log('Using user-provided Bearer token');
      } else if (isEkycApi(path)) {
        console.log('eKYC API - no Bearer token required');
      } else {
        console.log('No Bearer token provided by user');
      }
      
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
  
  // Retry logic
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
        res.statusCode = 500;
        res.end(JSON.stringify({
          status: 'failure',
          error_code: 50000,
          message: 'Proxy request failed after retries',
          details: { description: error.message, retries: retryCount }
        }));
        return;
      }
      
      // Wait before retrying (exponential backoff)
      const delay = Math.min(1000 * Math.pow(2, retryCount - 1), 5000);
      console.log(`Waiting ${delay}ms before retry...`);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
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
      message: 'Simple HTTP Proxy Server is running',
      note: 'Users must call Access Token API first, then include Bearer token in Authorization header'
    }));
  }
  
  // Check if this is an API request
  if (path.startsWith('/api/')) {
    // Remove the /api prefix to get the actual target path, including query string
    const targetPath = ((parsedUrl.pathname || '') + (parsedUrl.search || '')).replace(/^\/api/, '');
    
    // Parse request body
    const body = await parseRequestBody(req);
    
    // Extract Bearer token from Authorization header if provided
    const authHeader = req.headers.authorization || '';
    const userToken = authHeader.startsWith('Bearer ') ? authHeader.substring(7) : null;
    
    // Forward the request
    await forwardRequest(req, res, targetPath, body, userToken);
    return;
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
  console.log(`Simple HTTP Proxy Server running on port ${PORT}`);
  console.log(`Access the API through: http://localhost:${PORT}/api/...`);
  console.log('IMPORTANT: Users must call Access Token API first, then include Bearer token in Authorization header');
  console.log('eKYC APIs (OCR, Face Liveness, Confirm Identity) do not require Bearer tokens');
}); 