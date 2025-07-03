import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FileText, AlertCircle } from 'lucide-react';
import ScrollRevealContainer from '../components/ScrollRevealContainer';

const PlaceholderPage = () => {
  const location = useLocation();
  const path = location.pathname;
  
  // Extract page title from path
  const getPageTitle = () => {
    const segments = path.split('/');
    const lastSegment = segments[segments.length - 1];
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <ScrollRevealContainer>
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              <FileText className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {getPageTitle()}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Documentation for {getPageTitle().toLowerCase()}
          </p>
        </div>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-lg p-6 mb-8">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <AlertCircle className="h-5 w-5 text-amber-500" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Page Under Construction
              </h3>
              <div className="mt-2 text-sm text-amber-700 dark:text-amber-200">
                <p>
                  This page is currently under development. Check back soon for complete documentation on {getPageTitle().toLowerCase()}.
                </p>
              </div>
            </div>
          </div>
        </div>
      </ScrollRevealContainer>

      <ScrollRevealContainer>
        <div className="prose prose-lg dark:prose-invert max-w-none">
          <h2>Coming Soon</h2>
          <p>
            We're working on comprehensive documentation for this section. In the meantime, 
            please refer to our API Reference for implementation details or contact our support team for assistance.
          </p>
          
          <h3>What to expect</h3>
          <ul>
            <li>Detailed guides and tutorials</li>
            <li>Code examples in multiple languages</li>
            <li>Best practices and implementation tips</li>
            <li>Troubleshooting common issues</li>
          </ul>
        </div>
      </ScrollRevealContainer>

      <motion.div 
        className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
      >
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Need help?</h3>
        <p className="text-gray-600 dark:text-gray-300 mb-4">
          Our support team is ready to assist you with any questions about implementing {getPageTitle().toLowerCase()}.
        </p>
        <div className="flex space-x-4">
          <button className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium transition-colors duration-200">
            Contact Support
          </button>
          <button className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium transition-colors duration-200">
            View API Reference
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default PlaceholderPage; 