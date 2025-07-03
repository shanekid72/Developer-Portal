import { Key, Lock, Terminal } from 'lucide-react';
import ScrollRevealContainer from '../components/ScrollRevealContainer';

const AuthenticationPage = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-8">
      <ScrollRevealContainer>
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Authentication
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Learn how to authenticate with the RaaS API and secure your API requests.
          </p>
        </div>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Authentication Overview
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              The RaaS API uses OAuth 2.0 with JWT tokens for authentication. All API requests must include an
              access token in the Authorization header. Access tokens expire after a set time period and need to be
              refreshed.
            </p>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Obtaining an Access Token
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              To get an access token, you need to make a POST request to the authentication endpoint with your
              credentials. The endpoint returns a JSON object containing the access token and refresh token.
            </p>
            
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 my-4">
              <h3 className="flex items-center text-base font-semibold mb-2">
                <Terminal className="h-5 w-5 mr-2 inline" />
                Request Example
              </h3>
              <pre className="text-sm overflow-x-auto">
                <code>{`POST /auth/realms/cdp/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

username=testagentae&password=******&grant_type=password&client_id=cdp_app&client_secret=******`}</code>
              </pre>
            </div>
            
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 my-4">
              <h3 className="flex items-center text-base font-semibold mb-2">
                <Terminal className="h-5 w-5 mr-2 inline" />
                Response Example
              </h3>
              <pre className="text-sm overflow-x-auto">
                <code>{`{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "expires_in": 300,
  "refresh_expires_in": 1800,
  "refresh_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "bearer",
  "not-before-policy": 0,
  "session_state": "a2fa1d03-36eb-4a75-a142-dc1dd7c1a7a2"
}`}</code>
              </pre>
            </div>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Using the Access Token
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              Include the access token in the Authorization header of all API requests:
            </p>
            
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 my-4">
              <h3 className="flex items-center text-base font-semibold mb-2">
                <Terminal className="h-5 w-5 mr-2 inline" />
                Header Format
              </h3>
              <pre className="text-sm overflow-x-auto">
                <code>{`Authorization: Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...`}</code>
              </pre>
            </div>
            
            <p>
              In addition to the Authorization header, most API endpoints require the following headers:
            </p>
            
            <ul>
              <li><code>Content-Type</code>: application/json</li>
              <li><code>sender</code>: Your agent code (e.g., testagentae)</li>
              <li><code>channel</code>: The channel code (e.g., Direct)</li>
              <li><code>company</code>: Your company ID</li>
              <li><code>branch</code>: Your branch ID</li>
            </ul>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Token Lifecycle
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              Access tokens expire after a short period (typically 5 minutes / 300 seconds). When an access token expires,
              you can use the refresh token to obtain a new access token without requiring the user to re-authenticate.
            </p>
            
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 my-4">
              <h3 className="flex items-center text-base font-semibold mb-2">
                <Terminal className="h-5 w-5 mr-2 inline" />
                Refresh Token Request
              </h3>
              <pre className="text-sm overflow-x-auto">
                <code>{`POST /auth/realms/cdp/protocol/openid-connect/token
Content-Type: application/x-www-form-urlencoded

grant_type=refresh_token&client_id=cdp_app&client_secret=******&refresh_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`}</code>
              </pre>
            </div>
            
            <p>
              The response will contain a new access token and refresh token. Refresh tokens have a longer lifetime
              (typically 30 minutes / 1800 seconds) but also expire eventually. When a refresh token expires, the user
              will need to re-authenticate.
            </p>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Best Practices
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <ul>
              <li>Never expose your client secret or user credentials in client-side code</li>
              <li>Store tokens securely, preferably in memory or secure storage</li>
              <li>Implement token refresh logic to maintain user sessions</li>
              <li>Set up proper error handling for authentication failures</li>
              <li>Use HTTPS for all API requests to ensure data security</li>
            </ul>
          </div>
        </section>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <section className="mb-12">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">
            Error Handling
          </h2>
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p>
              Common authentication errors and their meanings:
            </p>
            
            <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-6 my-4">
              <h3 className="flex items-center text-base font-semibold mb-2">
                <Key className="h-5 w-5 mr-2 inline" />
                Authentication Error Codes
              </h3>
              <table className="min-w-full">
                <thead>
                  <tr>
                    <th className="text-left py-2 px-4 border-b">Status Code</th>
                    <th className="text-left py-2 px-4 border-b">Description</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b">401 Unauthorized</td>
                    <td className="py-2 px-4 border-b">Invalid credentials or token</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">403 Forbidden</td>
                    <td className="py-2 px-4 border-b">Valid token but insufficient permissions</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">429 Too Many Requests</td>
                    <td className="py-2 px-4 border-b">Rate limit exceeded for authentication attempts</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </section>
      </ScrollRevealContainer>
    </div>
  );
};

export default AuthenticationPage; 