import { useState, useEffect, useRef } from 'react';
import { ChevronDown, ChevronUp, Play, Copy, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus, oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Theme } from '../types';

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
  }[];
  codeExamples?: {
    language: string;
    label: string;
    code: string;
  }[];
  guidelines?: string;
  errorCodes?: string;
  theme: Theme;
  onTryIt?: (requestBody: string, headers: Record<string, string>) => Promise<string>;
}

const ApiEndpointCard: React.FC<ApiEndpointCardProps> = ({
  method,
  path,
  title,
  description,
  requestBody,
  requestHeaders,
  responseBody,
  pathParams,
  queryParams,
  codeExamples = [],
  guidelines,
  errorCodes,
  theme,
  onTryIt,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [selectedTab, setSelectedTab] = useState('request');
  const [selectedLanguage, setSelectedLanguage] = useState(codeExamples[0]?.language || 'curl');
  const [copied, setCopied] = useState(false);
  const [editableRequestBody, setEditableRequestBody] = useState(requestBody || '');
  const [editableHeaders, setEditableHeaders] = useState<Record<string, string>>({});
  const [tryItResponse, setTryItResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  
  // Initialize editable headers from requestHeaders
  useEffect(() => {
    if (requestHeaders) {
      setEditableHeaders(JSON.parse(JSON.stringify(requestHeaders)));
    }
  }, [requestHeaders]);
  
  // Reset editable request body when requestBody changes
  useEffect(() => {
    setEditableRequestBody(requestBody || '');
  }, [requestBody]);
  
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
  
  const handleTryItClick = async () => {
    if (onTryIt) {
      setIsLoading(true);
      setTryItResponse(null);
      
      try {
        const response = await onTryIt(editableRequestBody, editableHeaders);
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
          <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium border ${getMethodColor()}`}>
            {method}
          </span>
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
                  <button
                    onClick={() => setSelectedTab('guidelines')}
                    className={`px-3 py-2 text-sm font-medium border-b-2 ${
                      selectedTab === 'guidelines'
                        ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                    }`}
                  >
                    Usage Guidelines
                  </button>
                  {(title === 'Create Quote' || title === 'Create Transaction' || title === 'Confirm Transaction' || title === 'Enquire Transaction' || title === 'Cancel Transaction' || title === 'Transaction Receipt' || title === 'Transaction Status Update') && (
                    <button
                      onClick={() => setSelectedTab('errorCodes')}
                      className={`px-3 py-2 text-sm font-medium border-b-2 ${
                        selectedTab === 'errorCodes'
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      Error Codes
                    </button>
                  )}
                  {title === 'Create Transaction' || title === 'Confirm Transaction' ? (
                    <button
                      onClick={() => setSelectedTab('states')}
                      className={`px-3 py-2 text-sm font-medium border-b-2 ${
                        selectedTab === 'states'
                          ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                      }`}
                    >
                      Transaction States
                    </button>
                  ) : null}
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
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4 overflow-x-auto">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="text-left">
                                <th className="font-medium pb-2 pr-4">Name</th>
                                <th className="font-medium pb-2">Value</th>
                              </tr>
                            </thead>
                            <tbody>
                              {Object.entries(requestHeaders).map(([key, value]) => (
                                <tr key={key}>
                                  <td className="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400">{key}</td>
                                  <td className="py-2">
                                    <input
                                      type="text"
                                      value={editableHeaders[key] || value}
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
                    
                    {/* Path Parameters */}
                    {pathParams && pathParams.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Path Parameters</h4>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-4">
                          <table className="min-w-full text-sm">
                            <thead>
                              <tr className="text-left">
                                <th className="font-medium pb-2 pr-4">Name</th>
                                <th className="font-medium pb-2 pr-4">Description</th>
                                <th className="font-medium pb-2">Required</th>
                              </tr>
                            </thead>
                            <tbody>
                              {pathParams.map((param) => (
                                <tr key={param.name}>
                                  <td className="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400">{param.name}</td>
                                  <td className="py-2 pr-4 text-gray-700 dark:text-gray-300">{param.description}</td>
                                  <td className="py-2">{param.required ? 'Yes' : 'No'}</td>
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
                                <th className="font-medium pb-2">Required</th>
                              </tr>
                            </thead>
                            <tbody>
                              {queryParams.map((param) => (
                                <tr key={param.name}>
                                  <td className="py-2 pr-4 font-mono text-blue-600 dark:text-blue-400">{param.name}</td>
                                  <td className="py-2 pr-4 text-gray-700 dark:text-gray-300">{param.description}</td>
                                  <td className="py-2">{param.required ? 'Yes' : 'No'}</td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                    
                    {/* Request Body */}
                    {requestBody && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Request Body</h4>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-md overflow-hidden">
                          <textarea
                            value={editableRequestBody}
                            onChange={(e) => setEditableRequestBody(e.target.value)}
                            rows={10}
                            className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-mono text-sm border-0 focus:ring-0 focus:outline-none"
                          />
                        </div>
                      </div>
                    )}
                    
                    {/* Try It Button */}
                    {onTryIt && (
                      <div className="flex justify-center mt-6">
                        <button
                          onClick={handleTryItClick}
                          disabled={isLoading}
                          className={`inline-flex items-center px-6 py-3 rounded-md text-white font-medium ${
                            isLoading
                              ? 'bg-gray-400 dark:bg-gray-600 cursor-not-allowed'
                              : 'bg-primary-600 hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800'
                          }`}
                        >
                          {isLoading ? (
                            <>
                              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                              </svg>
                              Processing...
                            </>
                          ) : (
                            <>
                              <Play className="h-5 w-5 mr-2" />
                              Try It
                            </>
                          )}
                        </button>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Response Tab */}
                {selectedTab === 'response' && (
                  <div className="space-y-6">
                    {tryItResponse ? (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Response Body</h4>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-md overflow-hidden">
                          <SyntaxHighlighter
                            language="json"
                            style={theme.mode === 'dark' ? vscDarkPlus : oneLight}
                            customStyle={{ margin: 0, padding: '1rem', borderRadius: '0.375rem' }}
                          >
                            {tryItResponse}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    ) : responseBody ? (
                      <div>
                        <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Response Body</h4>
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-md overflow-hidden">
                          <SyntaxHighlighter
                            language="json"
                            style={theme.mode === 'dark' ? vscDarkPlus : oneLight}
                            customStyle={{ margin: 0, padding: '1rem', borderRadius: '0.375rem' }}
                          >
                            {responseBody}
                          </SyntaxHighlighter>
                        </div>
                      </div>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No response example available. Click "Try It" in the Request tab to see a response.</p>
                    )}
                  </div>
                )}
                
                {/* Code Examples Tab */}
                {selectedTab === 'examples' && (
                  <div>
                    {codeExamples.length > 0 ? (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex space-x-2">
                            {codeExamples.map((example) => (
                              <button
                                key={example.language}
                                onClick={() => setSelectedLanguage(example.language)}
                                className={`px-3 py-1 text-sm rounded-md ${
                                  selectedLanguage === example.language
                                    ? 'bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                                }`}
                              >
                                {example.label}
                              </button>
                            ))}
                          </div>
                          
                          <button
                            onClick={copyCode}
                            className="inline-flex items-center px-3 py-1 text-sm text-gray-600 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 rounded-md hover:bg-gray-200 dark:hover:bg-gray-700"
                          >
                            {copied ? (
                              <>
                                <CheckCircle className="h-4 w-4 mr-1" />
                                <span>Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="h-4 w-4 mr-1" />
                                <span>Copy</span>
                              </>
                            )}
                          </button>
                        </div>
                        
                        {currentExample && (
                          <div className="bg-gray-50 dark:bg-gray-900 rounded-md overflow-hidden">
                            <SyntaxHighlighter
                              language={currentExample.language === 'curl' ? 'bash' : currentExample.language}
                              style={theme.mode === 'dark' ? vscDarkPlus : oneLight}
                              customStyle={{ margin: 0, padding: '1rem', borderRadius: '0.375rem' }}
                              wrapLines
                              wrapLongLines
                            >
                              {currentExample.code}
                            </SyntaxHighlighter>
                          </div>
                        )}
                      </>
                    ) : (
                      <p className="text-gray-500 dark:text-gray-400">No code examples available.</p>
                    )}
                  </div>
                )}
                
                {/* Guidelines Tab */}
                {selectedTab === 'guidelines' && (
                  <div className="space-y-6">
                    {guidelines ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-6">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Usage Guidelines</h4>
                          <div dangerouslySetInnerHTML={{ __html: guidelines }} />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-6">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Usage Guidelines</h4>
                        <p className="text-gray-500 dark:text-gray-400">No specific guidelines available for this endpoint.</p>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Error Codes Tab */}
                {selectedTab === 'errorCodes' && (
                  <div className="space-y-6">
                    {errorCodes ? (
                      <div className="prose prose-sm dark:prose-invert max-w-none">
                        <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-6">
                          <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Error Codes</h4>
                          <div dangerouslySetInnerHTML={{ __html: errorCodes }} />
                        </div>
                      </div>
                    ) : (
                      <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-6">
                        <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Error Codes</h4>
                        <div className="overflow-x-auto">
                          <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                            <thead className="bg-gray-100 dark:bg-gray-700">
                              <tr>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                                  API
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                                  HTTP status code
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                                  Error Code
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                                  Message
                                </th>
                                <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                                  Reason
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                              {title === 'Create Transaction' ? (
                                <>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">Create Transaction</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Sender subscription not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Sender subscription not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Sender not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Sender not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076210</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Sender is not acceptable since valid ID not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Sender is not acceptable since valid ID not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076207</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since yet to accepted</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since yet to accepted</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner service corridors not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner service corridors not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner service corridor currencies not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner service corridor currencies not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Bank branch not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Bank branch not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Currency not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Currency not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076205</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Charge's markup/down is not acceptable</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Charge's markup/down is not acceptable</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner allowed address type not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner allowed address type not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076209</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since invalid address type</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since invalid address type</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076211</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since exceeded the credit limit</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since exceeded the credit limit</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076214</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction not acceptable since invalid sender ID information</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction not acceptable since invalid sender ID information</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076201</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Processed transaction for same receiver with same amount</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Processed transaction for same receiver with same amount</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076202</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since reached sender limit</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since reached sender limit</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076203</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction not allowed to send amount to same receiver</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction not allowed to send amount to same receiver</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076206</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since correspondent rate has changed</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since correspondent rate has changed</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076212</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Quote is not acceptable</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Quote is not acceptable</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076101</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Quote not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Quote not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076213</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Quote is not acceptable since expired</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Quote is not acceptable since expired</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">400</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40000</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Mismatch in quote and transaction request</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Mismatch in Quote and transaction CorrespondentId</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">400</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40000</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Mismatch in quote and transaction request</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Mismatch in Quote and transaction CorrLocationId</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076215</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since partner transaction reference number already exists</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since partner transaction reference number already exists</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076208</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since invalid sender information</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since invalid sender information</td>
                                  </tr>
                                </>
                              ) : title === 'Confirm Transaction' ? (
                                <>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">Confirm Transaction</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076306</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since expired</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since expired</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076305</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since already accepted</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since already accepted</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction sender not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction sender not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction receiver not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction receiver not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner ledger account not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner ledger account not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner call back not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner call back not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Correspondent service bank not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Correspondent service bank not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Bank branch not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Bank branch not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Bank not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Bank not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Purpose of the transaction not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Purpose of the transaction not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Correspondent service not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Correspondent service not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Payment mode not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Payment mode not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076302</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since clearance not accepted yet</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since clearance not accepted yet</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076304</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner not authorized to generate transaction receipt</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner not authorized to generate transaction receipt</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076301</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since insufficient balance</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is not acceptable since insufficient balance</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">406</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">8076218</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">The correspondent bank details do not match. Please verify the routing configurations and try again</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">The correspondent bank details do not match. Please verify the routing configurations and try again</td>
                                  </tr>
                                </>
                              ) : title === 'Enquire Transaction' ? (
                                <>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">Enquire Transaction</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction receiver not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction receiver not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction sender not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction sender not found</td>
                                  </tr>
                                </>
                              ) : title === 'Cancel Transaction' ? (
                                <>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">Cancel Transaction</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">400</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40400</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is in EXECUTED state and cannot be cancelled</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is in EXECUTED state and cannot be cancelled</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">400</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40401</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is already cancelled</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Transaction is already cancelled</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">400</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40402</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Cancellation reason is required</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Cancellation reason is required</td>
                                  </tr>
                                </>
                              ) : (
                                <>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">Create Quote</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                    <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner not found</td>
                                    <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner not found</td>
                                  </tr>
                                  <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner service corridor currencies not found</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner service corridor currencies not found</td>
                              </tr>
                              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Bank branch not found</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Bank branch not found</td>
                              </tr>
                              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner service corridors not found</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner service corridors not found</td>
                              </tr>
                              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Bank not found</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Bank not found</td>
                              </tr>
                              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Quote not found</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Quote not found</td>
                              </tr>
                              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Correspondent service bank not found</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Correspondent service bank not found</td>
                              </tr>
                              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Rates not found</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Rates not found</td>
                              </tr>
                              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Currency not found</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Currency not found</td>
                              </tr>
                              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Charges not found</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Charges not found</td>
                              </tr>
                              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Rebate not found</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Rebate not found</td>
                              </tr>
                              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">MTO product not found</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">MTO product not found</td>
                              </tr>
                              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Rate / Charges not found</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Rate / Charges not found</td>
                              </tr>
                              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner quote or payment expiry limit's not found</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Partner quote or payment expiry limit's not found</td>
                              </tr>
                              <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white"></td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">404</td>
                                <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">40004</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Rate / Charges not found</td>
                                <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">Rate / Charges not found</td>
                              </tr>
                                </>
                              )}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                
                {/* Transaction States Tab */}
                {selectedTab === 'states' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 dark:bg-gray-900 rounded-md p-6">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Transaction States and Sub-States</h4>
                      <div className="overflow-x-auto">
                        {title === 'Create Transaction' ? (
                          <>
                            <h5 className="text-md font-medium text-gray-900 dark:text-white mb-2">Create Transaction States</h5>
                            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-6">
                              <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                                    Transaction Activity
                                  </th>
                                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                                    State
                                  </th>
                                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                                    Sub-State
                                  </th>
                                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                                    Description
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                {/* CREATE TXN States */}
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                                    CREATE TXN
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    INITIATED
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    QUOTE_ACCEPTED
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    Quote accepted for the given currency pair
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    INITIATED
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    ORDER_VERIFIED
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    Order verified for the given details
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    ACCEPTED
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    ORDER_ACCEPTED
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    Order accepted for the given verified details
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    REJECTED
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    ORDER_REJECTED
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    Order rejected after verification
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            
                            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                              <strong>Create Transaction Flow:</strong> When you call the Create Transaction API, the transaction starts in INITIATED state. 
                              It progresses through quote acceptance and order verification, ultimately reaching either ACCEPTED or REJECTED state.
                            </p>
                            
                            <h5 className="text-md font-medium text-gray-900 dark:text-white mb-2 mt-6">Complete Transaction Lifecycle</h5>
                            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                              After successful creation and confirmation, the transaction progresses through these states:
                            </p>
                          </>
                        ) : (
                          <>
                            <h5 className="text-md font-medium text-gray-900 dark:text-white mb-2">Confirm Transaction States</h5>
                            <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg mb-6">
                              <thead className="bg-gray-100 dark:bg-gray-700">
                                <tr>
                                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                                    Transaction Activity
                                  </th>
                                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                                    State
                                  </th>
                                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                                    Sub-State
                                  </th>
                                  <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                                    Description
                                  </th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                                {/* Payment Processing States */}
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                                    CONFIRM TXN
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    IN_PROGRESS
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    PAYMENT_PENDING
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    Payment pending for the transaction
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    IN_PROGRESS
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    BALANCE_INSUFFICIENT
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    Insufficient balance in the prefund account
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    IN_PROGRESS
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    PAYMENT_AWAIT_CLEARANCE
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    Awaiting payment clearance
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    IN_PROGRESS
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    PAYMENT_SETTLED
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    Payment settled
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    IN_PROGRESS
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    PAYMENT_REJECTED
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    Payment rejected
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    IN_PROGRESS
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    PAYMENT_APPROVED
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    Payment approved
                                  </td>
                                </tr>
                                
                                {/* AML Processing States */}
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white font-medium">
                                    CONFIRM TXN
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    IN_PROGRESS
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    AML_PENDING
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    Pending for AML
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    IN_PROGRESS
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    AML_COMPLETED
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    AML completed
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    IN_PROGRESS
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    AML_MARKED_FOR_EDD
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    Marked for EDD
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    IN_PROGRESS
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    AML_FAILED
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    AML failed
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    CONFIRM TXN
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    IN_PROGRESS
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    AWAITING_CLEARANCE
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    Awaiting AML clearance
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    IN_PROGRESS
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    CLEARANCE_ACCEPTED
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    Clearance accepted
                                  </td>
                                </tr>
                                
                                {/* Transaction Processing States */}
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    CONFIRM TXN
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    IN_PROGRESS
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    TXN_VERIFIED
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    Transaction verified
                                  </td>
                                </tr>
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    IN_PROGRESS
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    TXN_PREPARED
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    Transaction prepared
                                  </td>
                                </tr>
                                
                                {/* Rejection State */}
                                <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    CONFIRM TXN
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    REJECTED
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                    AML_REJECTED
                                  </td>
                                  <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                    AML rejected
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                            
                            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                              <strong>Confirm Transaction Flow:</strong> When you call the Confirm Transaction API, the transaction goes through payment processing, 
                              AML checks, and transaction verification. It can either progress to EXECUTED state or be rejected.
                            </p>
                            
                            <h5 className="text-md font-medium text-gray-900 dark:text-white mb-2 mt-6">Post-Confirmation States</h5>
                            <p className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                              After successful confirmation, the transaction progresses through these states:
                            </p>
                          </>
                        )}
                        
                        <table className="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg">
                          <thead className="bg-gray-100 dark:bg-gray-700">
                            <tr>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                                Transaction Activity
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                                State
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                                Sub-State
                              </th>
                              <th className="px-4 py-3 text-left text-sm font-medium text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-600">
                                Description
                              </th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-gray-200 dark:divide-gray-600">
                            {/* EXECUTED States */}
                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400 font-medium">
                                EXECUTED
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                EXECUTED
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                TXN_RELEASED
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                Transaction released
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                EXECUTED
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                TXN_TRANSMITTED
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                Transaction transmitted
                              </td>
                            </tr>
                            
                            {/* COMPLETED States */}
                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-4 py-3 text-sm text-green-600 dark:text-green-400 font-medium">
                                CREDITED*
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                COMPLETED
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                CREDITED
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                Transaction credited
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                COMPLETED
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                AVAILABLE_PAID
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                Transaction Available for pickup or Paid
                              </td>
                            </tr>
                            <tr className="hover:bg-gray-50 dark:hover:bg-gray-700">
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                COMPLETED
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                                RECONCILED
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-600 dark:text-gray-300">
                                Transaction reconciled
                              </td>
                            </tr>
                          </tbody>
                        </table>
                        
                        <p className="mt-4 text-sm text-gray-600 dark:text-gray-400">
                          <strong>Note:</strong> States marked in green (EXECUTED, CREDITED*) indicate successful transaction progression. 
                          The transaction lifecycle typically follows: CREATE TXN → CONFIRM TXN → EXECUTED → COMPLETED.
                        </p>
                      </div>
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