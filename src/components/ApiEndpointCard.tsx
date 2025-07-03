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
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ApiEndpointCard; 