/**
 * Simple HTTP Proxy Server - Fixed Version
 * 
 * This is a lightweight proxy server built with Node.js core modules.
 * It handles authentication and basic request forwarding without complex retry logic.
 */

const http = require('http');
const https = require('https');
const url = require('url');
const querystring = require('querystring');
const { Buffer } = require('buffer');

const PORT = 3001;
const TARGET_HOST = 'drap-sandbox.digitnine.com';

// Enhanced caching for all APIs
let apiCache = new Map();
const CACHE_DURATION = 60 * 60 * 1000; // 1 hour for most APIs
const CODES_CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours for codes (rarely changes)
const SERVICE_CORRIDOR_CACHE_DURATION = 12 * 60 * 60 * 1000; // 12 hours for service corridor

// Auth token management
let authToken = null;
let tokenExpiry = 0;

// Performance tracking
let requestCount = 0;
let cacheHitCount = 0;

function getCacheKey(path, method, body = '') {
  return `${method}:${path}:${body}`;
}

function getCacheDuration(path) {
  if (path.includes('/raas/masters/v1/codes')) {
    return CODES_CACHE_DURATION;
  }
  if (path.includes('/raas/masters/v1/service-corridor')) {
    return SERVICE_CORRIDOR_CACHE_DURATION;
  }
  if (path.includes('/raas/masters/v1/rates')) {
    return 30 * 60 * 1000; // 30 minutes for rates
  }
  return CACHE_DURATION;
}

function getCachedResponse(path, method, body = '') {
  const key = getCacheKey(path, method, body);
  const cached = apiCache.get(key);
  
  if (cached && Date.now() < cached.expiry) {
    cacheHitCount++;
    console.log(`🎯 Cache HIT for ${path} (${cacheHitCount} hits, ${requestCount} total requests)`);
    return cached.data;
  }
  
  return null;
}

function setCachedResponse(path, method, body, data) {
  const key = getCacheKey(path, method, body);
  const duration = getCacheDuration(path);
  
  apiCache.set(key, {
    data: data,
    expiry: Date.now() + duration,
    timestamp: Date.now()
  });
  
  console.log(`💾 Cached ${path} for ${Math.round(duration / 60000)} minutes`);
}

// Clean up expired cache entries every 10 minutes
setInterval(() => {
  const now = Date.now();
  let cleaned = 0;
  
  for (const [key, value] of apiCache.entries()) {
    if (now > value.expiry) {
      apiCache.delete(key);
      cleaned++;
    }
  }
  
  if (cleaned > 0) {
    console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
  }
}, 10 * 60 * 1000);

async function getAuthToken() {
  const now = Date.now();
  
  // Return cached token if still valid (with 5-minute buffer)
  if (authToken && now < tokenExpiry - 300000) {
    return authToken;
  }
  
  console.log('🔑 Getting new auth token...');
  
  const authData = new URLSearchParams({
    grant_type: 'password',
    username: 'testagentae',
    password: 'Admin@123',
    client_id: 'cdp_app',
    client_secret: 'mSh18BPiMZeQqFfOvWhgv8wzvnNVbj3Y'
  });
  
  const options = {
    hostname: TARGET_HOST,
    port: 443,
    path: '/auth/realms/cdp/protocol/openid-connect/token',
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
      'Content-Length': Buffer.byteLength(authData.toString())
    }
  };
  
  return new Promise((resolve, reject) => {
    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.access_token) {
            authToken = response.access_token;
            tokenExpiry = now + (response.expires_in * 1000);
            console.log('✅ New auth token obtained');
            resolve(authToken);
          } else {
            console.error('❌ Auth failed:', response);
            reject(new Error('Auth failed'));
          }
        } catch (error) {
          console.error('❌ Auth response parsing failed:', error);
          reject(error);
        }
      });
    });
    
    req.on('error', (error) => {
      console.error('❌ Auth request failed:', error);
      reject(error);
    });
    
    req.write(authData.toString());
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

async function forwardRequest(req, res, path) {
  requestCount++;
  
  try {
    // Check cache first for GET requests
    if (req.method === 'GET') {
      const cachedResponse = getCachedResponse(path, req.method);
      if (cachedResponse) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Cache-Hits', cacheHitCount.toString());
        res.setHeader('X-Total-Requests', requestCount.toString());
        res.end(cachedResponse);
        return;
      }
    }
    
    // Get auth token for API requests
    let token = null;
    if (!path.includes('/auth/')) {
      token = await getAuthToken();
    }
    
    // Prepare request body for POST requests
    let requestBody = '';
    if (req.method === 'POST') {
      requestBody = await new Promise((resolve) => {
        let body = '';
        req.on('data', (chunk) => {
          body += chunk;
        });
        req.on('end', () => {
          resolve(body);
        });
      });
    }
    
    // Check cache for POST requests with body
    if (req.method === 'POST' && requestBody) {
      const cachedResponse = getCachedResponse(path, req.method, requestBody);
      if (cachedResponse) {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('X-Cache', 'HIT');
        res.setHeader('X-Cache-Hits', cacheHitCount.toString());
        res.setHeader('X-Total-Requests', requestCount.toString());
        res.end(cachedResponse);
        return;
      }
    }
    
    console.log(`🚀 Forwarding ${req.method} request to: ${path}`);
    
    const options = {
      hostname: TARGET_HOST,
      port: 443,
      path: path,
      method: req.method,
      headers: {
        ...req.headers,
        host: TARGET_HOST
      },
      timeout: 30000 // 30 seconds timeout
    };
    
    // Add auth token if available
    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }
    
    const proxyReq = https.request(options, (proxyRes) => {
      let responseData = '';
      
      proxyRes.on('data', (chunk) => {
        responseData += chunk;
      });
      
      proxyRes.on('end', () => {
        // Set response headers
        res.statusCode = proxyRes.statusCode;
        Object.keys(proxyRes.headers).forEach(key => {
          if (key.toLowerCase() !== 'transfer-encoding') {
            res.setHeader(key, proxyRes.headers[key]);
          }
        });
        
        // Add CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', '*');
        res.setHeader('X-Cache', 'MISS');
        res.setHeader('X-Cache-Hits', cacheHitCount.toString());
        res.setHeader('X-Total-Requests', requestCount.toString());
        
        // Cache successful responses
        if (proxyRes.statusCode === 200 && responseData) {
          try {
            const parsed = JSON.parse(responseData);
            if (parsed.status === 'success') {
              setCachedResponse(path, req.method, requestBody, responseData);
            }
          } catch (e) {
            // Not JSON, don't cache
          }
        }
        
        res.end(responseData);
      });
    });
    
    proxyReq.on('error', (error) => {
      console.error('❌ Proxy request error:', error);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.end(JSON.stringify({
        status: 'failure',
        status_code: 500,
        error_code: 50000,
        message: 'Internal Server Error',
        details: {
          message: 'An error occurred while processing the request.'
        }
      }));
    });
    
    proxyReq.on('timeout', () => {
      console.error('⏰ Request timeout');
      proxyReq.destroy();
      res.statusCode = 408;
      res.setHeader('Content-Type', 'application/json');
      res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
      res.setHeader('Access-Control-Allow-Headers', '*');
      res.end(JSON.stringify({
        status: 'failure',
        status_code: 408,
        error_code: 40800,
        message: 'Request Timeout',
        details: {
          message: 'The request took too long to complete.'
        }
      }));
    });
    
    // Forward request body for POST requests
    if (req.method === 'POST' && requestBody) {
      proxyReq.write(requestBody);
    }
    
    proxyReq.end();
    
  } catch (error) {
    console.error('❌ Error in forwardRequest:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.end(JSON.stringify({
      status: 'failure',
      status_code: 500,
      error_code: 50000,
      message: 'Internal Server Error',
      details: {
        message: error.message
      }
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

async function handleGenericRequest(req, res, path) {
  try {
    await forwardRequest(req, res, path);
  } catch (error) {
    console.error('❌ Error handling generic request:', error);
    res.statusCode = 500;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');
    res.end(JSON.stringify({
      status: 'failure',
      status_code: 500,
      error_code: 50000,
      message: 'Internal Server Error',
      details: {
        message: error.message
      }
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
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const path = parsedUrl.pathname;
  
  console.log(`📥 Received ${req.method} request for: ${path}`);
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': '*'
    });
    res.end();
    return;
  }
  
  // Handle health check
  if (path === '/health') {
    res.writeHead(200, {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    });
    res.end(JSON.stringify({
      status: 'healthy',
      cache_size: apiCache.size,
      cache_hits: cacheHitCount,
      total_requests: requestCount,
      cache_hit_rate: requestCount > 0 ? Math.round((cacheHitCount / requestCount) * 100) : 0
    }));
    return;
  }
  
  // Handle API requests
  if (path.startsWith('/api/')) {
    const apiPath = path.substring(4); // Remove '/api' prefix
    handleGenericRequest(req, res, apiPath);
    return;
  }
  
  // Default response
  res.writeHead(404, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  res.end(JSON.stringify({
    status: 'failure',
    status_code: 404,
    error_code: 40400,
    message: 'Not Found',
    details: {
      message: 'The requested resource was not found.'
    }
  }));
});

server.listen(PORT, () => {
  console.log(`🚀 Enhanced HTTP Proxy Server running on port ${PORT}`);
  console.log(`🌐 Access the API through: http://localhost:${PORT}/api/...`);
  console.log(`⚡ Features: Aggressive caching, Performance tracking, 30s timeout`);
  console.log(`💾 Cache durations: Codes (24h), Service Corridor (12h), Rates (30m), Others (1h)`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
}); 