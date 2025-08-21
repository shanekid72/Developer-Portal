import express from 'express';
import cors from 'cors';

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'sender', 'channel', 'company', 'branch']
}));

// Simple auth token management
let authToken = null;
let tokenExpiry = 0;

async function getAuthToken() {
  if (authToken && Date.now() < tokenExpiry) {
    return authToken;
  }

  console.log('🔑 Getting auth token...');
  
  const authData = new URLSearchParams({
    username: 'testagentae',
    password: 'Admin@123',
    grant_type: 'password',
    client_id: 'cdp_app',
    client_secret: 'mSh18BPiMZeQqFfOvWhgv8wzvnNVbj3Y'
  });

  try {
    const response = await fetch('https://drap-sandbox.digitnine.com/auth/realms/cdp/protocol/openid-connect/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: authData.toString()
    });

    const data = await response.json();
    if (data.access_token) {
      authToken = data.access_token;
      tokenExpiry = Date.now() + (data.expires_in * 1000);
      console.log('✅ Auth token obtained');
      return authToken;
    } else {
      throw new Error('No access token in response');
    }
  } catch (error) {
    console.error('❌ Auth error:', error.message);
    throw error;
  }
}

// Pre-fetch token on startup
getAuthToken().then(() => {
  console.log('🚀 Initial auth token ready');
}).catch(error => {
  console.error('❌ Failed to get initial auth token:', error.message);
});

// Simple proxy handler for all API routes
app.use('/api', async (req, res) => {
  try {
    console.log(`📤 Proxying: ${req.method} ${req.path}`);
    
    // Remove /api prefix
    const targetPath = req.path.replace(/^\/api/, '');
    const targetUrl = `https://drap-sandbox.digitnine.com${targetPath}`;
    
    // Prepare headers
    const headers = {
      'Content-Type': req.headers['content-type'] || 'application/json',
      'sender': 'testagentae',
      'channel': 'Direct',
      'company': '784825',
      'branch': '784826'
    };
    
    // Add auth token for non-auth endpoints
    if (!targetPath.includes('/auth/realms/cdp/protocol/openid-connect/token')) {
      try {
        const token = await getAuthToken();
        headers['Authorization'] = `Bearer ${token}`;
        console.log(`🔐 Added auth token to: ${req.method} ${targetPath}`);
      } catch (error) {
        console.error('❌ Failed to get auth token:', error.message);
        return res.status(401).json({ error: 'Authentication failed' });
      }
    }
    
    // Prepare request options
    const options = {
      method: req.method,
      headers: headers,
      signal: AbortSignal.timeout(60000) // 60 second timeout
    };
    
    // Add request body for non-GET requests
    if (req.method !== 'GET' && req.body) {
      options.body = JSON.stringify(req.body);
    }
    
    // Make the request
    console.log(`🚀 Making request to: ${targetUrl}`);
    const response = await fetch(targetUrl, options);
    
    // Get response data
    const responseText = await response.text();
    console.log(`📥 Response: ${response.status} (${responseText.length} bytes)`);
    
    // Set response headers
    res.status(response.status);
    Object.entries(response.headers).forEach(([key, value]) => {
      if (!['transfer-encoding', 'connection'].includes(key.toLowerCase())) {
        res.set(key, value);
      }
    });
    
    // Add CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
    res.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, sender, channel, company, branch');
    
    // Send response
    res.send(responseText);
    
  } catch (error) {
    console.error('❌ Proxy error:', error.message);
    res.status(500).json({ 
      error: 'Proxy error', 
      message: error.message 
    });
  }
});

// Add a health check route
app.get('/', (req, res) => {
  res.send('CORS Proxy Server is running with authentication');
});

// Add a test endpoint to debug the Get Codes API
app.get('/test-get-codes', async (req, res) => {
  try {
    console.log('🧪 Testing Get Codes API directly...');
    
    const token = await getAuthToken();
    
    const response = await fetch('https://drap-sandbox.digitnine.com/raas/masters/v1/codes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        'sender': 'testagentae',
        'channel': 'Direct',
        'company': '784825',
        'branch': '784826'
      },
      signal: AbortSignal.timeout(30000) // 30 second timeout
    });
    
    const data = await response.text();
    console.log('📊 Get Codes API response status:', response.status);
    console.log('📊 Get Codes API response length:', data.length);
    
    res.json({
      status: response.status,
      success: response.ok,
      dataLength: data.length,
      dataPreview: data.substring(0, 200),
      headers: Object.fromEntries(response.headers.entries())
    });
  } catch (error) {
    console.error('❌ Error testing Get Codes API:', error.message);
    res.json({
      error: error.message,
      type: error.name
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 CORS Proxy Server running on port ${PORT}`);
  console.log(`🔗 Access the API through: http://localhost:${PORT}/api/...`);
  console.log(`🔐 Authentication: Automatic token management enabled`);
});
