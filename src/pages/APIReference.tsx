import { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import ScrollRevealContainer from '../components/ScrollRevealContainer';

const APIReference = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error] = useState<string | null>(null);
  
  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

  // Fix Swagger UI scrolling after it loads
  useEffect(() => {
    if (!isLoading) {
      // Allow some time for Swagger UI to render
      const timer = setTimeout(() => {
        // Find all operation containers and fix their max-height
        const operationContainers = document.querySelectorAll('.opblock-body');
        operationContainers.forEach((container) => {
          if (container instanceof HTMLElement) {
            container.style.maxHeight = 'none';
          }
        });
        
        // Fix response containers
        const responseContainers = document.querySelectorAll('.responses-wrapper');
        responseContainers.forEach((container) => {
          if (container instanceof HTMLElement) {
            container.style.maxHeight = 'none';
          }
        });
      }, 1000);
      
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <ScrollRevealContainer>
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            API Reference
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400">
            Explore and test the RaaS API endpoints using our interactive Swagger documentation.
          </p>
        </div>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Getting Started with the API
          </h2>
          <div className="prose prose-blue dark:prose-invert max-w-none">
            <p>
              Our API follows RESTful principles and uses standard HTTP methods. All requests and responses are in JSON format.
            </p>
            <h3>Base URL</h3>
            <p>
              All API requests should be made to:
              <code className="block bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded mt-2">
                https://drap-sandbox.digitnine.com
              </code>
            </p>
            <h3>Authentication</h3>
            <p>
              All API endpoints require authentication. You need to include a Bearer token in the Authorization header:
              <code className="block bg-gray-100 dark:bg-gray-700 px-4 py-2 rounded mt-2">
                Authorization: Bearer YOUR_ACCESS_TOKEN
              </code>
            </p>
            <p>
              To get an access token, use the <code>/auth/realms/cdp/protocol/openid-connect/token</code> endpoint.
            </p>
          </div>
        </div>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              <p>Error loading API documentation: {error}</p>
            </div>
          ) : (
            <div className="swagger-wrapper" style={{ height: 'auto', overflowY: 'visible' }}>
              {/* Custom styles to make Swagger UI work better with dark mode and fix scrolling */}
              <style>
                {`
                 /* Fix scrolling in Swagger UI */
                 .swagger-ui .opblock-body {
                   max-height: none !important;
                   overflow-y: visible !important;
                 }
                 .swagger-ui .opblock .opblock-summary {
                   cursor: pointer;
                 }
                 .swagger-ui .responses-wrapper {
                   max-height: none !important;
                   overflow-y: visible !important;
                 }
                 .swagger-ui .model-box {
                   max-height: none !important;
                   overflow-y: visible !important;
                 }
                 .swagger-ui textarea {
                   min-height: 150px;
                 }
                 
                 /* Fix for schema models */
                 .swagger-ui .model-container {
                   max-height: none !important;
                   overflow-y: visible !important;
                 }
                 .swagger-ui section.models {
                   max-height: none !important;
                   overflow: visible !important;
                 }
                 .swagger-ui section.models.is-open {
                   max-height: none !important;
                   overflow: visible !important;
                 }
                 
                 /* Fix for try-it-out containers */
                 .swagger-ui .try-out {
                   max-height: none !important;
                 }
                 .swagger-ui .execute-wrapper {
                   max-height: none !important;
                 }
                 
                 /* Improved readability for code blocks and examples */
                 .swagger-ui .highlight-code {
                   background-color: #f8f9fa !important;
                   color: #333 !important;
                 }
                 .dark .swagger-ui .highlight-code {
                   background-color: #000000 !important;
                   color: #f8fafc !important;
                 }
                 
                 /* Fix for request/response body text */
                 .swagger-ui .microlight {
                   font-family: monospace !important;
                   font-size: 14px !important;
                   color: #333 !important;
                   background-color: #f8f9fa !important;
                   padding: 10px !important;
                   border-radius: 4px !important;
                   line-height: 1.5 !important;
                 }
                 .dark .swagger-ui .microlight {
                   color: #f8fafc !important;
                   background-color: #000000 !important;
                   border: 1px solid #2d3748 !important;
                 }
                 
                 /* Headers and request body text */
                 .swagger-ui .opblock .opblock-section-header {
                   background-color: #f1f5f9 !important;
                 }
                 .dark .swagger-ui .opblock .opblock-section-header {
                   background-color: #000000 !important;
                   border-bottom: 1px solid #2d3748 !important;
                 }
                 .swagger-ui .opblock .opblock-section-header h4 {
                   color: #1e293b !important;
                   font-weight: 600 !important;
                 }
                 .dark .swagger-ui .opblock .opblock-section-header h4 {
                   color: #38bdf8 !important;
                   font-weight: 600 !important;
                 }
                 
                 /* Request body editor */
                 .swagger-ui .body-param__text {
                   background-color: #f8f9fa !important;
                   color: #333 !important;
                   font-family: monospace !important;
                   font-size: 14px !important;
                   padding: 10px !important;
                   border-radius: 4px !important;
                   border: 1px solid #e2e8f0 !important;
                 }
                 .dark .swagger-ui .body-param__text {
                   background-color: #000000 !important;
                   color: #f8fafc !important;
                   border: 1px solid #2d3748 !important;
                 }
                 
                 /* JSON syntax highlighting */
                 .swagger-ui .microlight .headerline,
                 .swagger-ui .microlight .string,
                 .swagger-ui .microlight .literal,
                 .swagger-ui .microlight .number {
                   color: #0550ae !important;
                 }
                 .dark .swagger-ui .microlight .headerline,
                 .dark .swagger-ui .microlight .string,
                 .dark .swagger-ui .microlight .literal,
                 .dark .swagger-ui .microlight .number {
                   color: #38bdf8 !important;
                 }
                 .swagger-ui .microlight .pun,
                 .swagger-ui .microlight .opn,
                 .swagger-ui .microlight .clo {
                   color: #475569 !important;
                 }
                 .dark .swagger-ui .microlight .pun,
                 .dark .swagger-ui .microlight .opn,
                 .dark .swagger-ui .microlight .clo {
                   color: #94a3b8 !important;
                 }
                 .swagger-ui .microlight .kwd {
                   color: #0f766e !important;
                 }
                 .dark .swagger-ui .microlight .kwd {
                   color: #4ade80 !important;
                 }
                 
                 /* Request/Response sections */
                 .swagger-ui .request-body {
                   margin: 20px 0 !important;
                 }
                 
                 .swagger-ui .response {
                   margin: 16px 0 !important;
                 }
                 
                 .swagger-ui .response-col_status {
                   font-weight: 600 !important;
                 }
                 .dark .swagger-ui .response-col_status {
                   color: #f59e0b !important;
                 }
                 
                 .swagger-ui .response-col_description__inner p {
                   font-size: 14px !important;
                   margin: 8px 0 !important;
                 }
                 .dark .swagger-ui .response-col_description__inner p {
                   color: #f8fafc !important;
                 }
                 
                 .swagger-ui table {
                   margin: 10px 0 !important;
                 }
                 
                 .swagger-ui table tbody tr td {
                   padding: 10px !important;
                   vertical-align: top !important;
                 }
                 
                 .dark .swagger-ui table tbody tr td {
                   color: #f8fafc !important;
                   border-color: #2d3748 !important;
                 }
                 
                 /* Swagger UI Buttons and Controls */
                 .dark .swagger-ui .btn {
                   background-color: #000000 !important;
                   color: #38bdf8 !important;
                   border: 1px solid #2d3748 !important;
                 }
                 
                 .dark .swagger-ui .btn:hover {
                   background-color: #111111 !important;
                 }
                 
                 .dark .swagger-ui .btn.execute {
                   background-color: #166534 !important;
                   color: white !important;
                 }
                 
                 .dark .swagger-ui .btn.execute:hover {
                   background-color: #15803d !important;
                 }
                 
                 .dark .swagger-ui .opblock-summary {
                   border-color: #2d3748 !important;
                 }
                 
                 .dark .swagger-ui .opblock {
                   background: #111111 !important;
                   border-color: #2d3748 !important;
                 }
                 
                 /* Dark mode styles */
                 .swagger-wrapper .swagger-ui {
                    color: inherit;
                  }
                 .swagger-wrapper .swagger-ui .info .title {
                    color: var(--tw-prose-headings);
                  }
                 .swagger-wrapper .swagger-ui .opblock-tag {
                    color: var(--tw-prose-headings);
                    border-bottom: 1px solid var(--tw-prose-hr);
                  }
                 .dark .swagger-wrapper .swagger-ui .opblock .opblock-summary-operation-id, 
                 .dark .swagger-wrapper .swagger-ui .opblock .opblock-summary-path, 
                 .dark .swagger-wrapper .swagger-ui .opblock .opblock-summary-path__deprecated, 
                 .dark .swagger-wrapper .swagger-ui .opblock .opblock-summary-description {
                    color: #f8fafc !important;
                  }
                 .dark .swagger-wrapper .swagger-ui .opblock-description-wrapper p, 
                 .dark .swagger-wrapper .swagger-ui .opblock-external-docs-wrapper p, 
                 .dark .swagger-wrapper .swagger-ui .opblock-title_normal p {
                    color: #f8fafc !important;
                  }
                  
                 /* Additional dark mode styles for form controls */
                 .dark .swagger-ui select {
                   background-color: #000000 !important;
                   color: #f8fafc !important;
                   border-color: #2d3748 !important;
                 }
                 
                 .dark .swagger-ui input[type="text"],
                 .dark .swagger-ui input[type="password"],
                 .dark .swagger-ui input[type="search"],
                 .dark .swagger-ui input[type="email"],
                 .dark .swagger-ui input[type="number"] {
                   background-color: #000000 !important;
                   color: #f8fafc !important;
                   border-color: #2d3748 !important;
                 }
                 
                 .dark .swagger-ui textarea {
                   background-color: #000000 !important;
                   color: #f8fafc !important;
                   border-color: #2d3748 !important;
                 }
                 
                 .dark .swagger-ui .model {
                   color: #f8fafc !important;
                 }
                 
                 .dark .swagger-ui .model-title {
                   color: #38bdf8 !important;
                 }
                 
                 .dark .swagger-ui .response-col_description {
                   color: #f8fafc !important;
                 }
                 
                 .dark .swagger-ui table thead tr td, 
                 .dark .swagger-ui table thead tr th {
                   color: #f8fafc !important;
                   border-bottom: 1px solid #2d3748 !important;
                   background-color: #111111 !important;
                 }
                 
                 .dark .swagger-ui .parameters-col_description {
                   color: #f8fafc !important;
                 }
                 
                 .dark .swagger-ui .markdown p, 
                 .dark .swagger-ui .markdown pre, 
                 .dark .swagger-ui .renderedMarkdown p, 
                 .dark .swagger-ui .renderedMarkdown pre {
                   color: #f8fafc !important;
                 }
                 
                 .dark .swagger-ui .parameter__name {
                   color: #38bdf8 !important;
                 }
                 
                 .dark .swagger-ui .parameter__type {
                   color: #4ade80 !important;
                 }
                 
                 .dark .swagger-ui .parameter__deprecated {
                   color: #f87171 !important;
                 }
                 
                 .dark .swagger-ui .parameter__in {
                   color: #94a3b8 !important;
                 }
                `}
              </style>
              <SwaggerUI 
                url="/raas-api-spec.json"
                docExpansion="list"
                deepLinking={true}
                filter={true}
                persistAuthorization={true}
                tryItOutEnabled={true}
                defaultModelsExpandDepth={-1} // Hide models by default
              />
            </div>
          )}
        </div>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            Code Examples
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Authentication Example (cURL)
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-750 p-4 rounded-md overflow-x-auto">
                <code className="text-sm text-gray-800 dark:text-gray-300">
{`curl -X POST "https://drap-sandbox.digitnine.com/auth/realms/cdp/protocol/openid-connect/token" \\
  -H "Content-Type: application/x-www-form-urlencoded" \\
  -d "username=testagentae&password=Admin@123&grant_type=password&client_id=cdp_app&client_secret=mSh18BPiMZeQqFfOvWhgv8wzvnNVbj3Y"`}
                </code>
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Authentication Example (Node.js)
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-750 p-4 rounded-md overflow-x-auto">
                <code className="text-sm text-gray-800 dark:text-gray-300">
{`const axios = require('axios');
const qs = require('qs');

const data = qs.stringify({
  'username': 'testagentae',
  'password': 'Admin@123',
  'grant_type': 'password',
  'client_id': 'cdp_app',
  'client_secret': 'mSh18BPiMZeQqFfOvWhgv8wzvnNVbj3Y'
});

const config = {
  method: 'post',
  url: 'https://drap-sandbox.digitnine.com/auth/realms/cdp/protocol/openid-connect/token',
  headers: { 
    'Content-Type': 'application/x-www-form-urlencoded'
  },
  data: data
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    // Store the access token for future requests
    const accessToken = response.data.access_token;
  })
  .catch(function (error) {
    console.log(error);
  });`}
                </code>
              </pre>
            </div>
            <div>
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Create Quote Example (Node.js)
              </h3>
              <pre className="bg-gray-100 dark:bg-gray-750 p-4 rounded-md overflow-x-auto">
                <code className="text-sm text-gray-800 dark:text-gray-300">
{`const axios = require('axios');

const data = JSON.stringify({
  "sending_country_code": "AE",
  "sending_currency_code": "AED",
  "receiving_country_code": "PK",
  "receiving_currency_code": "PKR",
  "sending_amount": 300,
  "receiving_mode": "BANK",
  "type": "SEND",
  "instrument": "REMITTANCE"
});

const config = {
  method: 'post',
  url: 'https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/quote',
  headers: { 
    'Content-Type': 'application/json', 
    'sender': 'testagentae', 
    'channel': 'Direct', 
    'company': '784825', 
    'branch': '784826', 
    'Authorization': 'Bearer YOUR_ACCESS_TOKEN'
  },
  data: data
};

axios(config)
  .then(function (response) {
    console.log(JSON.stringify(response.data));
    // Store the quote_id for creating a transaction
    const quoteId = response.data.data.quote_id;
  })
  .catch(function (error) {
    console.log(error);
  });`}
                </code>
              </pre>
            </div>
          </div>
        </div>
      </ScrollRevealContainer>
    </div>
  );
};

export default APIReference; 