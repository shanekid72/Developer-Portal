import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import ApiEndpointCard from './ApiEndpointCard';
import { Theme } from '../types';

interface CollapsibleSectionProps {
  title: string;
  description: string;
  theme: Theme;
  endpoints: any[];
  onTryIt?: (endpoint: any, requestBody: string, headers: Record<string, string>, queryParams?: Record<string, string>) => Promise<string>;
}

const CollapsibleSection: React.FC<CollapsibleSectionProps> = ({
  title,
  description,
  theme,
  endpoints,
  onTryIt
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-card dark:shadow-card-dark border border-gray-200 dark:border-gray-700 mb-6">
      {/* Section Header */}
      <div 
        className="px-4 py-4 sm:px-6 cursor-pointer flex items-center justify-between hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center space-x-3">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h3>
        </div>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-500 dark:text-gray-400 hidden sm:block">{description}</span>
          {isExpanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>
      
      {/* Collapsible Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="overflow-hidden"
          >
            <div className="px-4 pb-4 sm:px-6 border-t border-gray-200 dark:border-gray-700">
              <div className="pt-4 space-y-6">
                {endpoints.map(endpoint => (
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
                    errorCodes={endpoint.errorCodes}
                    theme={theme}
                                            onTryIt={(requestBody, headers, queryParams) => 
                          onTryIt ? onTryIt(endpoint, requestBody, headers, queryParams) : Promise.resolve('')
                        }
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CollapsibleSection; 