import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Play, Copy, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Theme } from '../types';
import DynamicRequestForm from './DynamicRequestForm';

interface ApiEndpointCardProps {
  method: string;
  path: string;
  title: string;
  description: string;
  requestBody?: string;
  requestHeaders?: Record<string, string>;
  responseBody?: string;
  pathParams?: {
    name: string;
    description: string;
    required: boolean;
  }[];
  queryParams?: {
    name: string;
    description: string;
    required: boolean;
    defaultValue?: string;
  }[];
  codeExamples?: {
    language: string;
    label: string;
    code: string;
  }[];
  guidelines?: string;
  errorCodes?: string;
  theme: Theme;
  onTryIt?: (requestBody: string, headers: Record<string, string>, queryParams?: Record<string, string>, pathParams?: Record<string, string>) => Promise<string>;
}

const ApiEndpointCard: React.FC<ApiEndpointCardProps> = ({
  method,
  path,
  title,
  description,
  requestBody,
  requestHeaders,
  pathParams,
  queryParams,
  codeExamples = [],
  guidelines,
  theme,
  onTryIt,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState('request');
  const [selectedLanguage, setSelectedLanguage] = useState(codeExamples[0]?.language || 'curl');
  const [copied, setCopied] = useState(false);
  const [editableRequestBody, setEditableRequestBody] = useState(requestBody || '');
  const [editableHeaders, setEditableHeaders] = useState<Record<string, string>>(() => requestHeaders ? JSON.parse(JSON.stringify(requestHeaders)) : {});
  const [editableQueryParams, setEditableQueryParams] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    console.log('🔍 Debug: Initializing editableQueryParams for:', title);
    console.log('🔍 Debug: queryParams:', queryParams);
    
    if (queryParams && queryParams.length > 0) {
      for (const qp of queryParams) {
        console.log(`🔍 Debug: Processing query param: ${qp.name}`);
        // Special handling for Get Bank Master API - set default country code
        if (title === 'Get Bank Master' && qp.name === 'receiving_country_code') {
          initial[qp.name] = 'PK'; // Default to Pakistan
          console.log(`✅ Set default value for ${qp.name}: PK`);
        } else if (title === 'Get Branch Master' && qp.name === 'receiving_country_code') {
          initial[qp.name] = 'PK'; // Default receiving country code
          console.log(`✅ Set default value for ${qp.name}: PK`);
        } else if (title === 'Get Branch Master' && qp.name === 'bank_id') {
          // bank_id is now a path parameter, not a query parameter
          console.log(`⚠️ bank_id is now a path parameter for Get Branch Master`);
        } else {
          initial[qp.name] = (qp as any).defaultValue ?? '';
          console.log(`📝 Set value for ${qp.name}: ${(qp as any).defaultValue ?? ''}`);
        }
      }
    }
    console.log('🔍 Debug: Final initial editableQueryParams:', initial);
    return initial;
  });
  
  const [editablePathParams, setEditablePathParams] = useState<Record<string, string>>(() => {
    const initial: Record<string, string> = {};
    console.log('🔍 Debug: Initializing editablePathParams for:', title);
    console.log('🔍 Debug: pathParams:', pathParams);
    
    if (pathParams && pathParams.length > 0) {
      for (const pp of pathParams) {
        console.log(`🔍 Debug: Processing path param: ${pp.name}`);
        // Special handling for Get Branch By Id API - set default values
        if (title === 'Get Branch By Id' && pp.name === 'bank_id') {
          initial[pp.name] = '11232'; // Default bank ID
          console.log(`✅ Set default value for ${pp.name}: 11232`);
        } else if (title === 'Get Branch By Id' && pp.name === 'branch_id') {
          initial[pp.name] = '22345'; // Default branch ID (from API docs example)
          console.log(`✅ Set default value for ${pp.name}: 22345`);
        } else if (title === 'Get Branch Master' && pp.name === 'bank_id') {
          initial[pp.name] = '11232'; // Default bank ID (from API docs example)
          console.log(`✅ Set default value for ${pp.name}: 11232`);
        } else {
          initial[pp.name] = (pp as any).defaultValue ?? '';
          console.log(`📝 Set value for ${pp.name}: ${(pp as any).defaultValue ?? ''}`);
        }
      }
    }
    console.log('🔍 Debug: Final initial editablePathParams:', initial);
    return initial;
  });
  const [tryItResponse, setTryItResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [showFullResponse, setShowFullResponse] = useState(false);
  const initialRequestBodyRef = useRef<string>(requestBody || '');

  const [lastManualEditTime, setLastManualEditTime] = useState<number>(0);
  const [hasManualEdit, setHasManualEdit] = useState(false);
  const hasSetDefaultCountryCode = useRef(false);
  
  // Country data for the Get Bank Master API dropdown - only requested countries
  const countries = [
    { code: 'PK', name: 'Pakistan' },
    { code: 'IN', name: 'India' },
    { code: 'BD', name: 'Bangladesh' },
    { code: 'PH', name: 'Philippines' }
  ];
  
  // Reset editable request body only when requestBody prop actually changes from parent
  useEffect(() => {
    if (requestBody !== initialRequestBodyRef.current) {
      console.log('Resetting editableRequestBody from prop:', requestBody);
      setEditableRequestBody(requestBody || '');
      initialRequestBodyRef.current = requestBody || '';
      setHasManualEdit(false);
      setLastManualEditTime(0);
    }
  }, [requestBody]);

  // Ensure query parameters are properly initialized for Get Bank Master API
  useEffect(() => {
    if (title === 'Get Bank Master' && queryParams && queryParams.length > 0 && !hasSetDefaultCountryCode.current) {
      console.log('🔍 Debug: Ensuring query params for Get Bank Master');
      
      // Check if receiving_country_code is missing and set it
      const hasCountryCode = queryParams.some(qp => qp.name === 'receiving_country_code');
      const currentCountryCode = editableQueryParams['receiving_country_code'];
      
      console.log('🔍 Debug: hasCountryCode:', hasCountryCode);
      console.log('🔍 Debug: currentCountryCode:', currentCountryCode);
      console.log('🔍 Debug: editableQueryParams:', editableQueryParams);
      
      if (hasCountryCode && !currentCountryCode) {
        console.log('✅ Setting default receiving_country_code to PK');
        setEditableQueryParams(prev => ({
          ...prev,
          'receiving_country_code': 'PK'
        }));
        hasSetDefaultCountryCode.current = true;
      }
    }
  }, [title, queryParams]);
  
  // Add click outside listener to close expanded panel
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (expanded && cardRef.current && !cardRef.current.contains(event.target as Node)) {
        setExpanded(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [expanded]);
  
  // Determine method badge color
  const getMethodColor = () => {
    switch (method.toUpperCase()) {
      case 'GET':
        return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/30 dark:text-blue-300 dark:border-blue-800';
      case 'POST':
        return 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-300 dark:border-green-800';
      case 'PUT':
        return 'bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-800';
      case 'DELETE':
        return 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-300 dark:border-red-800';
      case 'PATCH':
        return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-800';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-700';
    }
  };

  const copyCode = () => {
    const selectedExample = codeExamples.find(ex => ex.language === selectedLanguage);
    if (selectedExample) {
      navigator.clipboard.writeText(selectedExample.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };
  
  const handleHeaderChange = (key: string, value: string) => {
    setEditableHeaders(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleQueryParamChange = (key: string, value: string) => {
    setEditableQueryParams(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handlePathParamChange = (key: string, value: string) => {
    setEditablePathParams(prev => ({
      ...prev,
      [key]: value
    }));
  };
  
  const handleTryItClick = async () => {
    if (onTryIt) {
      setIsLoading(true);
      setTryItResponse(null);
      
      console.log('🚀 Sending request with body:', {
        editableRequestBody,
        hasAccountTypeCode: editableRequestBody.includes('account_type_code'),
        editableQueryParams,
        queryParamsCount: Object.keys(editableQueryParams).length,
        bankDetailsPresent: editableRequestBody.includes('bank_details'),
        bodyLength: editableRequestBody.length
      });
      
      // Additional debugging for Get Bank Master API
      if (title === 'Get Bank Master') {
        console.log('🔍 Get Bank Master API Debug:');
        console.log('  - Query params object:', editableQueryParams);
        console.log('  - receiving_country_code value:', editableQueryParams['receiving_country_code']);
        console.log('  - Has receiving_country_code:', 'receiving_country_code' in editableQueryParams);
        console.log('  - All query param keys:', Object.keys(editableQueryParams));
      }
      
      // Ensure receiving_country_code is set for Get Bank Master API
      let finalQueryParams = editableQueryParams;
      if (title === 'Get Bank Master' && !editableQueryParams['receiving_country_code']) {
        console.log('⚠️ receiving_country_code is missing, setting default value PK');
        finalQueryParams = { ...editableQueryParams, 'receiving_country_code': 'PK' };
        setEditableQueryParams(finalQueryParams);
      }
      
      // Ensure path parameters are set for Get Branch By Id API
      let finalPathParams = editablePathParams;
      if (title === 'Get Branch By Id' && !editablePathParams['bank_id']) {
        console.log('⚠️ bank_id is missing, setting default value 11232');
        finalPathParams = { ...editablePathParams, 'bank_id': '11232' };
        setEditablePathParams(finalPathParams);
      }
      if (title === 'Get Branch By Id' && !editablePathParams['branch_id']) {
        console.log('⚠️ branch_id is missing, setting default value 22345');
        finalPathParams = { ...editablePathParams, 'branch_id': '22345' };
        setEditablePathParams(finalPathParams);
      }
      
      // Ensure bank_id is set for Get Branch Master API (now a path parameter)
      if (title === 'Get Branch Master' && !editablePathParams['bank_id']) {
        console.log('⚠️ bank_id is missing, setting default value 11232');
        finalPathParams = { ...editablePathParams, 'bank_id': '11232' };
        setEditablePathParams(finalPathParams);
      }
      
      // Ensure receiving_country_code is set for Get Branch Master API
      if (title === 'Get Branch Master' && !editableQueryParams['receiving_country_code']) {
        console.log('⚠️ receiving_country_code is missing, setting default value PK');
        finalQueryParams = { ...editableQueryParams, 'receiving_country_code': 'PK' };
        setEditableQueryParams(finalQueryParams);
      }
      
      try {
        const response = await onTryIt(editableRequestBody, editableHeaders, finalQueryParams, finalPathParams);
        setTryItResponse(response);
        // Automatically switch to the response tab after getting the response
        setSelectedTab('response');
      } catch (error) {
        console.error('Error in Try It:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };
  
  const currentExample = codeExamples.find(ex => ex.language === selectedLanguage) || codeExamples[0];

  return (
    <div 
      ref={cardRef}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-card dark:shadow-card-dark border border-gray-200 dark:border-gray-700 mb-6 transition-all duration-200 hover:shadow-card-hover dark:hover:shadow-card-dark-hover"
    >
      {/* Header - Always visible */}
      <div 
        className="px-4 py-4 sm:px-6 cursor-pointer flex items-center justify-between"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center space-x-3">
          {!title.startsWith('Section:') && (
            <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getMethodColor()}`}>
              {method}
            </span>
          )}
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        
        <div className="flex items-center space-x-4">
          <code className="text-sm font-mono text-gray-500 dark:text-gray-400 hidden sm:block">
            {path}
          </code>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>
      
      {/* Mobile path - Only visible on small screens */}
      <div className="px-4 pb-2 sm:hidden">
        <code className="text-sm font-mono text-gray-500 dark:text-gray-400">
          {path}
        </code>
      </div>
      
      {/* Expandable content */}
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-gray-200 dark:border-gray-700"
          >
            <div className="p-4 sm:p-6">
              {/* Description */}
              {description && (
                <div className="mb-6">
                  <p className="text-gray-600 dark:text-gray-300">{description}</p>
                </div>
              )}
              
              {/* Tab Navigation */}
              <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="flex space-x-4" aria-label="Tabs">
                  <button
                    onClick={() => setSelectedTab('request')}
                    className={`px-3 py-2 text-sm font-medium border-b-2 ${
                      selectedTab === 'request'
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Request
                  </button>
                  <button
                    onClick={() => setSelectedTab('response')}
                    className={`px-3 py-2 text-sm font-medium border-b-2 ${
                      selectedTab === 'response'
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Response
                  </button>
                  <button
                    onClick={() => setSelectedTab('examples')}
                    className={`px-3 py-2 text-sm font-medium border-b-2 ${
                      selectedTab === 'examples'
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Code Examples
                  </button>
                  {guidelines && (
                    <button
                      onClick={() => setSelectedTab('guidelines')}
                      className={`px-3 py-2 text-sm font-medium border-b-2 ${
                        selectedTab === 'guidelines'
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      Guidelines
                    </button>
                  )}
                </nav>
              </div>
              
              {/* Tab Content */}
              <div className="mt-6">
                {/* Request Tab */}
                {selectedTab === 'request' && (
                  <div className="space-y-6">
                    {/* Headers */}
                    {requestHeaders && Object.keys(requestHeaders).length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Headers</h4>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="text-left">
                                <th className="font-medium pb-2 pr-4">Name</th>
                                <th className="font-medium pb-2 pr-4">Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(requestHeaders).map(([key]) => (
                                <tr key={key}>
                                  <td className="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400">{key}</td>
                                  <td className="py-2 pr-4">
                                    <input
                                      type="text"
                                      value={editableHeaders[key] || ''}
                                      onChange={(e) => handleHeaderChange(key, e.target.value)}
                                      className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
                                    />
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    {/* Query Parameters */}
                    {queryParams && queryParams.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Query Parameters</h4>

                        <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="text-left">
                                <th className="font-medium pb-2 pr-4">Name</th>
                                <th className="font-medium pb-2 pr-4">Description</th>
                                <th className="font-medium pb-2 pr-4">Value</th>
                                <th className="font-medium pb-2">Required</th>
                              </tr>
                            </thead>
                            <tbody>
                              {queryParams.map((param) => (
                                <tr key={param.name}>
                                  <td className="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400">{param.name}</td>
                                  <td className="py-2 pr-4 text-gray-700 dark:text-gray-300">{param.description}</td>
                                  <td className="py-2 pr-4">
                                    {/* Special handling for Get Bank Master API */}
                                    {title === 'Get Bank Master' && param.name === 'receiving_country_code' ? (
                                      <select
                                        value={editableQueryParams[param.name] || 'PK'}
                                        onChange={(e) => handleQueryParamChange(param.name, e.target.value)}
                                        className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
                                      >
                                        {countries.map((country) => (
                                          <option key={country.code} value={country.code}>
                                            {country.name} ({country.code})
                                          </option>
                                        ))}
                                      </select>
                                    ) : (
                                      <input
                                        type="text"
                                        value={editableQueryParams[param.name] || ''}
                                        onChange={(e) => handleQueryParamChange(param.name, e.target.value)}
                                        className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
                                        placeholder={param.required ? 'Required' : 'Optional'}
                                      />
                                    )}
                                  </td>
                                  <td className="py-2">{param.required ? 'Yes' : 'No'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    {/* Path Parameters */}
                    {pathParams && pathParams.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Path Parameters</h4>
                        {title === 'Get Branch By Id' && (
                          <div className="mb-3 p-3 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-md">
                            <p className="text-sm text-blue-800 dark:text-blue-200">
                              <strong>Note:</strong> Both bank_id and branch_id are required. First use "Get Branch Master" API to get valid branch IDs for a specific bank.
                            </p>
                          </div>
                        )}
                        {title === 'Get Branch Master' && (
                          <div className="mb-3 p-3 bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 rounded-md">
                            <p className="text-sm text-green-800 dark:text-green-200">
                              <strong>Fixed:</strong> bank_id is now correctly implemented as a path parameter. Use bank IDs from "Get Bank Master" response.
                            </p>
                          </div>
                        )}
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="text-left">
                                <th className="font-medium pb-2 pr-4">Name</th>
                                <th className="font-medium pb-2 pr-4">Description</th>
                                <th className="font-medium pb-2 pr-4">Value</th>
                                <th className="font-medium pb-2">Required</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pathParams.map((param) => (
                                <tr key={param.name}>
                                  <td className="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400">{param.name}</td>
                                  <td className="py-2 pr-4 text-gray-700 dark:text-gray-300">{param.description}</td>
                                  <td className="py-2 pr-4">
                                    {title === 'Get Branch Master' && param.name === 'bank_id' ? (
                                      <input
                                        type="text"
                                        value={editablePathParams[param.name] || '11232'}
                                        onChange={(e) => handlePathParamChange(param.name, e.target.value)}
                                        className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
                                        placeholder="Enter bank ID (e.g., 11232)"
                                      />
                                    ) : (
                                      <input
                                        type="text"
                                        value={editablePathParams[param.name] || ''}
                                        onChange={(e) => handlePathParamChange(param.name, e.target.value)}
                                        className="w-full px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 font-mono text-sm"
                                        placeholder={param.required ? 'Required' : 'Optional'}
                                      />
                                    )}
                                  </td>
                                  <td className="py-2">{param.required ? 'Yes' : 'No'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    {/* Dynamic Request Form - Only show for relevant endpoints */}
                    {(['Create Quote', 'Create Transaction'].includes(title) && !['Get Access Token', 'Authentication'].includes(title)) && (
                      <div className="mb-4">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          Dynamic Request Form (Country/Mode Specific)
                        </h4>
                        <DynamicRequestForm
                          endpointTitle={title}
                          currentRequestBody={requestBody || ''}
                          onRequestBodyChange={(newBody) => {
                            // Smart auto-apply logic
                            const now = Date.now();
                            const gracePeriod = 5000; // 5 seconds grace period
                            const canAutoApply = !hasManualEdit || (now - lastManualEditTime) > gracePeriod;
                            
                            console.log('🔍 Dynamic form update:', {
                              newBody,
                              hasManualEdit,
                              lastManualEditTime,
                              canAutoApply,
                              currentEditableBody: editableRequestBody
                            });
                            
                            if (canAutoApply) {
                              // Auto-apply if no manual edits or grace period has passed
                              console.log('✅ Auto-applying dynamic form changes');
                              setEditableRequestBody(newBody);
                              setHasManualEdit(false);
                            } else {
                              console.log('⏸️ Skipping auto-apply due to manual edits');
                            }

                          }}
                        />
                      </div>
                    )}
                    
                    {/* Request Body - Show for all POST/PUT endpoints */}
                    {(method === 'POST' || method === 'PUT') && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">
                          {(['Create Quote', 'Create Transaction'].includes(title) && !['Get Access Token', 'Authentication'].includes(title)) 
                            ? 'Manual JSON Editor (Override Dynamic Form)' 
                            : 'Request Body'
                          } {!requestBody && <span className="text-xs text-gray-500 dark:text-gray-400">(Optional)</span>}
                        </h4>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-md overflow-hidden">
                          <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                            <span className="text-xs text-gray-600 dark:text-gray-400">
                              {requestBody ? 'Editable JSON Request Body' : 'Add JSON Request Body'}
                            </span>
                            <div className="flex items-center gap-2">
                              {requestBody && (
                                <button
                                  onClick={() => setEditableRequestBody(requestBody || '')}
                                  className="px-2 py-1 text-xs rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                  title="Reset to Default"
                                >
                                  Reset to Default
                                </button>
                              )}
                              {!requestBody && (
                                <button
                                  onClick={() => setEditableRequestBody('{\n  \n}')}
                                  className="px-2 py-1 text-xs rounded-md bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600"
                                  title="Add Empty JSON Object"
                                >
                                  Add JSON
                                </button>
                              )}
                            </div>
                          </div>
                          {title === 'Access Token API (API 1)' ? (
                            <div className="space-y-2">
                              <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                <strong>Note:</strong> This endpoint requires form-encoded data, not JSON. The form below will automatically convert to the correct format.
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4">
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Username
                                  </label>
                                  <input
                                    type="text"
                                    value={editableRequestBody.includes('"username"') ? JSON.parse(editableRequestBody).username || '' : ''}
                                    onChange={(e) => {
                                      try {
                                        const bodyObj = JSON.parse(editableRequestBody);
                                        bodyObj.username = e.target.value;
                                        setEditableRequestBody(JSON.stringify(bodyObj, null, 2));
                                      } catch (error) {
                                        // If parsing fails, create new object
                                        setEditableRequestBody(JSON.stringify({ username: e.target.value }, null, 2));
                                      }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                                    placeholder="Enter username"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Password
                                  </label>
                                  <input
                                    type="password"
                                    value={editableRequestBody.includes('"password"') ? JSON.parse(editableRequestBody).password || '' : ''}
                                    onChange={(e) => {
                                      try {
                                        const bodyObj = JSON.parse(editableRequestBody);
                                        bodyObj.password = e.target.value;
                                        setEditableRequestBody(JSON.stringify(bodyObj, null, 2));
                                      } catch (error) {
                                        // If parsing fails, create new object
                                        setEditableRequestBody(JSON.stringify({ password: e.target.value }, null, 2));
                                      }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                                    placeholder="Enter password"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Grant Type
                                  </label>
                                  <input
                                    type="text"
                                    value={editableRequestBody.includes('"grant_type"') ? JSON.parse(editableRequestBody).grant_type || '' : 'password'}
                                    onChange={(e) => {
                                      try {
                                        const bodyObj = JSON.parse(editableRequestBody);
                                        bodyObj.grant_type = e.target.value;
                                        setEditableRequestBody(JSON.stringify(bodyObj, null, 2));
                                      } catch (error) {
                                        // If parsing fails, create new object
                                        setEditableRequestBody(JSON.stringify({ grant_type: e.target.value }, null, 2));
                                      }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                                    placeholder="password"
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Client ID
                                  </label>
                                  <input
                                    type="text"
                                    value={editableRequestBody.includes('"client_id"') ? JSON.parse(editableRequestBody).client_id || '' : ''}
                                    onChange={(e) => {
                                      try {
                                        const bodyObj = JSON.parse(editableRequestBody);
                                        bodyObj.client_id = e.target.value;
                                        setEditableRequestBody(JSON.stringify(bodyObj, null, 2));
                                      } catch (error) {
                                        // If parsing fails, create new object
                                        setEditableRequestBody(JSON.stringify({ client_id: e.target.value }, null, 2));
                                      }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                                    placeholder="Enter client ID"
                                  />
                                </div>
                                <div className="md:col-span-2">
                                  <label className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Client Secret
                                  </label>
                                  <input
                                    type="password"
                                    value={editableRequestBody.includes('"client_secret"') ? JSON.parse(editableRequestBody).client_secret || '' : ''}
                                    onChange={(e) => {
                                      try {
                                        const bodyObj = JSON.parse(editableRequestBody);
                                        bodyObj.client_secret = e.target.value;
                                        setEditableRequestBody(JSON.stringify(bodyObj, null, 2));
                                      } catch (error) {
                                        // If parsing fails, create new object
                                        setEditableRequestBody(JSON.stringify({ client_secret: e.target.value }, null, 2));
                                      }
                                    }}
                                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 text-sm"
                                    placeholder="Enter client secret"
                                  />
                                </div>
                              </div>
                            </div>
                          ) : (
                            <textarea
                              value={editableRequestBody}
                              onChange={(e) => {
                                setEditableRequestBody(e.target.value);
                                setHasManualEdit(true);
                                setLastManualEditTime(Date.now());
                              }}
                              className="w-full h-64 p-4 font-mono text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 border-0 focus:ring-0 resize-none"
                              placeholder="Enter JSON request body..."
                            />
                          )}
                        </div>
                      </div>
                    )}
                    
                    {/* Try It Button */}
                    <div className="flex justify-center">
                      <button
                        onClick={handleTryItClick}
                        disabled={isLoading}
                        className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                      >
                        {isLoading ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                            Testing...
                          </>
                        ) : (
                          <>
                            <Play className="h-5 w-5 mr-2" />
                            Try It
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                )}
                
                {/* Response Tab */}
                {selectedTab === 'response' && (
                  <div>
                    {tryItResponse ? (
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-md overflow-hidden">
                        <div className="flex items-center justify-between px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                          <span className="text-xs text-gray-600 dark:text-gray-400">API Response</span>
                          <button
                            onClick={() => setShowFullResponse(!showFullResponse)}
                            className="text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300"
                          >
                            {showFullResponse ? 'Show Less' : 'Show Full Response'}
                          </button>
                        </div>
                        <div className="p-4">
                          <SyntaxHighlighter
                            language="json"
                            style={theme.mode === 'dark' ? vscDarkPlus : oneLight}
                            customStyle={{
                              margin: 0,
                              fontSize: '0.875rem',
                              lineHeight: '1.25rem',
                              maxHeight: showFullResponse ? 'none' : '400px',
                              overflow: showFullResponse ? 'visible' : 'auto'
                            }}
                          >
                            {tryItResponse}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                          Click "Try It" to test the API and see the response here.
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Code Examples Tab */}
                {selectedTab === 'examples' && (
                  <div>
                    {codeExamples.length > 0 ? (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm font-medium text-gray-900 dark:text-white">Code Examples</h4>
                          <div className="flex items-center space-x-2">
                            <select
                              value={selectedLanguage}
                              onChange={(e) => setSelectedLanguage(e.target.value)}
                              className="px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                            >
                              {codeExamples.map((example) => (
                                <option key={example.language} value={example.language}>
                                  {example.label}
                                </option>
                              ))}
                            </select>
                            <button
                              onClick={copyCode}
                              className="inline-flex items-center px-3 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            >
                              {copied ? (
                                <>
                                  <CheckCircle className="h-4 w-4 mr-1 text-green-600" />
                                  Copied!
                                </>
                              ) : (
                                <>
                                  <Copy className="h-4 w-4 mr-1" />
                                  Copy
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-md overflow-hidden">
                          <SyntaxHighlighter
                            language={selectedLanguage}
                            style={theme.mode === 'dark' ? vscDarkPlus : oneLight}
                            customStyle={{
                              margin: 0,
                              fontSize: '0.875rem',
                              lineHeight: '1.25rem'
                            }}
                          >
                            {currentExample?.code || ''}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8">
                        <p className="text-gray-500 dark:text-gray-400">
                          No code examples available for this endpoint.
                        </p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Guidelines Tab */}
                {selectedTab === 'guidelines' && guidelines && (
                  <div>
                    <div className="prose prose-sm dark:prose-invert max-w-none">
                      <div dangerouslySetInnerHTML={{ __html: guidelines }} />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApiEndpointCard; 