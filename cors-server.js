import express from 'express';
import cors from 'cors';
import { createProxyMiddleware } from 'http-proxy-middleware';

const app = express();

// Enable CORS for all routes
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'sender', 'channel', 'company', 'branch']
}));

// Proxy middleware options
const options = {
  target: 'https://drap-sandbox.digitnine.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api': '' // remove /api prefix when forwarding
  },
  onProxyRes: function(proxyRes, req, res) {
    // Add CORS headers to the proxied response
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS, PATCH';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Content-Type, Authorization, sender, channel, company, branch';
    
    console.log(`Proxied request: ${req.method} ${req.path} -> ${options.target}${req.path.replace(/^\/api/, '')}`);
  }
};

// Create the proxy middleware
const apiProxy = createProxyMiddleware(options);

// Use the proxy for all routes starting with /api
app.use('/api', apiProxy);

// Add a health check route
app.get('/', (req, res) => {
  res.send('CORS Proxy Server is running');
});

// Add a test endpoint to debug the Get Codes API
app.get('/test-get-codes', async (req, res) => {
  try {
    console.log('Testing Get Codes API directly...');
    
    const response = await fetch('https://drap-sandbox.digitnine.com/raas/masters/v1/codes', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'sender': 'testagentae',
        'channel': 'Direct',
        'company': '784825',
        'branch': '784826'
      },
      signal: AbortSignal.timeout(10000) // 10 second timeout
    });
    
    const data = await response.text();
    console.log('Get Codes API response status:', response.status);
    console.log('Get Codes API response length:', data.length);
    
    res.json({
      status: response.status,
      success: response.ok,
      dataLength: data.length,
      dataPreview: data.substring(0, 200),
      headers: Object.fromEntries(response.headers.entries())
    });
  } catch (error) {
    console.error('Error testing Get Codes API:', error.message);
    res.json({
      error: error.message,
      type: error.name
    });
  }
});

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`CORS Proxy Server running on port ${PORT}`);
  console.log(`Access the API through: http://localhost:${PORT}/api/...`);
});
