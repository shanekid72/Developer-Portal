import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Search, Code, Filter, XCircle } from 'lucide-react';
import { APIEndpoint } from '../types';
import ScrollRevealContainer from '../components/ScrollRevealContainer';
import ApiEndpointCard from '../components/ApiEndpointCard';
import clsx from 'clsx';
import { Theme } from '../types';

interface APIReferencePageProps {
  theme: Theme;
}

interface APISection {
  id: string;
  name: string;
  description: string;
  endpoints: APIEndpoint[];
}

// API sections based on the Postman collection
const apiSections: Record<string, APISection[]> = {
  auth: [
    {
      id: 'auth',
      name: 'Authentication',
      description: 'Endpoints for obtaining access tokens to use the RaaS API',
      endpoints: [
        {
          id: 'auth-keycloak',
          title: 'Get Access Token',
      method: 'POST',
          path: '/auth/realms/cdp/protocol/openid-connect/token',
          description: 'Authenticate and get an access token for API access',
          requestBody: `{
"username": "testagentae",
"password": "****",
"grant_type": "password",
"client_id": "cdp_app",
"client_secret": "****"
}`,
          responseBody: `{
"access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
"expires_in": 300,
"refresh_expires_in": 1800,
"refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
"token_type": "bearer",
"not-before-policy": 0,
"session_state": "a2fa1d03-36eb-4a75-a142-dc1dd7c1a7a2"
}`,
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X POST "https://drap-sandbox.digitnine.com/auth/realms/cdp/protocol/openid-connect/token" \\
-H "Content-Type: application/x-www-form-urlencoded" \\
-d "username=testagentae" \\
-d "password=****" \\
-d "grant_type=password" \\
-d "client_id=cdp_app" \\
-d "client_secret=****"`
            },
            {
              language: 'javascript',
              label: 'JavaScript',
              code: `const form = new URLSearchParams();
form.append('username', 'testagentae');
form.append('password', '****');
form.append('grant_type', 'password');
form.append('client_id', 'cdp_app');
form.append('client_secret', '****');

const response = await fetch('https://drap-sandbox.digitnine.com/auth/realms/cdp/protocol/openid-connect/token', {
method: 'POST',
headers: {
  'Content-Type': 'application/x-www-form-urlencoded',
},
body: form
});

const data = await response.json();
console.log(data.access_token);`
            },
            {
              language: 'python',
              label: 'Python',
              code: `import requests

url = "https://drap-sandbox.digitnine.com/auth/realms/cdp/protocol/openid-connect/token"
payload = {
"username": "testagentae",
"password": "****",
"grant_type": "password",
"client_id": "cdp_app",
"client_secret": "****"
}
headers = {"Content-Type": "application/x-www-form-urlencoded"}

response = requests.post(url, data=payload, headers=headers)
data = response.json()
print(data["access_token"])`
            }
          ],
          responses: [{
            status: 200,
            description: 'Successful authentication',
            example: {
              access_token: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...',
              expires_in: 300,
              refresh_expires_in: 1800,
              refresh_token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
              token_type: 'bearer',
              'not-before-policy': 0,
              session_state: 'a2fa1d03-36eb-4a75-a142-dc1dd7c1a7a2'
            }
          }],
          guidelines: `
<h5>Authentication Rules</h5>
<ul>
  <li>Access tokens are valid for <strong>5 minutes</strong> (300 seconds)</li>
  <li>Refresh tokens are valid for <strong>30 minutes</strong> (1800 seconds)</li>
  <li>Always store tokens securely and never expose them in client-side code</li>
  <li>Use the refresh token to get a new access token when it expires</li>
  <li>For security reasons, there is a rate limit of 10 requests per minute for token generation</li>
</ul>

<h5>Required Headers</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Max Length</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Content-Type</td>
      <td class="p-2">String</td>
      <td class="p-2">36</td>
      <td class="p-2">Yes</td>
      <td class="p-2">application/x-www-form-urlencoded</td>
    </tr>
  </tbody>
</table>

<h5>Required Parameters</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Max Length</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">grant_type</td>
      <td class="p-2">String</td>
      <td class="p-2">10</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Grant type. Will be provided</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">scope</td>
      <td class="p-2">String</td>
      <td class="p-2">60</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Scope name. Will be provided</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">client_id</td>
      <td class="p-2">String</td>
      <td class="p-2">60</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Client Id. Will be provided</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">client_secret</td>
      <td class="p-2">String</td>
      <td class="p-2">60</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Client secret. Will be provided</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">username</td>
      <td class="p-2">String</td>
      <td class="p-2">60</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Admin user name</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">password</td>
      <td class="p-2">String</td>
      <td class="p-2">60</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Admin password</td>
    </tr>
  </tbody>
</table>

<h5>Response Parameters</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Max Length</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">access_token</td>
      <td class="p-2">String</td>
      <td class="p-2">600</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Access token to access the APIs</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">expires_in</td>
      <td class="p-2">Integer</td>
      <td class="p-2">-</td>
      <td class="p-2">Yes</td>
      <td class="p-2">access_token expiry time in seconds</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">refresh_expires_in</td>
      <td class="p-2">Integer</td>
      <td class="p-2">-</td>
      <td class="p-2">No</td>
      <td class="p-2">refresh_token expiry time in seconds</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">refresh_token</td>
      <td class="p-2">String</td>
      <td class="p-2">600</td>
      <td class="p-2">No</td>
      <td class="p-2">Refresh Token</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">token_type</td>
      <td class="p-2">String</td>
      <td class="p-2">-</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Token type</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">not-before-policy</td>
      <td class="p-2">Integer</td>
      <td class="p-2">-</td>
      <td class="p-2">-</td>
      <td class="p-2">-</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">session_state</td>
      <td class="p-2">String</td>
      <td class="p-2">-</td>
      <td class="p-2">-</td>
      <td class="p-2">-</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">scope</td>
      <td class="p-2">String</td>
      <td class="p-2">-</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Scope details</td>
    </tr>
  </tbody>
</table>

<h5>Error Handling</h5>
<ul>
  <li>401 Unauthorized: Invalid credentials</li>
  <li>429 Too Many Requests: Rate limit exceeded</li>
</ul>

<h5>Best Practices</h5>
<ul>
  <li>Implement token caching to avoid unnecessary authentication requests</li>
  <li>Set up automatic token refresh before expiration</li>
</ul>
`
        }
      ]
    }
  ],
  masters: [
    {
      id: 'masters',
      name: 'Codes and Masters',
      description: 'Reference data endpoints for accessing system codes and master data',
      endpoints: [
        {
          id: 'get-codes',
          title: 'Get Codes',
          method: 'GET',
          path: '/raas/masters/v1/codes',
          description: 'Retrieve reference codes for the system',
          requestHeaders: {
            'Content-Type': 'application/json',
            'sender': 'testagentae',
            'channel': 'Direct',
            'company': '784825',
            'branch': '784826',
            'Authorization': 'Bearer {{access_token}}'
          },
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X GET "https://drap-sandbox.digitnine.com/raas/masters/v1/codes" \\
-H "Content-Type: application/json" \\
-H "sender: testagentae" \\
-H "channel: Direct" \\
-H "company: 784825" \\
-H "branch: 784826" \\
-H "Authorization: Bearer {{access_token}}"`
            },
            {
              language: 'javascript',
              label: 'JavaScript',
              code: `const response = await fetch('https://drap-sandbox.digitnine.com/raas/masters/v1/codes', {
method: 'GET',
headers: {
  'Content-Type': 'application/json',
  'sender': 'testagentae',
  'channel': 'Direct',
  'company': '784825',
  'branch': '784826',
  'Authorization': 'Bearer ' + accessToken
}
});

const data = await response.json();
console.log(data);`
            }
          ],
          responses: [{
            status: 200,
            description: 'Successful operation',
            example: {
              status: 'success',
              status_code: '200',
              status_message: 'Success',
              data: {
                codes: [
                  {
                    code_type: 'COUNTRY',
                    code: 'AE',
                    description: 'United Arab Emirates'
                  },
                  {
                    code_type: 'COUNTRY',
                    code: 'IN',
                    description: 'India'
                  },
                  {
                    code_type: 'CURRENCY',
                    code: 'AED',
                    description: 'UAE Dirham'
                  }
                ]
              }
            }
          }],
          guidelines: `
<h5>API Rules</h5>
<ul>
  <li>This endpoint returns all reference codes used throughout the system</li>
  <li>Codes are grouped by code_type (e.g., COUNTRY, CURRENCY, PURPOSE, etc.)</li>
  <li>The response may be large, so implement proper pagination or filtering in your UI</li>
</ul>

<h5>Required Headers</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Max Length</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Content-Type</td>
      <td class="p-2">String</td>
      <td class="p-2">36</td>
      <td class="p-2">Yes</td>
      <td class="p-2">application/json</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">sender</td>
      <td class="p-2">String</td>
      <td class="p-2">60</td>
      <td class="p-2">No</td>
      <td class="p-2">Agent / Partner name</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">channel</td>
      <td class="p-2">String</td>
      <td class="p-2">30</td>
      <td class="p-2">No</td>
      <td class="p-2">Ripple / Direct</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">company</td>
      <td class="p-2">String</td>
      <td class="p-2">6</td>
      <td class="p-2">No</td>
      <td class="p-2">Will be shared</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">branch</td>
      <td class="p-2">String</td>
      <td class="p-2">6</td>
      <td class="p-2">No</td>
      <td class="p-2">Will be shared</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Authorization</td>
      <td class="p-2">String</td>
      <td class="p-2">600</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Bearer token</td>
    </tr>
  </tbody>
</table>

<h5>Response Parameters</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">status</td>
      <td class="p-2">String</td>
      <td class="p-2">Success or failure status</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">status_code</td>
      <td class="p-2">String</td>
      <td class="p-2">HTTP status code</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">status_message</td>
      <td class="p-2">String</td>
      <td class="p-2">Status description</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.codes</td>
      <td class="p-2">Array</td>
      <td class="p-2">Array of code objects</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.codes[].code_type</td>
      <td class="p-2">String</td>
      <td class="p-2">Type of code (e.g., COUNTRY, CURRENCY)</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.codes[].code</td>
      <td class="p-2">String</td>
      <td class="p-2">Code value</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.codes[].description</td>
      <td class="p-2">String</td>
      <td class="p-2">Description of the code</td>
    </tr>
  </tbody>
</table>

<h5>Common Code Types</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Code Type</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">COUNTRY</td>
      <td class="p-2">ISO country codes (e.g., AE, IN)</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">CURRENCY</td>
      <td class="p-2">ISO currency codes (e.g., AED, INR)</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">PURPOSE</td>
      <td class="p-2">Transaction purpose codes (e.g., SLRY, SAVG)</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">INCOME</td>
      <td class="p-2">Source of income codes</td>
    </tr>
  </tbody>
</table>

<h5>Error Handling</h5>
<ul>
  <li>401 Unauthorized: Invalid or expired token</li>
  <li>403 Forbidden: Insufficient permissions</li>
  <li>500 Internal Server Error: System error</li>
</ul>

<h5>Best Practices</h5>
<ul>
  <li>Cache the codes locally to reduce API calls</li>
  <li>Refresh the cache periodically (e.g., daily) to ensure up-to-date data</li>
  <li>Implement proper error handling for code retrieval failures</li>
</ul>
`
        },
        {
          id: 'get-service-corridor',
          title: 'Get Service Corridor',
          method: 'GET',
          path: '/raas/masters/v1/service-corridor',
          description: 'Retrieve available service corridors for remittance',
          requestHeaders: {
            'Content-Type': 'application/json',
            'sender': 'testagentae',
            'channel': 'Direct',
            'company': '784825',
            'branch': '784826',
            'Authorization': 'Bearer {{access_token}}'
          },
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X GET "https://drap-sandbox.digitnine.com/raas/masters/v1/service-corridor" \\
-H "Content-Type: application/json" \\
-H "sender: testagentae" \\
-H "channel: Direct" \\
-H "company: 784825" \\
-H "branch: 784826" \\
-H "Authorization: Bearer {{access_token}}"`
            },
            {
              language: 'javascript',
              label: 'JavaScript',
              code: `const response = await fetch('https://drap-sandbox.digitnine.com/raas/masters/v1/service-corridor', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'sender': 'testagentae',
    'channel': 'Direct',
    'company': '784825',
    'branch': '784826',
    'Authorization': 'Bearer ' + accessToken
  }
});

const data = await response.json();
console.log(data);`
            },
            {
              language: 'python',
              label: 'Python',
              code: `import requests

url = "https://drap-sandbox.digitnine.com/raas/masters/v1/service-corridor"
headers = {
    "Content-Type": "application/json",
    "sender": "testagentae",
    "channel": "Direct",
    "company": "784825",
    "branch": "784826",
    "Authorization": "Bearer " + access_token
}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`
            },
            {
              language: 'java',
              label: 'Java',
              code: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://drap-sandbox.digitnine.com/raas/masters/v1/service-corridor"))
    .header("Content-Type", "application/json")
    .header("sender", "testagentae")
    .header("channel", "Direct")
    .header("company", "784825")
    .header("branch", "784826")
    .header("Authorization", "Bearer " + accessToken)
    .GET()
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`
            },
            {
              language: 'csharp',
              label: 'C#',
              code: `using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

using (HttpClient client = new HttpClient())
{
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    client.DefaultRequestHeaders.Add("sender", "testagentae");
    client.DefaultRequestHeaders.Add("channel", "Direct");
    client.DefaultRequestHeaders.Add("company", "784825");
    client.DefaultRequestHeaders.Add("branch", "784826");
    client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

    HttpResponseMessage response = await client.GetAsync("https://drap-sandbox.digitnine.com/raas/masters/v1/service-corridor");
    string responseBody = await response.Content.ReadAsStringAsync();
    Console.WriteLine(responseBody);
}`
            },
            {
              language: 'php',
              label: 'PHP',
              code: `<?php
$url = 'https://drap-sandbox.digitnine.com/raas/masters/v1/service-corridor';
$headers = [
    'Content-Type: application/json',
    'sender: testagentae',
    'channel: Direct',
    'company: 784825',
    'branch: 784826',
    'Authorization: Bearer ' . $accessToken
];

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($curl);
$data = json_decode($response, true);
curl_close($curl);

print_r($data);
?>`
            }
          ],
          responses: [{
            status: 200,
            description: 'Successful operation',
          example: {
              status: 'success',
              status_code: '200',
              status_message: 'Success',
              data: {
                service_corridors: [
                  {
                    sending_country_code: 'AE',
                    sending_country_name: 'United Arab Emirates',
                    receiving_country_code: 'IN',
                    receiving_country_name: 'India',
                    sending_currency_code: 'AED',
                    receiving_currency_code: 'INR',
                    receiving_modes: ['BANK', 'CASHPICKUP']
                  }
                ]
              }
            }
          }],
          guidelines: `
<h5>Service Corridor Rules</h5>
<ul>
  <li>This endpoint returns all available remittance corridors (country and currency pairs)</li>
  <li>Each corridor defines a valid sending and receiving country/currency combination</li>
  <li>The receiving_modes array indicates available delivery methods for each corridor</li>
</ul>

<h5>Required Headers</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Max Length</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Content-Type</td>
      <td class="p-2">String</td>
      <td class="p-2">36</td>
      <td class="p-2">Yes</td>
      <td class="p-2">application/json</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">sender</td>
      <td class="p-2">String</td>
      <td class="p-2">60</td>
      <td class="p-2">No</td>
      <td class="p-2">Agent / Partner name</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">channel</td>
      <td class="p-2">String</td>
      <td class="p-2">30</td>
      <td class="p-2">No</td>
      <td class="p-2">Ripple / Direct</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">company</td>
      <td class="p-2">String</td>
      <td class="p-2">6</td>
      <td class="p-2">No</td>
      <td class="p-2">Will be shared</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">branch</td>
      <td class="p-2">String</td>
      <td class="p-2">6</td>
      <td class="p-2">No</td>
      <td class="p-2">Will be shared</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Authorization</td>
      <td class="p-2">String</td>
      <td class="p-2">600</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Bearer token</td>
    </tr>
  </tbody>
</table>

<h5>Response Parameters</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">status</td>
      <td class="p-2">String</td>
      <td class="p-2">Success or failure status</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">status_code</td>
      <td class="p-2">String</td>
      <td class="p-2">HTTP status code</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">status_message</td>
      <td class="p-2">String</td>
      <td class="p-2">Status description</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.service_corridors</td>
      <td class="p-2">Array</td>
      <td class="p-2">Array of service corridor objects</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.service_corridors[].sending_country_code</td>
      <td class="p-2">String</td>
      <td class="p-2">ISO 2-character sending country code</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.service_corridors[].sending_country_name</td>
      <td class="p-2">String</td>
      <td class="p-2">Sending country name</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.service_corridors[].receiving_country_code</td>
      <td class="p-2">String</td>
      <td class="p-2">ISO 2-character receiving country code</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.service_corridors[].receiving_country_name</td>
      <td class="p-2">String</td>
      <td class="p-2">Receiving country name</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.service_corridors[].sending_currency_code</td>
      <td class="p-2">String</td>
      <td class="p-2">ISO 3-character sending currency code</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.service_corridors[].receiving_currency_code</td>
      <td class="p-2">String</td>
      <td class="p-2">ISO 3-character receiving currency code</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.service_corridors[].receiving_modes</td>
      <td class="p-2">Array</td>
      <td class="p-2">Array of available receiving modes</td>
    </tr>
  </tbody>
</table>

<h5>Available Receiving Modes</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Mode</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">BANK</td>
      <td class="p-2">Direct bank account deposit</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">CASHPICKUP</td>
      <td class="p-2">Cash pickup at agent location</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">WALLET</td>
      <td class="p-2">Mobile wallet transfer</td>
    </tr>
  </tbody>
</table>

<h5>Error Handling</h5>
<ul>
  <li>401 Unauthorized: Invalid or expired token</li>
  <li>403 Forbidden: Insufficient permissions</li>
  <li>500 Internal Server Error: System error</li>
</ul>

<h5>Best Practices</h5>
<ul>
  <li>Cache service corridor data to reduce API calls</li>
  <li>Refresh the cache periodically to ensure up-to-date information</li>
  <li>Use this data to populate country/currency dropdowns in your UI</li>
  <li>Filter receiving modes based on the selected corridor</li>
</ul>
`
        },
        {
          id: 'get-rates',
          title: 'Get Rates',
          method: 'GET',
          path: '/raas/masters/v1/rates',
          description: 'Retrieve current exchange rates',
          requestHeaders: {
            'Content-Type': 'application/json',
            'sender': 'testagentae',
            'channel': 'Direct',
            'company': '784825',
            'branch': '784826',
            'Authorization': 'Bearer {{access_token}}'
          },
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X GET "https://drap-sandbox.digitnine.com/raas/masters/v1/rates" \\
-H "Content-Type: application/json" \\
-H "sender: testagentae" \\
-H "channel: Direct" \\
-H "company: 784825" \\
-H "branch: 784826" \\
-H "Authorization: Bearer {{access_token}}"`
            },
            {
              language: 'javascript',
              label: 'JavaScript',
              code: `const response = await fetch('https://drap-sandbox.digitnine.com/raas/masters/v1/rates', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'sender': 'testagentae',
    'channel': 'Direct',
    'company': '784825',
    'branch': '784826',
    'Authorization': 'Bearer ' + accessToken
  }
});

const data = await response.json();
console.log(data);`
            },
            {
              language: 'python',
              label: 'Python',
              code: `import requests

url = "https://drap-sandbox.digitnine.com/raas/masters/v1/rates"
headers = {
    "Content-Type": "application/json",
    "sender": "testagentae",
    "channel": "Direct",
    "company": "784825",
    "branch": "784826",
    "Authorization": "Bearer " + access_token
}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`
            },
            {
              language: 'java',
              label: 'Java',
              code: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://drap-sandbox.digitnine.com/raas/masters/v1/rates"))
    .header("Content-Type", "application/json")
    .header("sender", "testagentae")
    .header("channel", "Direct")
    .header("company", "784825")
    .header("branch", "784826")
    .header("Authorization", "Bearer " + accessToken)
    .GET()
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`
            },
            {
              language: 'csharp',
              label: 'C#',
              code: `using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

using (HttpClient client = new HttpClient())
{
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    client.DefaultRequestHeaders.Add("sender", "testagentae");
    client.DefaultRequestHeaders.Add("channel", "Direct");
    client.DefaultRequestHeaders.Add("company", "784825");
    client.DefaultRequestHeaders.Add("branch", "784826");
    client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

    HttpResponseMessage response = await client.GetAsync("https://drap-sandbox.digitnine.com/raas/masters/v1/rates");
    string responseBody = await response.Content.ReadAsStringAsync();
    Console.WriteLine(responseBody);
}`
            },
            {
              language: 'php',
              label: 'PHP',
              code: `<?php
$url = 'https://drap-sandbox.digitnine.com/raas/masters/v1/rates';
$headers = [
    'Content-Type: application/json',
    'sender: testagentae',
    'channel: Direct',
    'company: 784825',
    'branch: 784826',
    'Authorization: Bearer ' . $accessToken
];

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($curl);
$data = json_decode($response, true);
curl_close($curl);

print_r($data);
?>`
            }
          ],
          responses: [{
            status: 200,
            description: 'Successful operation',
          example: {
              status: 'success',
              status_code: '200',
              status_message: 'Success',
              data: {
                rates: [
                  {
                    from_currency_code: 'AED',
                    to_currency_code: 'INR',
                    rate: 22.5,
                    effective_date: '2023-11-01T00:00:00Z'
                  }
                ]
              }
            }
          }],
          guidelines: `
<h5>Exchange Rate Rules</h5>
<ul>
  <li>This endpoint returns current exchange rates for all supported currency pairs</li>
  <li>Rates are updated periodically throughout the day</li>
  <li>The effective_date indicates when the rate was last updated</li>
</ul>

<h5>Required Headers</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Max Length</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Content-Type</td>
      <td class="p-2">String</td>
      <td class="p-2">36</td>
      <td class="p-2">Yes</td>
      <td class="p-2">application/json</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">sender</td>
      <td class="p-2">String</td>
      <td class="p-2">60</td>
      <td class="p-2">No</td>
      <td class="p-2">Agent / Partner name</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">channel</td>
      <td class="p-2">String</td>
      <td class="p-2">30</td>
      <td class="p-2">No</td>
      <td class="p-2">Ripple / Direct</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">company</td>
      <td class="p-2">String</td>
      <td class="p-2">6</td>
      <td class="p-2">No</td>
      <td class="p-2">Will be shared</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">branch</td>
      <td class="p-2">String</td>
      <td class="p-2">6</td>
      <td class="p-2">No</td>
      <td class="p-2">Will be shared</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Authorization</td>
      <td class="p-2">String</td>
      <td class="p-2">600</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Bearer token</td>
    </tr>
  </tbody>
</table>

<h5>Response Parameters</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">status</td>
      <td class="p-2">String</td>
      <td class="p-2">Success or failure status</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">status_code</td>
      <td class="p-2">String</td>
      <td class="p-2">HTTP status code</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">status_message</td>
      <td class="p-2">String</td>
      <td class="p-2">Status description</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.rates</td>
      <td class="p-2">Array</td>
      <td class="p-2">Array of rate objects</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.rates[].from_currency_code</td>
      <td class="p-2">String</td>
      <td class="p-2">ISO 3-character source currency code</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.rates[].to_currency_code</td>
      <td class="p-2">String</td>
      <td class="p-2">ISO 3-character target currency code</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.rates[].rate</td>
      <td class="p-2">BigDecimal</td>
      <td class="p-2">Exchange rate value</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.rates[].effective_date</td>
      <td class="p-2">String</td>
      <td class="p-2">Date and time when the rate became effective</td>
    </tr>
  </tbody>
</table>

<h5>Error Handling</h5>
<ul>
  <li>401 Unauthorized: Invalid or expired token</li>
  <li>403 Forbidden: Insufficient permissions</li>
  <li>500 Internal Server Error: System error</li>
</ul>

<h5>Best Practices</h5>
<ul>
  <li>Cache rates locally to reduce API calls</li>
  <li>Refresh the cache periodically (e.g., hourly) to ensure up-to-date rates</li>
  <li>Display the effective date to users so they know when the rate was last updated</li>
  <li>Implement proper error handling for rate retrieval failures</li>
</ul>
`
        },
        {
          id: 'get-banks',
          title: 'Master Banks',
          method: 'GET',
          path: '/raas/masters/v1/banks',
          description: 'Retrieve list of available banks',
          requestHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{access_token}}'
          },
          queryParams: [
            {
              name: 'receiving_country_code',
              description: 'ISO country code of the receiving country',
              required: true
            },
            {
              name: 'receiving_mode',
              description: 'The mode of receiving funds (BANK, CASHPICKUP, etc.)',
              required: true
            },
            {
              name: 'correspondent',
              description: 'Correspondent code',
              required: false
        }
      ],
      codeExamples: [
        {
          language: 'curl',
          label: 'cURL',
              code: `curl -X GET "https://drap-sandbox.digitnine.com/raas/masters/v1/banks?receiving_country_code=PK&receiving_mode=CASHPICKUP&correspondent=RR" \\
  -H "Content-Type: application/json" \\
-H "Authorization: Bearer {{access_token}}"`
            },
            {
              language: 'javascript',
              label: 'JavaScript',
              code: `const response = await fetch('https://drap-sandbox.digitnine.com/raas/masters/v1/banks?receiving_country_code=PK&receiving_mode=CASHPICKUP&correspondent=RR', {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + accessToken
  }
});

const data = await response.json();
console.log(data);`
            },
            {
              language: 'python',
              label: 'Python',
              code: `import requests

url = "https://drap-sandbox.digitnine.com/raas/masters/v1/banks"
params = {
    "receiving_country_code": "PK",
    "receiving_mode": "CASHPICKUP",
    "correspondent": "RR"
}
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + access_token
}

response = requests.get(url, params=params, headers=headers)
data = response.json()
print(data)`
            },
            {
              language: 'java',
              label: 'Java',
              code: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://drap-sandbox.digitnine.com/raas/masters/v1/banks?receiving_country_code=PK&receiving_mode=CASHPICKUP&correspondent=RR"))
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer " + accessToken)
    .GET()
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`
            },
            {
              language: 'csharp',
              label: 'C#',
              code: `using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

using (HttpClient client = new HttpClient())
{
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

    HttpResponseMessage response = await client.GetAsync("https://drap-sandbox.digitnine.com/raas/masters/v1/banks?receiving_country_code=PK&receiving_mode=CASHPICKUP&correspondent=RR");
    string responseBody = await response.Content.ReadAsStringAsync();
    Console.WriteLine(responseBody);
}`
            },
            {
              language: 'php',
              label: 'PHP',
              code: `<?php
$url = 'https://drap-sandbox.digitnine.com/raas/masters/v1/banks?receiving_country_code=PK&receiving_mode=CASHPICKUP&correspondent=RR';
$headers = [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $accessToken
];

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($curl);
$data = json_decode($response, true);
curl_close($curl);

print_r($data);
?>`
            }
          ],
          responses: [{
            status: 200,
            description: 'Successful operation',
            example: {
              status: 'success',
              status_code: '200',
              status_message: 'Success',
              data: {
                banks: [
                  {
                    id: '11232',
                    name: 'Allied Bank Limited',
                    swift_code: 'ABPAPKKA',
                    country_code: 'PK'
                  }
                ]
              }
            }
          }],
          guidelines: `
<h5>API Rules</h5>
<ul>
  <li>This endpoint returns banks available for the specified receiving country and mode</li>
  <li>The correspondent parameter is required for cash pickup transactions</li>
  <li>Bank data includes identifiers needed for bank account transfers</li>
</ul>

<h5>Required Headers</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Max Length</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Content-Type</td>
      <td class="p-2">String</td>
      <td class="p-2">36</td>
      <td class="p-2">Yes</td>
      <td class="p-2">application/json</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">sender</td>
      <td class="p-2">String</td>
      <td class="p-2">60</td>
      <td class="p-2">No</td>
      <td class="p-2">Agent / Partner name</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">channel</td>
      <td class="p-2">String</td>
      <td class="p-2">30</td>
      <td class="p-2">No</td>
      <td class="p-2">Ripple / Direct</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">company</td>
      <td class="p-2">String</td>
      <td class="p-2">6</td>
      <td class="p-2">No</td>
      <td class="p-2">Will be shared</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">branch</td>
      <td class="p-2">String</td>
      <td class="p-2">6</td>
      <td class="p-2">No</td>
      <td class="p-2">Will be shared</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Authorization</td>
      <td class="p-2">String</td>
      <td class="p-2">600</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Bearer token</td>
    </tr>
  </tbody>
</table>

<h5>Required Query Parameters</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Max Length</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">receiving_country_code</td>
      <td class="p-2">String</td>
      <td class="p-2">2</td>
      <td class="p-2">Yes</td>
      <td class="p-2">ISO 2-character country code</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">receiving_mode</td>
      <td class="p-2">String</td>
      <td class="p-2">20</td>
      <td class="p-2">Yes</td>
      <td class="p-2">BANK, CASHPICKUP, WALLET, etc.</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">correspondent</td>
      <td class="p-2">String</td>
      <td class="p-2">2</td>
      <td class="p-2">Conditional</td>
      <td class="p-2">Required for CASHPICKUP mode</td>
    </tr>
  </tbody>
</table>

<h5>Response Parameters</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">status</td>
      <td class="p-2">String</td>
      <td class="p-2">Success or failure status</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">status_code</td>
      <td class="p-2">String</td>
      <td class="p-2">HTTP status code</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">status_message</td>
      <td class="p-2">String</td>
      <td class="p-2">Status description</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.banks</td>
      <td class="p-2">Array</td>
      <td class="p-2">Array of bank objects</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.banks[].id</td>
      <td class="p-2">String</td>
      <td class="p-2">Unique bank identifier</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.banks[].name</td>
      <td class="p-2">String</td>
      <td class="p-2">Bank name</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.banks[].swift_code</td>
      <td class="p-2">String</td>
      <td class="p-2">SWIFT/BIC code</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.banks[].country_code</td>
      <td class="p-2">String</td>
      <td class="p-2">ISO 2-character country code</td>
    </tr>
  </tbody>
</table>

<h5>Error Handling</h5>
<ul>
  <li>400 Bad Request: Missing required parameters</li>
  <li>401 Unauthorized: Invalid or expired token</li>
  <li>403 Forbidden: Insufficient permissions</li>
  <li>500 Internal Server Error: System error</li>
</ul>

<h5>Best Practices</h5>
<ul>
  <li>Cache bank data to reduce API calls</li>
  <li>Refresh the cache periodically to ensure up-to-date information</li>
  <li>Use this data to populate bank selection dropdowns in your UI</li>
  <li>Implement proper error handling for bank retrieval failures</li>
</ul>
`
        },
        {
          id: 'get-bank-by-id',
          title: 'Master Banks - ID',
          method: 'GET',
          path: '/raas/masters/v1/banks/{bank_id}',
          description: 'Retrieve bank details by ID',
          requestHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{access_token}}'
          },
          pathParams: [
            {
              name: 'bank_id',
              description: 'The unique identifier of the bank',
              required: true
            }
          ],
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X GET "https://drap-sandbox.digitnine.com/raas/masters/v1/banks/11232" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer {{access_token}}"`
            },
            {
              language: 'javascript',
              label: 'JavaScript',
              code: `const bankId = '11232';
const response = await fetch(\`https://drap-sandbox.digitnine.com/raas/masters/v1/banks/\${bankId}\`, {
  method: 'GET',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + accessToken
  }
});

const data = await response.json();
console.log(data);`
            },
            {
              language: 'python',
              label: 'Python',
              code: `import requests

bank_id = "11232"
url = f"https://drap-sandbox.digitnine.com/raas/masters/v1/banks/{bank_id}"
headers = {
    "Content-Type": "application/json",
    "Authorization": "Bearer " + access_token
}

response = requests.get(url, headers=headers)
data = response.json()
print(data)`
            },
            {
              language: 'java',
              label: 'Java',
              code: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

String bankId = "11232";
HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://drap-sandbox.digitnine.com/raas/masters/v1/banks/" + bankId))
    .header("Content-Type", "application/json")
    .header("Authorization", "Bearer " + accessToken)
    .GET()
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`
            },
            {
              language: 'csharp',
              label: 'C#',
              code: `using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Threading.Tasks;

using (HttpClient client = new HttpClient())
{
    string bankId = "11232";
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

    HttpResponseMessage response = await client.GetAsync($"https://drap-sandbox.digitnine.com/raas/masters/v1/banks/{bankId}");
    string responseBody = await response.Content.ReadAsStringAsync();
    Console.WriteLine(responseBody);
}`
            },
            {
              language: 'php',
              label: 'PHP',
              code: `<?php
$bankId = '11232';
$url = "https://drap-sandbox.digitnine.com/raas/masters/v1/banks/{$bankId}";
$headers = [
    'Content-Type: application/json',
    'Authorization: Bearer ' . $accessToken
];

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($curl);
$data = json_decode($response, true);
curl_close($curl);

print_r($data);
?>`
            }
          ],
          responses: [{
            status: 200,
            description: 'Successful operation',
            example: {
              status: 'success',
              status_code: '200',
              status_message: 'Success',
              data: {
                bank: {
                  id: '11232',
                  name: 'Allied Bank Limited',
                  swift_code: 'ABPAPKKA',
                  country_code: 'PK',
                  address: 'Main Branch, Lahore',
                  branches: [
                    {
                      id: '112321',
                      name: 'Mall Road Branch',
                      address: 'Mall Road, Lahore'
                    }
                  ]
                }
              }
            }
          }],
          guidelines: `
<h5>API Rules</h5>
<ul>
  <li>This endpoint returns detailed information about a specific bank</li>
  <li>The bank_id path parameter is required and must be a valid bank identifier</li>
  <li>The response includes bank details and may include branch information</li>
</ul>

<h5>Required Headers</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Max Length</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Content-Type</td>
      <td class="p-2">String</td>
      <td class="p-2">36</td>
      <td class="p-2">Yes</td>
      <td class="p-2">application/json</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">sender</td>
      <td class="p-2">String</td>
      <td class="p-2">60</td>
      <td class="p-2">No</td>
      <td class="p-2">Agent / Partner name</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">channel</td>
      <td class="p-2">String</td>
      <td class="p-2">30</td>
      <td class="p-2">No</td>
      <td class="p-2">Ripple / Direct</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">company</td>
      <td class="p-2">String</td>
      <td class="p-2">6</td>
      <td class="p-2">No</td>
      <td class="p-2">Will be shared</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">branch</td>
      <td class="p-2">String</td>
      <td class="p-2">6</td>
      <td class="p-2">No</td>
      <td class="p-2">Will be shared</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Authorization</td>
      <td class="p-2">String</td>
      <td class="p-2">600</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Bearer token</td>
    </tr>
  </tbody>
</table>

<h5>Path Parameters</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Max Length</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">bank_id</td>
      <td class="p-2">String</td>
      <td class="p-2">60</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Unique bank identifier</td>
    </tr>
  </tbody>
</table>

<h5>Response Parameters</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">status</td>
      <td class="p-2">String</td>
      <td class="p-2">Success or failure status</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">status_code</td>
      <td class="p-2">String</td>
      <td class="p-2">HTTP status code</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">status_message</td>
      <td class="p-2">String</td>
      <td class="p-2">Status description</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.bank</td>
      <td class="p-2">Object</td>
      <td class="p-2">Bank object</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.bank.id</td>
      <td class="p-2">String</td>
      <td class="p-2">Unique bank identifier</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.bank.name</td>
      <td class="p-2">String</td>
      <td class="p-2">Bank name</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.bank.swift_code</td>
      <td class="p-2">String</td>
      <td class="p-2">SWIFT/BIC code</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.bank.country_code</td>
      <td class="p-2">String</td>
      <td class="p-2">ISO 2-character country code</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.bank.address</td>
      <td class="p-2">String</td>
      <td class="p-2">Bank address</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">data.bank.branches</td>
      <td class="p-2">Array</td>
      <td class="p-2">Array of branch objects (if available)</td>
    </tr>
  </tbody>
</table>

<h5>Error Handling</h5>
<ul>
  <li>400 Bad Request: Invalid bank ID format</li>
  <li>401 Unauthorized: Invalid or expired token</li>
  <li>403 Forbidden: Insufficient permissions</li>
  <li>404 Not Found: Bank not found</li>
  <li>500 Internal Server Error: System error</li>
</ul>

<h5>Best Practices</h5>
<ul>
  <li>Cache bank details to reduce API calls</li>
  <li>Use this endpoint when you need detailed information about a specific bank</li>
  <li>Implement proper error handling, especially for 404 responses</li>
</ul>
`
        }
      ]
    }
  ],
  remittance: [
    {
      id: 'remittance',
      name: 'Remittance API',
      description: 'Core remittance functionality for creating and managing cross-border transfers',
      endpoints: [
        {
          id: 'create-quote',
          title: 'Create Quote',
          method: 'POST',
          path: '/amr/ras/api/v1_0/ras/quote',
          description: 'Create a quote for a remittance transaction',
          requestHeaders: {
            'Content-Type': 'application/json',
            'sender': 'testagentae',
            'channel': 'Direct',
            'company': '784825',
            'branch': '784826',
            'Authorization': 'Bearer {{access_token}}'
          },
          requestBody: `{
"sending_country_code": "AE",
"sending_currency_code": "AED",
"receiving_country_code": "PK",
"receiving_currency_code": "PKR",
"sending_amount": 300,
"receiving_mode": "BANK",
"type": "SEND",
"instrument": "REMITTANCE"
}`,
          responseBody: `{
"status": "success",
"status_code": "200",
"status_message": "Success",
"data": {
  "quote_id": "Q123456789",
  "sending_country_code": "AE",
  "sending_currency_code": "AED",
  "receiving_country_code": "IN",
  "receiving_currency_code": "INR",
  "sending_amount": 300,
  "receiving_amount": 14250.00,
  "total_payin_amount": 315.00,
  "fx_rates": [
    {
      "rate": 47.50,
      "base_currency_code": "AED",
      "counter_currency_code": "INR",
      "type": "SELL"
    },
    {
      "rate": 0.02105263,
      "base_currency_code": "INR",
      "counter_currency_code": "AED",
      "type": "BUY"
    }
  ],
  "fee_details": [
    {
      "type": "COMMISSION",
      "model": "OUR",
      "currency_code": "AED",
      "amount": 15.00,
      "description": "Commission"
    },
    {
      "type": "TAX",
      "model": "OUR",
      "currency_code": "AED",
      "amount": 0,
      "description": "Tax"
    }
  ],
  "settlement_details": [
    {
      "charge_type": "COMMISSION",
      "value": 0.4,
      "currency_code": "AED"
    },
    {
      "charge_type": "TREASURYMARGIN",
      "value": 0.4,
      "currency_code": "AED"
    }
  ],
  "counterparty_details": [
    {
      "type": "AMOUNT",
      "value": 10000.0,
      "currency_code": "INR"
    },
    {
      "type": "TOTALAMOUNT",
      "value": 10004.0,
      "currency_code": "INR"
    },
    {
      "type": "RATE",
      "value": 0.04555183,
      "currency_code": "INR"
    }
  ],
  "correspondent_rules": [
    {
      "field": "purpose_of_txn",
      "rule": "it is mandatory"
    },
    {
      "field": "receive_amount",
      "rule": "cannot be null"
    },
    {
      "field": "receiver.bank_details.account_number",
      "rule": "it is mandatory and should not exceed 20 characters"
    }
  ],
  "price_guarantee": "FIRM",
  "expiry_time": "2023-12-31T23:59:59Z"
}
}`,
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X POST "https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/quote" \\
-H "Content-Type: application/json" \\
-H "sender: testagentae" \\
-H "channel: Direct" \\
-H "company: 784825" \\
-H "branch: 784826" \\
-H "Authorization: Bearer {{access_token}}" \\
-d '{
  "sending_country_code": "AE",
  "sending_currency_code": "AED",
  "receiving_country_code": "PK",
  "receiving_currency_code": "PKR",
  "sending_amount": 300,
  "receiving_mode": "BANK",
  "type": "SEND",
  "instrument": "REMITTANCE"
  }'`
        },
        {
          language: 'javascript',
          label: 'JavaScript',
              code: `const response = await fetch('https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/quote', {
  method: 'POST',
  headers: {
  'Content-Type': 'application/json',
  'sender': 'testagentae',
  'channel': 'Direct',
  'company': '784825',
  'branch': '784826',
  'Authorization': 'Bearer ' + accessToken
  },
  body: JSON.stringify({
  sending_country_code: "AE",
  sending_currency_code: "AED",
  receiving_country_code: "PK",
  receiving_currency_code: "PKR",
  sending_amount: 300,
  receiving_mode: "BANK",
  type: "SEND",
  instrument: "REMITTANCE"
  })
});

const data = await response.json();
console.log(data);`
            },
            {
              language: 'python',
              label: 'Python',
              code: `import requests
import json

url = "https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/quote"
headers = {
    "Content-Type": "application/json",
    "sender": "testagentae",
    "channel": "Direct",
    "company": "784825",
    "branch": "784826",
    "Authorization": "Bearer " + access_token
}
payload = {
    "sending_country_code": "AE",
    "sending_currency_code": "AED",
    "receiving_country_code": "PK",
    "receiving_currency_code": "PKR",
    "sending_amount": 300,
    "receiving_mode": "BANK",
    "type": "SEND",
    "instrument": "REMITTANCE"
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
data = response.json()
print(data)`
            },
            {
              language: 'java',
              label: 'Java',
              code: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

String requestBody = """
{
  "sending_country_code": "AE",
  "sending_currency_code": "AED",
  "receiving_country_code": "PK",
  "receiving_currency_code": "PKR",
  "sending_amount": 300,
  "receiving_mode": "BANK",
  "type": "SEND",
  "instrument": "REMITTANCE"
}
""";

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/quote"))
    .header("Content-Type", "application/json")
    .header("sender", "testagentae")
    .header("channel", "Direct")
    .header("company", "784825")
    .header("branch", "784826")
    .header("Authorization", "Bearer " + accessToken)
    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`
            },
            {
              language: 'csharp',
              label: 'C#',
              code: `using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;

using (HttpClient client = new HttpClient())
{
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    client.DefaultRequestHeaders.Add("sender", "testagentae");
    client.DefaultRequestHeaders.Add("channel", "Direct");
    client.DefaultRequestHeaders.Add("company", "784825");
    client.DefaultRequestHeaders.Add("branch", "784826");
    client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

    var payload = new
    {
        sending_country_code = "AE",
        sending_currency_code = "AED",
        receiving_country_code = "PK",
        receiving_currency_code = "PKR",
        sending_amount = 300,
        receiving_mode = "BANK",
        type = "SEND",
        instrument = "REMITTANCE"
    };

    var content = new StringContent(
        JsonSerializer.Serialize(payload),
        Encoding.UTF8,
        "application/json");

    HttpResponseMessage response = await client.PostAsync("https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/quote", content);
    string responseBody = await response.Content.ReadAsStringAsync();
    Console.WriteLine(responseBody);
}`
            },
            {
              language: 'php',
              label: 'PHP',
              code: `<?php
$url = 'https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/quote';
$headers = [
    'Content-Type: application/json',
    'sender: testagentae',
    'channel: Direct',
    'company: 784825',
    'branch: 784826',
    'Authorization: Bearer ' . $accessToken
];

$payload = json_encode([
    'sending_country_code' => 'AE',
    'sending_currency_code' => 'AED',
    'receiving_country_code' => 'PK',
    'receiving_currency_code' => 'PKR',
    'sending_amount' => 300,
    'receiving_mode' => 'BANK',
    'type' => 'SEND',
    'instrument' => 'REMITTANCE'
]);

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $payload);
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($curl);
$data = json_decode($response, true);
curl_close($curl);

print_r($data);
?>`
            }
          ],
          responses: [{
            status: 200,
            description: 'Successful operation',
            example: {
              status: 'success',
              status_code: '200',
              status_message: 'Success',
              data: {
                quote_id: 'Q123456789'
              }
            }
          }],
          guidelines: `
<h5>Quote Rules</h5>
<ul>
  <li>Quotes are valid for <strong>15 minutes</strong> after creation</li>
  <li>The minimum transaction amount is <strong>100 AED</strong></li>
  <li>The maximum transaction amount is <strong>35,000 AED</strong> per transaction</li>
  <li>Exchange rates are locked at the time of quote creation</li>
  <li>Quotes can be used only once for a transaction</li>
</ul>

<h5>Required Headers</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Max Length</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Content-Type</td>
      <td class="p-2">String</td>
      <td class="p-2">36</td>
      <td class="p-2">Yes</td>
      <td class="p-2">application/json</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">sender</td>
      <td class="p-2">String</td>
      <td class="p-2">60</td>
      <td class="p-2">No</td>
      <td class="p-2">Agent / Partner name</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">channel</td>
      <td class="p-2">String</td>
      <td class="p-2">30</td>
      <td class="p-2">No</td>
      <td class="p-2">Ripple / Direct</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">company</td>
      <td class="p-2">String</td>
      <td class="p-2">6</td>
      <td class="p-2">No</td>
      <td class="p-2">Company code (provided)</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">branch</td>
      <td class="p-2">String</td>
      <td class="p-2">6</td>
      <td class="p-2">No</td>
      <td class="p-2">Branch code (provided)</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Authorization</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Bearer token</td>
    </tr>
  </tbody>
</table>

<h5>Required Parameters</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">sending_country_code</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">ISO 2-char country code</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">sending_currency_code</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">ISO 3-char currency code</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">receiving_country_code</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">ISO 2-char country code</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">receiving_currency_code</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">ISO 3-char currency code</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">sending_amount</td>
      <td class="p-2">Decimal</td>
      <td class="p-2">Conditional</td>
      <td class="p-2">Required if receiving_amount not provided</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">receiving_mode</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">BANK, CASHPICKUP, etc.</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">type</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">SEND or RECEIVE</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">instrument</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">REMITTANCE</td>
    </tr>
  </tbody>
</table>

<h5>Supported Countries and Currencies</h5>
<ul>
  <li>Sending countries: AE (United Arab Emirates)</li>
  <li>Receiving countries: IN (India), PK (Pakistan), PH (Philippines), BD (Bangladesh)</li>
  <li>Sending currencies: AED (UAE Dirham)</li>
  <li>Receiving currencies: INR (Indian Rupee), PKR (Pakistani Rupee), PHP (Philippine Peso), BDT (Bangladeshi Taka)</li>
</ul>

<h5>Error Handling</h5>
<ul>
  <li>400 Bad Request: Invalid input parameters</li>
  <li>422 Unprocessable Entity: Business validation errors (e.g., amount below minimum)</li>
  <li>500 Internal Server Error: System error</li>
</ul>

<h5>Best Practices</h5>
<ul>
  <li>Always validate the quote before proceeding with the transaction</li>
  <li>Include proper error handling for quote creation failures</li>
  <li>Store the quote_id securely for use in the subsequent transaction creation</li>
  <li>Check the expiry_time to ensure the quote is still valid before using it</li>
</ul>
`
        },
        {
          id: 'create-transaction',
          title: 'Create Transaction',
          method: 'POST',
          path: '/amr/ras/api/v1_0/ras/createtransaction',
          description: 'Create a remittance transaction',
          requestHeaders: {
            'Content-Type': 'application/json',
            'sender': 'testagentae',
            'channel': 'Direct',
            'company': '784825',
            'branch': '784826',
            'Authorization': 'Bearer {{access_token}}'
          },
          requestBody: `{
"type": "SEND",
"source_of_income": "SLRY",
"purpose_of_txn": "SAVG",
"instrument": "REMITTANCE",
"message": "Agency transaction",
"sender": {
  "customer_number": "7841001220007002"
},
"receiver": {
  "mobile_number": "+919586741508",
  "first_name": "Anija FirstName",
  "last_name": "Anija Lastname",
  "nationality": "IN",
  "relation_code": "32",
  "bank_details": {
    "account_type_code": "1",
    "iso_code": "BKIPPKKA",
    "iban": "PK12ABCD1234567891234567"
  }
},
"transaction": {
  "quote_id": "Q123456789",
  "agent_transaction_ref_number": "Q123456789"
}
}`,
          responseBody: `{
"status": "success",
"status_code": "200",
"status_message": "Success",
"data": {
  "transaction_ref_number": "T987654321",
  "transaction_status": "PENDING_CONFIRMATION"
}
}`,
      codeExamples: [
        {
          language: 'curl',
          label: 'cURL',
              code: `curl -X POST "https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/createtransaction" \\
-H "Content-Type: application/json" \\
-H "sender: testagentae" \\
-H "channel: Direct" \\
-H "company: 784825" \\
-H "branch: 784826" \\
-H "Authorization: Bearer {{access_token}}" \\
-d '{
  "type": "SEND",
  "source_of_income": "SLRY",
  "purpose_of_txn": "SAVG",
  "instrument": "REMITTANCE",
  "message": "Agency transaction",
  "sender": {
    "customer_number": "7841001220007002"
  },
  "receiver": {
    "mobile_number": "+919586741508",
    "first_name": "Anija FirstName",
    "last_name": "Anija Lastname",
    "nationality": "IN",
    "relation_code": "32",
    "bank_details": {
      "account_type_code": "1",
      "iso_code": "BKIPPKKA",
      "iban": "PK12ABCD1234567891234567"
    }
  },
  "transaction": {
    "quote_id": "Q123456789",
    "agent_transaction_ref_number": "Q123456789"
  }
}'`
            },
            {
              language: 'javascript',
              label: 'JavaScript',
              code: `const payload = {
  type: "SEND",
  source_of_income: "SLRY",
  purpose_of_txn: "SAVG",
  instrument: "REMITTANCE",
  message: "Agency transaction",
  sender: {
    customer_number: "7841001220007002"
  },
  receiver: {
    mobile_number: "+919586741508",
    first_name: "Anija FirstName",
    last_name: "Anija Lastname",
    nationality: "IN",
    relation_code: "32",
    bank_details: {
      account_type_code: "1",
      iso_code: "BKIPPKKA",
      iban: "PK12ABCD1234567891234567"
    }
  },
  transaction: {
    quote_id: "Q123456789",
    agent_transaction_ref_number: "Q123456789"
  }
};

const response = await fetch('https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/createtransaction', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'sender': 'testagentae',
    'channel': 'Direct',
    'company': '784825',
    'branch': '784826',
    'Authorization': 'Bearer ' + accessToken
  },
  body: JSON.stringify(payload)
});

const data = await response.json();
console.log(data);`
            },
            {
              language: 'python',
              label: 'Python',
              code: `import requests
import json

url = "https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/createtransaction"
headers = {
    "Content-Type": "application/json",
    "sender": "testagentae",
    "channel": "Direct",
    "company": "784825",
    "branch": "784826",
    "Authorization": "Bearer " + access_token
}
payload = {
    "type": "SEND",
    "source_of_income": "SLRY",
    "purpose_of_txn": "SAVG",
    "instrument": "REMITTANCE",
    "message": "Agency transaction",
    "sender": {
        "customer_number": "7841001220007002"
    },
    "receiver": {
        "mobile_number": "+919586741508",
        "first_name": "Anija FirstName",
        "last_name": "Anija Lastname",
        "nationality": "IN",
        "relation_code": "32",
        "bank_details": {
            "account_type_code": "1",
            "iso_code": "BKIPPKKA",
            "iban": "PK12ABCD1234567891234567"
        }
    },
    "transaction": {
        "quote_id": "Q123456789",
        "agent_transaction_ref_number": "Q123456789"
    }
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
data = response.json()
print(data)`
            },
            {
              language: 'java',
              label: 'Java',
              code: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

String requestBody = """
{
  "type": "SEND",
  "source_of_income": "SLRY",
  "purpose_of_txn": "SAVG",
  "instrument": "REMITTANCE",
  "message": "Agency transaction",
  "sender": {
    "customer_number": "7841001220007002"
  },
  "receiver": {
    "mobile_number": "+919586741508",
    "first_name": "Anija FirstName",
    "last_name": "Anija Lastname",
    "nationality": "IN",
    "relation_code": "32",
    "bank_details": {
      "account_type_code": "1",
      "iso_code": "BKIPPKKA",
      "iban": "PK12ABCD1234567891234567"
    }
  },
  "transaction": {
    "quote_id": "Q123456789",
    "agent_transaction_ref_number": "Q123456789"
  }
}
""";

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/createtransaction"))
    .header("Content-Type", "application/json")
    .header("sender", "testagentae")
    .header("channel", "Direct")
    .header("company", "784825")
    .header("branch", "784826")
    .header("Authorization", "Bearer " + accessToken)
    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`
            },
            {
              language: 'csharp',
              label: 'C#',
              code: `using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;

using (HttpClient client = new HttpClient())
{
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    client.DefaultRequestHeaders.Add("sender", "testagentae");
    client.DefaultRequestHeaders.Add("channel", "Direct");
    client.DefaultRequestHeaders.Add("company", "784825");
    client.DefaultRequestHeaders.Add("branch", "784826");
    client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

    var payload = new
    {
        type = "SEND",
        source_of_income = "SLRY",
        purpose_of_txn = "SAVG",
        instrument = "REMITTANCE",
        message = "Agency transaction",
        sender = new
        {
            customer_number = "7841001220007002"
        },
        receiver = new
        {
            mobile_number = "+919586741508",
            first_name = "Anija FirstName",
            last_name = "Anija Lastname",
            nationality = "IN",
            relation_code = "32",
            bank_details = new
            {
                account_type_code = "1",
                iso_code = "BKIPPKKA",
                iban = "PK12ABCD1234567891234567"
            }
        },
        transaction = new
        {
            quote_id = "Q123456789",
            agent_transaction_ref_number = "Q123456789"
        }
    };

    var content = new StringContent(
        JsonSerializer.Serialize(payload),
        Encoding.UTF8,
        "application/json");

    HttpResponseMessage response = await client.PostAsync("https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/createtransaction", content);
    string responseBody = await response.Content.ReadAsStringAsync();
    Console.WriteLine(responseBody);
}`
            },
            {
              language: 'php',
              label: 'PHP',
              code: `<?php
$url = 'https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/createtransaction';
$headers = [
    'Content-Type: application/json',
    'sender: testagentae',
    'channel: Direct',
    'company: 784825',
    'branch: 784826',
    'Authorization: Bearer ' . $accessToken
];

$payload = json_encode([
    'type' => 'SEND',
    'source_of_income' => 'SLRY',
    'purpose_of_txn' => 'SAVG',
    'instrument' => 'REMITTANCE',
    'message' => 'Agency transaction',
    'sender' => [
        'customer_number' => '7841001220007002'
    ],
    'receiver' => [
        'mobile_number' => '+919586741508',
        'first_name' => 'Anija FirstName',
        'last_name' => 'Anija Lastname',
        'nationality' => 'IN',
        'relation_code' => '32',
        'bank_details' => [
            'account_type_code' => '1',
            'iso_code' => 'BKIPPKKA',
            'iban' => 'PK12ABCD1234567891234567'
        ]
    ],
    'transaction' => [
        'quote_id' => 'Q123456789',
        'agent_transaction_ref_number' => 'Q123456789'
    ]
]);

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $payload);
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($curl);
$data = json_decode($response, true);
curl_close($curl);

print_r($data);
?>`
            }
          ],
          responses: [{
          status: 200,
            description: 'Successful operation',
          example: {
              status: 'success',
              status_code: '200',
              status_message: 'Success',
              data: {
                transaction_ref_number: 'T987654321',
                transaction_status: 'PENDING_CONFIRMATION'
              }
            }
          }],
          guidelines: `
<h5>Transaction Rules</h5>
<ul>
  <li>Transactions must be created using a valid quote ID</li>
  <li>Quotes must not be expired (valid for 15 minutes after creation)</li>
  <li>Sender must be a registered customer with a valid customer number</li>
  <li>Transaction status will be <strong>PENDING_CONFIRMATION</strong> until explicitly confirmed</li>
  <li>Transactions must be confirmed within <strong>30 minutes</strong> of creation</li>
</ul>

<h5>Required Headers</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Content-Type</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">application/json</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">sender</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Agent/Partner name</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">channel</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Direct</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Authorization</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Bearer token</td>
    </tr>
  </tbody>
</table>

<h5>Required Parameters</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">type</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">SEND</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">source_of_income</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Source code (e.g., SLRY)</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">purpose_of_txn</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Purpose code (e.g., SAVG)</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">sender.customer_number</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Registered customer number</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">receiver.first_name</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Receiver's first name</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">receiver.last_name</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Receiver's last name</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">receiver.bank_details</td>
      <td class="p-2">Object</td>
      <td class="p-2">Conditional</td>
      <td class="p-2">Required for bank transfers</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">transaction.quote_id</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Valid quote ID</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">transaction.agent_transaction_ref_number</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Unique reference number</td>
    </tr>
  </tbody>
</table>

<h5>Error Handling</h5>
<ul>
  <li>400 Bad Request: Missing required fields</li>
  <li>404 Not Found: Invalid quote ID</li>
  <li>422 Unprocessable Entity: Business validation errors (e.g., expired quote)</li>
  <li>500 Internal Server Error: System error</li>
</ul>

<h5>Best Practices</h5>
<ul>
  <li>Always create a new quote before creating a transaction</li>
  <li>Validate all required fields before submission</li>
  <li>Store the transaction_ref_number for subsequent confirmation</li>
  <li>Implement proper error handling for transaction creation failures</li>
</ul>
`
        },
        {
          id: 'confirm-transaction',
          title: 'Confirm Transaction',
          method: 'POST',
          path: '/amr/ras/api/v1_0/ras/confirmtransaction',
          description: 'Confirm a created transaction',
          requestHeaders: {
            'Content-Type': 'application/json',
            'sender': 'testagentae',
            'channel': 'Direct',
            'company': '784825',
            'branch': '784826',
            'Authorization': 'Bearer {{access_token}}'
          },
          requestBody: `{
  "transaction_ref_number": "T987654321"
}`,
          responseBody: `{
  "status": "success",
  "status_code": "200",
  "status_message": "Success",
  "data": {
    "transaction_status": "CONFIRMED"
  }
}`,
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X POST "https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/confirmtransaction" \\
-H "Content-Type: application/json" \\
-H "sender: testagentae" \\
-H "channel: Direct" \\
-H "company: 784825" \\
-H "branch: 784826" \\
-H "Authorization: Bearer {{access_token}}" \\
-d '{
  "transaction_ref_number": "T987654321"
}'`
            },
            {
              language: 'javascript',
              label: 'JavaScript',
              code: `const payload = {
  transaction_ref_number: "T987654321"
};

const response = await fetch('https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/confirmtransaction', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'sender': 'testagentae',
    'channel': 'Direct',
    'company': '784825',
    'branch': '784826',
    'Authorization': 'Bearer ' + accessToken
  },
  body: JSON.stringify(payload)
});

const data = await response.json();
console.log(data);`
            },
            {
              language: 'python',
              label: 'Python',
              code: `import requests
import json

url = "https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/confirmtransaction"
headers = {
    "Content-Type": "application/json",
    "sender": "testagentae",
    "channel": "Direct",
    "company": "784825",
    "branch": "784826",
    "Authorization": "Bearer " + access_token
}
payload = {
    "transaction_ref_number": "T987654321"
}

response = requests.post(url, headers=headers, data=json.dumps(payload))
data = response.json()
print(data)`
            },
            {
              language: 'java',
              label: 'Java',
              code: `import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

String requestBody = """
{
  "transaction_ref_number": "T987654321"
}
""";

HttpClient client = HttpClient.newHttpClient();
HttpRequest request = HttpRequest.newBuilder()
    .uri(URI.create("https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/confirmtransaction"))
    .header("Content-Type", "application/json")
    .header("sender", "testagentae")
    .header("channel", "Direct")
    .header("company", "784825")
    .header("branch", "784826")
    .header("Authorization", "Bearer " + accessToken)
    .POST(HttpRequest.BodyPublishers.ofString(requestBody))
    .build();

HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
System.out.println(response.body());`
            },
            {
              language: 'csharp',
              label: 'C#',
              code: `using System;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Text.Json;

using (HttpClient client = new HttpClient())
{
    client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));
    client.DefaultRequestHeaders.Add("sender", "testagentae");
    client.DefaultRequestHeaders.Add("channel", "Direct");
    client.DefaultRequestHeaders.Add("company", "784825");
    client.DefaultRequestHeaders.Add("branch", "784826");
    client.DefaultRequestHeaders.Add("Authorization", "Bearer " + accessToken);

    var payload = new
    {
        transaction_ref_number = "T987654321"
    };

    var content = new StringContent(
        JsonSerializer.Serialize(payload),
        Encoding.UTF8,
        "application/json");

    HttpResponseMessage response = await client.PostAsync("https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/confirmtransaction", content);
    string responseBody = await response.Content.ReadAsStringAsync();
    Console.WriteLine(responseBody);
}`
            },
            {
              language: 'php',
              label: 'PHP',
              code: `<?php
$url = 'https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/confirmtransaction';
$headers = [
    'Content-Type: application/json',
    'sender: testagentae',
    'channel: Direct',
    'company: 784825',
    'branch: 784826',
    'Authorization: Bearer ' . $accessToken
];

$payload = json_encode([
    'transaction_ref_number' => 'T987654321'
]);

$curl = curl_init();
curl_setopt($curl, CURLOPT_URL, $url);
curl_setopt($curl, CURLOPT_RETURNTRANSFER, true);
curl_setopt($curl, CURLOPT_POST, true);
curl_setopt($curl, CURLOPT_POSTFIELDS, $payload);
curl_setopt($curl, CURLOPT_HTTPHEADER, $headers);

$response = curl_exec($curl);
$data = json_decode($response, true);
curl_close($curl);

print_r($data);
?>`
            }
          ],
          responses: [{
            status: 200,
            description: 'Successful operation',
            example: {
              status: 'success',
              status_code: '200',
              status_message: 'Success',
              data: {
                transaction_status: 'CONFIRMED'
              }
            }
          }],
          guidelines: `
<h5>Confirmation Rules</h5>
<ul>
  <li>Transactions must be confirmed within <strong>30 minutes</strong> of creation</li>
  <li>Only transactions in <strong>PENDING_CONFIRMATION</strong> status can be confirmed</li>
  <li>Once confirmed, a transaction cannot be reversed through the API</li>
  <li>Confirmation triggers the actual fund transfer process</li>
</ul>

<h5>Required Headers</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Content-Type</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">application/json</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Authorization</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Bearer token</td>
    </tr>
  </tbody>
</table>

<h5>Required Parameters</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">transaction_ref_number</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Transaction reference from create transaction</td>
    </tr>
  </tbody>
</table>

<h5>Error Handling</h5>
<ul>
  <li>400 Bad Request: Missing transaction reference number</li>
  <li>404 Not Found: Invalid transaction reference number</li>
  <li>422 Unprocessable Entity: Business validation errors (e.g., expired transaction, already confirmed)</li>
  <li>500 Internal Server Error: System error</li>
</ul>

<h5>Best Practices</h5>
<ul>
  <li>Implement proper error handling for confirmation failures</li>
  <li>Confirm transactions as soon as possible after creation</li>
  <li>Verify transaction status after confirmation using the Enquire Transaction endpoint</li>
</ul>
`
        },
        {
          id: 'enquire-transaction',
          title: 'Enquire Transaction',
          method: 'GET',
          path: '/amr/ras/api/v1_0/ras/enquire-transaction',
          description: 'Get details of a transaction',
          requestHeaders: {
            'Content-Type': 'application/json',
            'sender': 'testagentae',
            'channel': 'Direct',
            'company': '784825',
            'branch': '784826',
            'Authorization': 'Bearer {{access_token}}'
          },
          queryParams: [
            {
              name: 'transaction_ref_number',
              description: 'Reference number of the transaction to enquire',
              required: true
        }
      ],
      codeExamples: [
        {
          language: 'curl',
          label: 'cURL',
              code: `curl -X GET "https://drap-sandbox.digitnine.com/amr/ras/api/v1_0/ras/enquire-transaction?transaction_ref_number=T987654321" \\
-H "Content-Type: application/json" \\
-H "sender: testagentae" \\
-H "channel: Direct" \\
-H "company: 784825" \\
-H "branch: 784826" \\
-H "Authorization: Bearer {{access_token}}"`
            }
          ],
          responses: [{
            status: 200,
            description: 'Successful operation',
            example: {
              status: 'success',
              status_code: '200',
              status_message: 'Success',
              data: {
                transaction_ref_number: 'T987654321',
                transaction_status: 'CONFIRMED',
                sender: {
                  customer_number: '7841001220007002',
                  first_name: 'John',
                  last_name: 'Doe'
                },
                receiver: {
                  first_name: 'Anija FirstName',
                  last_name: 'Anija Lastname',
                  nationality: 'IN'
                },
                transaction: {
                  sending_amount: 300,
                  receiving_amount: 14250.00,
                  exchange_rate: 47.50,
                  fees: 15.00,
                  total_payable: 315.00,
                  created_date: '2023-11-01T12:30:45Z',
                  confirmed_date: '2023-11-01T12:35:10Z'
                }
              }
            }
          }],
          guidelines: `
<h5>Enquiry Rules</h5>
<ul>
  <li>Transaction enquiry can be performed at any time after transaction creation</li>
  <li>The API returns the current state of the transaction</li>
  <li>Transaction details are available for up to 90 days after creation</li>
</ul>

<h5>Required Headers</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Content-Type</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">application/json</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">sender</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Agent/Partner name</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">channel</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Direct</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Authorization</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Bearer token</td>
    </tr>
  </tbody>
</table>

<h5>Required Query Parameters</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">transaction_ref_number</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Transaction reference number</td>
    </tr>
  </tbody>
</table>

<h5>Transaction Status Values</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Status</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">PENDING_CONFIRMATION</td>
      <td class="p-2">Transaction created but not yet confirmed</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">CONFIRMED</td>
      <td class="p-2">Transaction confirmed and being processed</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">COMPLETED</td>
      <td class="p-2">Transaction successfully completed</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">CANCELLED</td>
      <td class="p-2">Transaction cancelled</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">FAILED</td>
      <td class="p-2">Transaction failed</td>
    </tr>
  </tbody>
</table>

<h5>Error Handling</h5>
<ul>
  <li>400 Bad Request: Missing transaction reference number</li>
  <li>404 Not Found: Transaction not found</li>
  <li>500 Internal Server Error: System error</li>
</ul>

<h5>Best Practices</h5>
<ul>
  <li>Use this endpoint to check transaction status after confirmation</li>
  <li>Implement polling with reasonable intervals to track transaction progress</li>
  <li>Store transaction details for reconciliation purposes</li>
</ul>
`
        }
      ]
    }
  ],
  customer: [
    {
      id: 'customer',
      name: 'Customer API',
      description: 'Customer management APIs for validation and onboarding',
      endpoints: [
        {
          id: 'validate-customer',
          title: 'Validate Customer',
          method: 'POST',
          path: '/caas/api/v2/customer/validate',
          description: 'Validate customer identity',
          requestHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{access_token}}'
          },
          requestBody: `{
"idNumber": "784199554586091",
"idType": "4"
}`,
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X POST "https://drap-sandbox.digitnine.com/caas/api/v2/customer/validate" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer {{access_token}}" \\
-d '{
  "idNumber": "784199554586091",
  "idType": "4"
}'`
            }
          ],
          responses: [{
          status: 200,
            description: 'Successful validation',
          example: {
              status: 'success',
              message: 'Customer validation successful',
              data: {
                customerExists: true,
                customerId: '784199554586091',
                customerInfo: {
                  firstName: 'John',
                  lastName: 'Doe',
                  nationality: 'AE'
                }
              }
            }
          }],
          guidelines: `
<h5>Validation Rules</h5>
<ul>
  <li>Customer validation is required before creating a transaction</li>
  <li>The API checks if a customer exists in the system based on ID</li>
  <li>If the customer exists, their basic information is returned</li>
  <li>If the customer doesn't exist, they need to be onboarded first</li>
</ul>

<h5>Required Headers</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Content-Type</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">application/json</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Authorization</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Bearer token</td>
    </tr>
  </tbody>
</table>

<h5>Required Parameters</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">idNumber</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Customer ID number</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">idType</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">ID type code (e.g., 4 for Emirates ID)</td>
    </tr>
  </tbody>
</table>

<h5>ID Type Codes</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Code</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">1</td>
      <td class="p-2">Passport</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">2</td>
      <td class="p-2">National ID</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">3</td>
      <td class="p-2">Driving License</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">4</td>
      <td class="p-2">Emirates ID</td>
    </tr>
  </tbody>
</table>

<h5>Error Handling</h5>
<ul>
  <li>400 Bad Request: Invalid input parameters</li>
  <li>404 Not Found: Customer not found</li>
  <li>500 Internal Server Error: System error</li>
</ul>

<h5>Best Practices</h5>
<ul>
  <li>Always validate customer existence before attempting a transaction</li>
  <li>Store the returned customerId for use in transaction creation</li>
  <li>If customer doesn't exist, redirect to the onboarding flow</li>
</ul>
`
        },
        {
          id: 'get-customer',
          title: 'Get Customer',
      method: 'GET',
          path: '/caas/api/v2/customer/{customer_id}',
          description: 'Get customer details by ID',
          requestHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{access_token}}'
          },
          pathParams: [
            {
              name: 'customer_id',
              description: 'The unique customer identifier',
              required: true
            }
          ],
          codeExamples: [
            {
              language: 'curl',
              label: 'cURL',
              code: `curl -X GET "https://drap-sandbox.digitnine.com/caas/api/v2/customer/7841003235214285" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer {{access_token}}"`
            }
          ],
          responses: [{
          status: 200,
            description: 'Successful operation',
          example: {
              status: 'success',
              data: {
                customer_id: '7841003235214285',
                first_name: 'John',
                last_name: 'Doe',
                nationality: 'AE',
                date_of_birth: '1985-06-15',
                gender: 'Male',
                primary_mobile_number: '+971501234567',
                email_id: 'john.doe@example.com',
                status: 'ACTIVE'
              }
            }
          }],
          guidelines: `
<h5>Retrieval Rules</h5>
<ul>
  <li>Customer ID must be valid and exist in the system</li>
  <li>API returns comprehensive customer profile information</li>
  <li>Sensitive information is masked or excluded for security</li>
  <li>Only authorized users can access customer data</li>
</ul>

<h5>Required Headers</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Content-Type</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">application/json</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">Authorization</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Bearer token</td>
    </tr>
  </tbody>
</table>

<h5>Path Parameters</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Name</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">customer_id</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Unique customer identifier</td>
    </tr>
  </tbody>
</table>

<h5>Customer Status Values</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Status</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">ACTIVE</td>
      <td class="p-2">Customer is active and can perform transactions</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">INACTIVE</td>
      <td class="p-2">Customer is inactive and cannot perform transactions</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">BLOCKED</td>
      <td class="p-2">Customer is blocked due to compliance issues</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">PENDING</td>
      <td class="p-2">Customer registration is pending approval</td>
    </tr>
  </tbody>
</table>

<h5>Error Handling</h5>
<ul>
  <li>400 Bad Request: Invalid customer ID format</li>
  <li>404 Not Found: Customer not found</li>
  <li>403 Forbidden: Unauthorized access to customer data</li>
  <li>500 Internal Server Error: System error</li>
</ul>

<h5>Best Practices</h5>
<ul>
  <li>Cache customer data for a short period to improve performance</li>
  <li>Implement proper error handling for customer retrieval failures</li>
  <li>Always verify customer status before initiating transactions</li>
  <li>Respect data privacy regulations when handling customer information</li>
</ul>
`
        },
        {
          id: 'onboard-customer',
          title: 'Onboard Customer',
          method: 'POST',
          path: '/caas-lcm/api/v1/CAAS/onBoarding/customer',
          description: 'Register a new customer in the system',
          requestHeaders: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer {{access_token}}'
          },
          requestBody: `{
"channel": "WEB",
"agent_location_id": "784826",
"first_name": "first name",
"middle_name": "middle name",
"last_name": "last name",
"preferred_name": "preferred name",
"mothers_maiden_name": "mothers maiden name",
"nationality": "IN",
"second_nationality": "GB",
"native_region": 1,
"date_of_birth": "1993-12-21",
"country_of_birth": "IN",
"place_of_birth": "Trikkarippur",
"resident_type_id": 101,
"country_of_residence": "AE",
"gender": "Male",
"primary_mobile_number": "+971502325940",
"secondary_mobile_number": "+971502325941",
"phone_number": "+971524524152",
"email_id": "satheesh.kumar1@gmail.com",
"occupation_id": 223,
"additional_docs": [
  {
    "base64_data": "abc",
    "content_type": "image/jpeg",
    "document_id": "1"
  }
],
"address_list": [
  {
    "address_type_id": "2",
    "building_name": "Permanant Address Building Name",
    "street_name": "Permanant Address Street Name",
    "landmark": "Permanant Address Landmark",
    "city": "Permanant Address City",
    "district": "Permanant Address district",
    "state": "Permanant Address State",
    "country": "IN",
    "zip": 13345,
    "po_box": "5379",
    "mobile_number": "+971524524152"
  },
  {
    "address_type_id": "1",
    "building_name": "Resident Address Building Name",
    "street_name": "Resident Address Street Name",
    "landmark": "Resident Address Landmark",
    "city": "Resident Address City",
    "district": "Resident Address District",
    "state": "Resident Address State",
    "country": "AE",
    "zip": 13345,
    "po_box": "5379",
    "mobile_number": "+971524524152"
  }
],
"id_details": [
  {
    "id_type": 4,
    "id_number": "784199554586091",
    "visa_number": "visa Number",
    "visa_expiry_date": "2022-07-01",
    "name_as_per_id": "Name as per ID",
    "issued_country": "AE",
    "issued_by": "EIDA",
    "issued_at": "Dubai",
    "issued_on": "2022-04-30",
    "date_of_expiry": "2024-04-30",
    "active_status": true,
    "id_front": {
      "base64_data": "abc",
      "content_type": "image/jpeg"
    },
    "id_back": {
      "base64_data": "abc",
      "content_type": "image/jpeg"
    }
  }
],
"customer_classification": {
  "customer_type_id": 2,
  "income_type": 1,
  "annual_income_range_id": 1,
  "annual_income_currency_code": "AED",
  "txn_vol_month": 4,
  "txn_count_month": 2,
  "employer_name": "LULU INTERNATIONAL EXCHANGE UAE",
  "employer_address": "MADINAT ZAYED, ABUDHABI, UAE",
  "employer_phone": "+974561651651",
  "profession_category": "PC1",
  "reason_for_acc": "Account",
  "agent_ref_no": "Partner123xxx",
  "social_links": [
    {
      "social_links_id": 2,
      "text_field": "insta.com"
    },
    {
      "social_links_id": 1,
      "text_field": "fb.com"
    }
  ],
  "first_language": "en",
  "marital_status": 2,
  "profile_photo": {
    "base64_data": "abc",
    "content_type": "image/jpeg"
  }
}
}`,
      codeExamples: [
        {
          language: 'curl',
          label: 'cURL',
              code: `curl -X POST "https://drap-sandbox.digitnine.com/caas-lcm/api/v1/CAAS/onBoarding/customer" \\
-H "Content-Type: application/json" \\
-H "Authorization: Bearer {{access_token}}" \\
-d '{
  "channel": "WEB",
  "agent_location_id": "784826",
  "first_name": "first name",
  "middle_name": "middle name",
  "last_name": "last name",
  "preferred_name": "preferred name",
  "mothers_maiden_name": "mothers maiden name",
  "nationality": "IN",
  "second_nationality": "GB",
  "native_region": 1,
  "date_of_birth": "1993-12-21",
  "country_of_birth": "IN",
  "place_of_birth": "Trikkarippur",
  "resident_type_id": 101,
  "country_of_residence": "AE",
  "gender": "Male",
  "primary_mobile_number": "+971502325940",
  "secondary_mobile_number": "+971502325941",
  "phone_number": "+971524524152",
  "email_id": "satheesh.kumar1@gmail.com",
  "occupation_id": 223,
  "additional_docs": [
    {
      "base64_data": "abc",
      "content_type": "image/jpeg",
      "document_id": "1"
    }
  ],
  "address_list": [
    {
      "address_type_id": "2",
      "building_name": "Permanant Address Building Name",
      "street_name": "Permanant Address Street Name",
      "landmark": "Permanant Address Landmark",
      "city": "Permanant Address City",
      "district": "Permanant Address district",
      "state": "Permanant Address State",
      "country": "IN",
      "zip": 13345,
      "po_box": "5379",
      "mobile_number": "+971524524152"
    },
    {
      "address_type_id": "1",
      "building_name": "Resident Address Building Name",
      "street_name": "Resident Address Street Name",
      "landmark": "Resident Address Landmark",
      "city": "Resident Address City",
      "district": "Resident Address District",
      "state": "Resident Address State",
      "country": "AE",
      "zip": 13345,
      "po_box": "5379",
      "mobile_number": "+971524524152"
    }
  ],
  "id_details": [
    {
      "id_type": 4,
      "id_number": "784199554586091",
      "visa_number": "visa Number",
      "visa_expiry_date": "2022-07-01",
      "name_as_per_id": "Name as per ID",
      "issued_country": "AE",
      "issued_by": "EIDA",
      "issued_at": "Dubai",
      "issued_on": "2022-04-30",
      "date_of_expiry": "2024-04-30",
      "active_status": true,
      "id_front": {
        "base64_data": "abc",
        "content_type": "image/jpeg"
      },
      "id_back": {
        "base64_data": "abc",
        "content_type": "image/jpeg"
      }
    }
  ],
  "customer_classification": {
    "customer_type_id": 2,
    "income_type": 1,
    "annual_income_range_id": 1,
    "annual_income_currency_code": "AED",
    "txn_vol_month": 4,
    "txn_count_month": 2,
    "employer_name": "LULU INTERNATIONAL EXCHANGE UAE",
    "employer_address": "MADINAT ZAYED, ABUDHABI, UAE",
    "employer_phone": "+974561651651",
    "profession_category": "PC1",
    "reason_for_acc": "Account",
    "agent_ref_no": "Partner123xxx",
    "social_links": [
      {
        "social_links_id": 2,
        "text_field": "insta.com"
      },
      {
        "social_links_id": 1,
        "text_field": "fb.com"
      }
    ],
    "first_language": "en",
    "marital_status": 2,
    "profile_photo": {
      "base64_data": "abc",
      "content_type": "image/jpeg"
    }
  }
}'`
            }
          ],
          responses: [{
            status: 200,
            description: 'Customer onboarded successfully',
            example: {
              status: 'success',
              message: 'Customer onboarded successfully',
              data: {
                customer_number: '7841001220007999',
                customer_status: 'ACTIVE'
              }
            }
          }],
          guidelines: `
<h5>Onboarding Rules</h5>
<ul>
  <li>Customer must be at least <strong>18 years old</strong> to be onboarded</li>
  <li>All mandatory fields must be provided (first_name, last_name, nationality, date_of_birth, etc.)</li>
  <li>At least one valid identification document must be provided</li>
  <li>Both permanent and residential addresses are required</li>
  <li>Mobile number must be in international format (e.g., +971501234567)</li>
</ul>

<h5>Document Requirements</h5>
<ul>
  <li>ID documents must be valid (not expired)</li>
  <li>Images must be in JPEG or PNG format</li>
  <li>Maximum file size for each document is 5MB</li>
  <li>Both front and back sides of ID cards are required</li>
  <li>Document images must be clear and legible</li>
</ul>

<h5>Error Handling</h5>
<ul>
  <li>400 Bad Request: Missing required fields or invalid format</li>
  <li>409 Conflict: Customer already exists</li>
  <li>422 Unprocessable Entity: Business validation errors (e.g., underage customer)</li>
  <li>500 Internal Server Error: System error</li>
</ul>

<h5>Best Practices</h5>
<ul>
  <li>Always validate customer data before submission</li>
  <li>Implement proper error handling for onboarding failures</li>
  <li>Store the customer_number securely for future transactions</li>
  <li>Compress images before uploading to improve performance</li>
</ul>
`
        }
      ]
    }
  ]
};

const APIReferencePage = ({ theme }: APIReferencePageProps) => {
  // Remove unused endpointId
  const { } = useParams();
  
  const location = useLocation();
  const navigate = useNavigate();
  
  // Extract the active category from URL path
  const getActiveCategory = () => {
    const path = location.pathname.split('/');
    if (path.length >= 3) {
      return path[2];
    }
    return 'auth';
  };
  
  const [activeTab, setActiveTab] = useState<string>(getActiveCategory());
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMethod, setSelectedMethod] = useState<string | null>(null);
  const [filteredEndpoints, setFilteredEndpoints] = useState<APIEndpoint[]>([]);

  // Update active tab when URL changes
  useEffect(() => {
    setActiveTab(getActiveCategory());
  }, [location.pathname]);
  
  // Update document title when active tab changes
  useEffect(() => {
    const title = activeTab === 'auth' ? 'Authentication' : 
                 activeTab === 'masters' ? 'Codes & Masters' : 
                 activeTab === 'remittance' ? 'Remittance API' : 
                 'Customer API';
    document.title = `${title} | RaaS Developer Portal`;
  }, [activeTab]);
  
  // Filter endpoints based on search and method filter
  useEffect(() => {
    const currentSection = apiSections[activeTab] || [];
    let endpoints = currentSection.flatMap(section => section.endpoints);
    
    // Apply search filter if query exists
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      endpoints = endpoints.filter(endpoint => 
        endpoint.title.toLowerCase().includes(query) ||
        endpoint.path.toLowerCase().includes(query) ||
        endpoint.description?.toLowerCase().includes(query)
      );
    }
    
    // Apply method filter if selected
    if (selectedMethod) {
      endpoints = endpoints.filter(endpoint => 
        endpoint.method === selectedMethod
      );
    }
    
    setFilteredEndpoints(endpoints);
  }, [activeTab, searchQuery, selectedMethod]);
  
  // Handle tab change
  const handleTabChange = (tabId: string) => {
    setActiveTab(tabId);
    navigate(`/api-reference/${tabId}`);
    setSearchQuery('');
    setSelectedMethod(null);
  };
  
  // Clear filters
  const clearFilters = () => {
    setSearchQuery('');
    setSelectedMethod(null);
  };

  const handleTryIt = async (endpoint: APIEndpoint, requestBody: string, headers: Record<string, string>) => {
    try {
      // IMPORTANT: We're using the simple HTTP proxy server with automatic authentication
      // The proxy server must be running with: node simple-http-proxy.cjs
      
      // Create the base URL - use the simple HTTP proxy server URL
      const baseUrl = 'http://localhost:3001/api';
      
      // Construct the full URL for the API call
      let url = `${baseUrl}${endpoint.path}`;
      
      // Log the API call for debugging
      console.log(`Making API call to: ${url}`);
      
      // Prepare headers
      const requestHeaders = new Headers();
      Object.entries(headers).forEach(([key, value]) => {
        // Skip adding the Authorization header - the proxy will handle this
        if (key.toLowerCase() !== 'authorization') {
          requestHeaders.append(key, value);
        }
      });
      
      // Prepare request options
      const options: RequestInit = {
        method: endpoint.method,
        headers: requestHeaders,
        // Set longer timeout
        signal: AbortSignal.timeout(30000) // 30 seconds timeout
      };
      
      // Add request body for non-GET requests
      if (endpoint.method !== 'GET' && requestBody) {
        // For token endpoint, convert JSON to form data
        if (endpoint.path.includes('/auth/realms/cdp/protocol/openid-connect/token')) {
          try {
            const bodyObj = JSON.parse(requestBody);
            const formData = new URLSearchParams();
            Object.entries(bodyObj).forEach(([key, value]) => {
              formData.append(key, value as string);
            });
            options.body = formData;
            requestHeaders.set('Content-Type', 'application/x-www-form-urlencoded');
          } catch (e) {
            // If not valid JSON, use as is
            options.body = requestBody;
          }
        } else {
          // For other endpoints, use JSON
          options.body = requestBody;
          
          // Ensure content type is set
          if (!requestHeaders.has('Content-Type')) {
            requestHeaders.set('Content-Type', 'application/json');
          }
        }
      }
      
      console.log(`Request headers:`, Object.fromEntries(requestHeaders.entries()));
      
      // Make the actual API call
      const response = await fetch(url, options);
      
      // Get the response text
      const responseText = await response.text();
      console.log('API response status:', response.status);
      
      // Try to parse as JSON for pretty formatting
      try {
        const jsonResponse = JSON.parse(responseText);
        return JSON.stringify(jsonResponse, null, 2);
      } catch (e) {
        // Return as text if not JSON
        return responseText;
      }
    } catch (error) {
      console.error('Error making API request:', error);
      return JSON.stringify({
        status: 'error',
        message: 'An error occurred while processing your request',
        error: error instanceof Error ? error.message : 'Unknown error'
      }, null, 2);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
      <ScrollRevealContainer>
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Code className="h-6 w-6 text-white" />
        </div>
            <h1 id="api-reference" className="text-3xl font-bold text-gray-900 dark:text-white">
            {activeTab === 'auth' ? 'Authentication' : 
             activeTab === 'masters' ? 'Codes & Masters' : 
             activeTab === 'remittance' ? 'Remittance API' : 
             'Customer API'}
            </h1>
                  </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {activeTab === 'auth' ? 'Authenticate and manage access to the RaaS API.' : 
             activeTab === 'masters' ? 'Access reference data and system codes.' : 
             activeTab === 'remittance' ? 'Create and manage cross-border money transfers.' : 
             'Manage customer onboarding and information.'}
          </p>
                  </div>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Overview
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            {activeTab === 'auth' && (
              <p>
                The Authentication API provides endpoints for obtaining access tokens required to use the RaaS API.
                Use these endpoints to authenticate your application and get the tokens needed for all other API calls.
              </p>
            )}
            {activeTab === 'masters' && (
              <p>
                The Codes & Masters API provides reference data endpoints for accessing system codes, exchange rates, 
                bank information, and other master data required for remittance operations.
              </p>
            )}
            {activeTab === 'remittance' && (
              <p>
                The Remittance API provides core functionality for creating and managing cross-border money transfers,
                including creating quotes, submitting transactions, and checking transaction status.
              </p>
            )}
            {activeTab === 'customer' && (
              <p>
                The Customer API provides endpoints for customer management, including validation, onboarding,
                and retrieving customer information for remittance operations.
              </p>
            )}
            <p>
              Base URL: <code className="bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded text-sm font-mono">https://drap-sandbox.digitnine.com</code>
            </p>
                </div>
              </div>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <div className="mb-8">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6">
            API Endpoints
          </h2>
          
          {/* API Categories Tabs */}
          <div className="border-b border-gray-200 dark:border-gray-700 mb-6">
            <nav className="flex flex-wrap -mb-px">
              {Object.entries({
                [activeTab]: activeTab === 'auth' ? 'Authentication' : 
                            activeTab === 'masters' ? 'Codes & Masters' : 
                            activeTab === 'remittance' ? 'Remittance API' : 
                            'Customer API'
              }).map(([key, label]) => (
            <button
                  key={key}
                  onClick={() => handleTabChange(key)}
                  className={clsx(
                    'py-4 px-4 text-center border-b-2 font-medium text-sm sm:text-base whitespace-nowrap',
                    'border-primary-500 text-primary-600 dark:border-primary-400 dark:text-primary-400'
                  )}
                >
                  {label}
            </button>
          ))}
            </nav>
        </div>
          
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search endpoints..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
      </div>

            <div className="flex items-center space-x-2">
              <div className="relative inline-block">
            <button
                  className={`px-4 py-2 text-sm font-medium rounded-md inline-flex items-center space-x-2 ${
                    selectedMethod 
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                  onClick={() => setSelectedMethod(selectedMethod === 'GET' ? null : 'GET')}
                >
                  <span>GET</span>
            </button>
              </div>
              
              <div className="relative inline-block">
            <button
                  className={`px-4 py-2 text-sm font-medium rounded-md inline-flex items-center space-x-2 ${
                    selectedMethod === 'POST'
                      ? 'bg-primary-100 text-primary-800 dark:bg-primary-900 dark:text-primary-200' 
                      : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
                  }`}
                  onClick={() => setSelectedMethod(selectedMethod === 'POST' ? null : 'POST')}
                >
                  <span>POST</span>
            </button>
        </div>

              {(searchQuery || selectedMethod) && (
                <button
                  onClick={clearFilters}
                  className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  title="Clear filters"
                >
                  <XCircle className="h-5 w-5" />
            </button>
              )}
                </div>
              </div>

          {/* Active Filters Display */}
          {(searchQuery || selectedMethod) && (
            <div className="mb-6 flex items-center flex-wrap gap-2">
              <span className="text-sm text-gray-500 dark:text-gray-400">Filters:</span>
              
              {searchQuery && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                  Search: "{searchQuery}"
                          </span>
                          )}
              
              {selectedMethod && (
                <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200">
                  Method: {selectedMethod}
                            </span>
              )}
              
                        <button
                onClick={clearFilters}
                className="text-xs text-primary-600 dark:text-primary-400 hover:underline"
                        >
                Clear all
                        </button>
                        </div>
                      )}
          
          {/* API Endpoints */}
          <div>
            {filteredEndpoints.length > 0 ? (
              <div className="space-y-6">
                {filteredEndpoints.map(endpoint => (
                  <ApiEndpointCard
                    key={endpoint.id}
                    method={endpoint.method}
                    path={endpoint.path}
                    title={endpoint.title}
                    description={endpoint.description || ''}
                    requestBody={endpoint.requestBody}
                    requestHeaders={endpoint.requestHeaders}
                    responseBody={endpoint.responseBody}
                    pathParams={endpoint.pathParams}
                    queryParams={endpoint.queryParams}
                    codeExamples={endpoint.codeExamples}
                    guidelines={endpoint.guidelines}
                    theme={theme}
                    onTryIt={(editableBody, editableHeaders) => handleTryIt(endpoint, editableBody, editableHeaders)}
                  />
                    ))}
                  </div>
            ) : (
              <div className="text-center py-12">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-800 mb-4">
                  <Filter className="h-8 w-8 text-gray-400" />
                      </div>
                <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No endpoints found</h3>
                <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                  {searchQuery || selectedMethod 
                    ? "No endpoints match your current filters. Try adjusting or clearing your filters."
                    : "There are no endpoints available in this category."}
                </p>
                {(searchQuery || selectedMethod) && (
                <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium"
                >
                    Clear Filters
                </button>
                    )}
                  </div>
          )}
        </div>
      </div>
      </ScrollRevealContainer>

    </div>
  );
};

export default APIReferencePage; 