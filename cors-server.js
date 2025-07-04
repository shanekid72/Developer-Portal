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

// Start the server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`CORS Proxy Server running on port ${PORT}`);
  console.log(`Access the API through: http://localhost:${PORT}/api/...`);
});
