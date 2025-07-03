import React, { useState, useEffect } from 'react';
import SwaggerUI from 'swagger-ui-react';
import 'swagger-ui-react/swagger-ui.css';
import { motion } from 'framer-motion';
import ScrollRevealContainer from '../components/ScrollRevealContainer';

const APIReference = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Simulate loading time for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 500);
    
    return () => clearTimeout(timer);
  }, []);

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
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md mb-8 overflow-hidden">
          {isLoading ? (
            <div className="flex justify-center items-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="p-6 text-center text-red-500">
              <p>Error loading API documentation: {error}</p>
            </div>
          ) : (
            <div className="swagger-wrapper">
              {/* Custom styles to make Swagger UI work better with dark mode */}
              <style jsx>{`
                .swagger-wrapper :global(.swagger-ui) {
                  color: inherit;
                }
                .swagger-wrapper :global(.swagger-ui .info .title) {
                  color: var(--tw-prose-headings);
                }
                .swagger-wrapper :global(.swagger-ui .opblock-tag) {
                  color: var(--tw-prose-headings);
                  border-bottom: 1px solid var(--tw-prose-hr);
                }
                .dark .swagger-wrapper :global(.swagger-ui .opblock) {
                  background: rgba(30, 41, 59, 0.5);
                  border-color: rgba(51, 65, 85, 0.5);
                }
                .dark .swagger-wrapper :global(.swagger-ui .opblock .opblock-summary-operation-id, 
                                              .swagger-ui .opblock .opblock-summary-path, 
                                              .swagger-ui .opblock .opblock-summary-path__deprecated, 
                                              .swagger-ui .opblock .opblock-summary-description) {
                  color: rgba(226, 232, 240, 0.9);
                }
                .dark .swagger-wrapper :global(.swagger-ui .opblock-description-wrapper p, 
                                              .swagger-ui .opblock-external-docs-wrapper p, 
                                              .swagger-ui .opblock-title_normal p) {
                  color: rgba(226, 232, 240, 0.9);
                }
                .dark .swagger-wrapper :global(.swagger-ui .btn) {
                  color: rgba(226, 232, 240, 0.9);
                  background-color: rgba(51, 65, 85, 0.5);
                  border-color: rgba(71, 85, 105, 0.5);
                }
                .dark .swagger-wrapper :global(.swagger-ui select) {
                  background-color: rgba(30, 41, 59, 0.8);
                  color: rgba(226, 232, 240, 0.9);
                  border-color: rgba(71, 85, 105, 0.5);
                }
                .dark .swagger-wrapper :global(.swagger-ui input) {
                  background-color: rgba(30, 41, 59, 0.8);
                  color: rgba(226, 232, 240, 0.9);
                  border-color: rgba(71, 85, 105, 0.5);
                }
                .dark .swagger-wrapper :global(.swagger-ui textarea) {
                  background-color: rgba(30, 41, 59, 0.8);
                  color: rgba(226, 232, 240, 0.9);
                  border-color: rgba(71, 85, 105, 0.5);
                }
                .dark .swagger-wrapper :global(.swagger-ui .model) {
                  color: rgba(226, 232, 240, 0.9);
                }
                .dark .swagger-wrapper :global(.swagger-ui .model-title) {
                  color: rgba(226, 232, 240, 0.9);
                }
                .dark .swagger-wrapper :global(.swagger-ui .response-col_status) {
                  color: rgba(226, 232, 240, 0.9);
                }
                .dark .swagger-wrapper :global(.swagger-ui .response-col_description) {
                  color: rgba(226, 232, 240, 0.9);
                }
                .dark .swagger-wrapper :global(.swagger-ui table thead tr td, 
                                              .swagger-ui table thead tr th) {
                  color: rgba(226, 232, 240, 0.9);
                  border-bottom: 1px solid rgba(71, 85, 105, 0.5);
                }
                .dark .swagger-wrapper :global(.swagger-ui .parameters-col_description) {
                  color: rgba(226, 232, 240, 0.9);
                }
                .dark .swagger-wrapper :global(.swagger-ui .markdown p, 
                                              .swagger-ui .markdown pre, 
                                              .swagger-ui .renderedMarkdown p, 
                                              .swagger-ui .renderedMarkdown pre) {
                  color: rgba(226, 232, 240, 0.9);
                }
              `}</style>
              <SwaggerUI 
                url="/raas-api-spec.json"
                docExpansion="list"
                deepLinking={true}
                filter={true}
                persistAuthorization={true}
                tryItOutEnabled={true}
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