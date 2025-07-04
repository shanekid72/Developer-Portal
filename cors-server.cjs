const express = require('express');
const cors = require('cors');
const axios = require('axios');
const querystring = require('querystring');

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'sender', 'channel', 'company', 'branch']
}));

// Middleware to parse URL-encoded bodies
app.use(express.urlencoded({ extended: true }));
// Middleware to parse JSON bodies
app.use(express.json());

// Authentication cache
let authToken = null;
let tokenExpiry = 0;

// Function to get authentication token
async function getAuthToken() {
  if (authToken && Date.now() < tokenExpiry) {
    console.log('Using cached auth token');
    return authToken;
  }

  console.log('Getting new auth token...');
  
  const authData = {
    username: 'testagentae',
    password: 'Admin@123',
    grant_type: 'password',
    client_id: 'cdp_app',
    client_secret: 'mSh18BPiMZeQqFfOvWhgv8wzvnNVbj3Y'
  };

  try {
    const response = await axios.post(
      'https://drap-sandbox.digitnine.com/auth/realms/cdp/protocol/openid-connect/token',
      querystring.stringify(authData),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    authToken = response.data.access_token;
    // Set expiry to 4 minutes (token is valid for 5 minutes)
    tokenExpiry = Date.now() + (4 * 60 * 1000);
    console.log('New auth token obtained');
    return authToken;
  } catch (error) {
    console.error('Error getting auth token:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
      console.error('Response status:', error.response.status);
    }
    throw error;
  }
}

// Handle auth endpoint separately
app.post('/api/auth/realms/cdp/protocol/openid-connect/token', async (req, res) => {
  try {
    console.log('Handling auth request directly');
    
    // Forward the request to the actual auth endpoint
    const response = await axios.post(
      'https://drap-sandbox.digitnine.com/auth/realms/cdp/protocol/openid-connect/token',
      req.body instanceof URLSearchParams ? req.body : querystring.stringify(req.body),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );
    
    // Cache the token for future use
    if (response.data && response.data.access_token) {
      authToken = response.data.access_token;
      tokenExpiry = Date.now() + (4 * 60 * 1000);
      console.log('Auth token updated from direct request');
    }
    
    // Send the response back
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in auth endpoint:', error.message);
    if (error.response) {
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ error: 'Authentication failed' });
    }
  }
});

// Generic API handler for all other endpoints
app.all('/api/*', async (req, res, next) => {
  try {
    // Skip authentication for auth endpoint
    if (req.path.includes('/auth/realms/cdp/protocol/openid-connect/token')) {
      return next();
    }
    
    console.log(`Handling API request: ${req.method} ${req.path}`);
    
    // Get auth token
    let token;
    try {
      token = await getAuthToken();
    } catch (authError) {
      console.error('Authentication failed:', authError.message);
      return res.status(401).json({ 
        status: 'failure',
        error_code: 40001,
        message: 'Authentication failed',
        details: { description: authError.message }
      });
    }
    
    // Remove /api prefix from the path
    const targetPath = req.path.replace(/^\/api/, '');
    const targetUrl = `https://drap-sandbox.digitnine.com${targetPath}`;
    
    // Prepare headers
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': req.headers['content-type'] || 'application/json',
      'sender': req.headers.sender || 'testagentae',
      'channel': req.headers.channel || 'Direct',
      'company': req.headers.company || '784825',
      'branch': req.headers.branch || '784826'
    };
    
    console.log(`Forwarding to: ${targetUrl}`);
    
    // Forward the request
    const axiosConfig = {
      method: req.method,
      url: targetUrl,
      headers: headers,
      validateStatus: () => true // Accept any status code
    };
    
    // Add request body for non-GET requests
    if (req.method !== 'GET' && req.body) {
      // Special handling for quote endpoint
      if (req.path.includes('/ras/quote')) {
        // Ensure we have a valid body for quote requests
        if (Object.keys(req.body).length === 0) {
          axiosConfig.data = {
            "sending_country_code": "AE",
            "sending_currency_code": "AED",
            "receiving_country_code": "PK",
            "receiving_currency_code": "PKR",
            "sending_amount": 200,
            "receiving_mode": "BANK",
            "type": "SEND",
            "instrument": "REMITTANCE"
          };
          console.log('Using sample quote request body');
        } else {
          axiosConfig.data = req.body;
        }
      } else {
        // For all other endpoints
        axiosConfig.data = req.body;
      }
    }
    
    const response = await axios(axiosConfig);
    
    console.log(`Response status: ${response.status}`);
    
    // Send the response back
    res.status(response.status);
    
    // Set response headers
    Object.entries(response.headers)
      .filter(([key]) => !['transfer-encoding', 'connection'].includes(key.toLowerCase()))
      .forEach(([key, value]) => res.set(key, value));
    
    // Send response data
    if (response.data) {
      res.send(response.data);
    } else {
      res.end();
    }
  } catch (error) {
    console.error('Error handling request:', error.message);
    res.status(500).json({ 
      status: 'failure',
      error_code: 50000,
      message: 'Internal server error',
      details: { description: error.message }
    });
  }
});

// Add a health check route
app.get('/', (req, res) => {
  res.send('CORS Proxy Server is running with automatic authentication');
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`CORS Proxy Server running on port ${PORT}`);
  console.log(`Access the API through: http://localhost:${PORT}/api/...`);
  console.log('This proxy automatically adds authentication tokens to API requests');
}); 