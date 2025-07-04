const express = require('express');
const cors = require('cors');
const axios = require('axios');
const querystring = require('querystring');

const app = express();

// Enable CORS for all routes with more permissive settings
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: '*'
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
        },
        timeout: 10000 // 10 second timeout
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

// Handle OPTIONS requests for preflight
app.options('*', cors());

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
        },
        timeout: 10000 // 10 second timeout
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
      res.status(500).json({ error: 'Authentication failed', message: error.message });
    }
  }
});

// Special handler for quote endpoint - using specific route instead of wildcard
app.post('/api/amr/ras/api/v1_0/ras/quote', async (req, res) => {
  handleQuoteRequest(req, res);
});

app.get('/api/amr/ras/api/v1_0/ras/quote', async (req, res) => {
  handleQuoteRequest(req, res);
});

// Function to handle quote requests
async function handleQuoteRequest(req, res) {
  try {
    console.log(`Handling quote request: ${req.method} ${req.path}`);
    
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
    
    console.log(`Forwarding quote request to: ${targetUrl}`);
    
    // Prepare headers
    const headers = {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
      'sender': req.headers.sender || 'testagentae',
      'channel': req.headers.channel || 'Direct',
      'company': req.headers.company || '784825',
      'branch': req.headers.branch || '784826'
    };
    
    // Use sample quote data for POST requests
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
    
    // Forward the request
    let response;
    if (req.method === 'GET') {
      response = await axios.get(targetUrl, { 
        headers,
        timeout: 10000 // 10 second timeout
      });
    } else if (req.method === 'POST') {
      // Use sample data if body is empty
      const data = Object.keys(req.body || {}).length > 0 ? req.body : sampleQuoteData;
      console.log('Quote request body:', JSON.stringify(data));
      
      response = await axios.post(targetUrl, data, { 
        headers,
        timeout: 10000 // 10 second timeout
      });
    } else {
      return res.status(405).json({ error: 'Method not allowed' });
    }
    
    console.log(`Quote response status: ${response.status}`);
    res.status(response.status).json(response.data);
  } catch (error) {
    console.error('Error in quote endpoint:', error.message);
    if (error.response) {
      console.error('Error response:', error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      res.status(500).json({ 
        status: 'failure',
        error_code: 50000,
        message: 'Quote request failed',
        details: { description: error.message }
      });
    }
  }
}

// Handle specific transaction endpoints
app.post('/api/amr/ras/api/v1_0/ras/createtransaction', handleGenericApiRequest);
app.post('/api/amr/ras/api/v1_0/ras/confirmtransaction', handleGenericApiRequest);
app.get('/api/amr/ras/api/v1_0/ras/enquire-transaction', handleGenericApiRequest);

// Generic API handler function
async function handleGenericApiRequest(req, res) {
  try {
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
      validateStatus: () => true, // Accept any status code
      timeout: 10000 // 10 second timeout
    };
    
    // Add request body for non-GET requests
    if (req.method !== 'GET' && req.body) {
      axiosConfig.data = req.body;
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
}

// Fallback handler for any other API routes
app.use('/api', (req, res) => {
  console.log(`Fallback handler for: ${req.method} ${req.path}`);
  res.status(404).json({
    status: 'failure',
    error_code: 40400,
    message: 'Endpoint not found',
    details: { description: `No handler defined for ${req.path}` }
  });
});

// Add a health check route
app.get('/', (req, res) => {
  res.send('CORS Proxy Server is running with automatic authentication');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    status: 'failure',
    error_code: 50000,
    message: 'Internal server error',
    details: { description: err.message }
  });
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`CORS Proxy Server running on port ${PORT}`);
  console.log(`Access the API through: http://localhost:${PORT}/api/...`);
  console.log('This proxy automatically adds authentication tokens to API requests');
}); 