// Guidelines for the Get Service Corridor endpoint
export const getServiceCorridorGuidelines = `
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
      <td class="p-2 font-medium">company</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Company code (provided)</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">branch</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
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
  <li>Cache the service corridor data to reduce API calls</li>
  <li>Use this data to populate country/currency selection dropdowns in your UI</li>
  <li>Validate user selections against available corridors before proceeding with transactions</li>
</ul>
`;

// Guidelines for the Get Rates endpoint
export const getRatesGuidelines = `
<h5>Exchange Rate Rules</h5>
<ul>
  <li>This endpoint returns current exchange rates for all available currency pairs</li>
  <li>Rates are updated periodically throughout the day</li>
  <li>The effective_date indicates when the rate was last updated</li>
  <li>Rates may vary based on transaction amount and other factors</li>
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
      <td class="p-2 font-medium">company</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Company code (provided)</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">branch</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
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

<h5>Rate Information</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Field</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">from_currency_code</td>
      <td class="p-2">Source currency (e.g., AED)</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">to_currency_code</td>
      <td class="p-2">Target currency (e.g., INR)</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">rate</td>
      <td class="p-2">Exchange rate value</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">effective_date</td>
      <td class="p-2">When the rate was last updated</td>
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
  <li>Cache rates for short periods (e.g., 5-15 minutes) to reduce API calls</li>
  <li>Display the effective_date to users so they know when the rate was last updated</li>
  <li>Always use the Create Quote API to get the final rate for a transaction</li>
</ul>
`;

// Guidelines for the Master Banks endpoint
export const getBanksGuidelines = `
<h5>Bank Listing Rules</h5>
<ul>
  <li>This endpoint returns a list of banks available for the specified country and receiving mode</li>
  <li>Results are filtered based on the query parameters</li>
  <li>The list may be paginated if there are many results</li>
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

<h5>Required Query Parameters</h5>
<table class="w-full text-sm">
  <thead>
    <tr class="text-left bg-gray-100 dark:bg-gray-800">
      <th class="p-2">Parameter</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">receiving_country_code</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">ISO country code (e.g., PK)</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">receiving_mode</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">BANK, CASHPICKUP, etc.</td>
    </tr>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">correspondent</td>
      <td class="p-2">String</td>
      <td class="p-2">No</td>
      <td class="p-2">Filter by correspondent code</td>
    </tr>
  </tbody>
</table>

<h5>Error Handling</h5>
<ul>
  <li>400 Bad Request: Missing required parameters</li>
  <li>401 Unauthorized: Invalid or expired token</li>
  <li>404 Not Found: No banks found for the given parameters</li>
  <li>500 Internal Server Error: System error</li>
</ul>

<h5>Best Practices</h5>
<ul>
  <li>Cache bank lists for each country/mode combination</li>
  <li>Implement type-ahead search in your UI for better user experience</li>
  <li>Store bank IDs for use in transaction creation</li>
</ul>
`;

// Guidelines for the Master Banks - ID endpoint
export const getBankByIdGuidelines = `
<h5>Bank Details Rules</h5>
<ul>
  <li>This endpoint returns detailed information about a specific bank</li>
  <li>The bank ID must be valid and obtained from the Master Banks endpoint</li>
  <li>Branch information is included when available</li>
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
      <th class="p-2">Parameter</th>
      <th class="p-2">Data Type</th>
      <th class="p-2">Mandatory</th>
      <th class="p-2">Description</th>
    </tr>
  </thead>
  <tbody>
    <tr class="border-b border-gray-200 dark:border-gray-700">
      <td class="p-2 font-medium">bank_id</td>
      <td class="p-2">String</td>
      <td class="p-2">Yes</td>
      <td class="p-2">Unique bank identifier</td>
    </tr>
  </tbody>
</table>

<h5>Error Handling</h5>
<ul>
  <li>400 Bad Request: Invalid bank ID format</li>
  <li>401 Unauthorized: Invalid or expired token</li>
  <li>404 Not Found: Bank not found</li>
  <li>500 Internal Server Error: System error</li>
</ul>

<h5>Best Practices</h5>
<ul>
  <li>Cache bank details to reduce API calls</li>
  <li>Use this endpoint to show detailed bank information in your UI</li>
  <li>Display branch information when available to help users select the correct branch</li>
</ul>
`; 