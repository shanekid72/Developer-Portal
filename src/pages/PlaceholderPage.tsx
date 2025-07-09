import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Terminal, Code, CheckCircle, ArrowRight, ExternalLink, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import ScrollRevealContainer from '../components/ScrollRevealContainer';
import CodeBlock from '../components/CodeBlock';
import { useEffect, useState, useRef } from 'react';
import { Link } from 'react-router-dom';

const PlaceholderPage = () => {
  const location = useLocation();
  const path = location.pathname;
  const [theme, setTheme] = useState({ mode: 'light' });
  const [activeSection, setActiveSection] = useState<number | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [hoveredResource, setHoveredResource] = useState<number | null>(null);
  const sectionRefs = useRef<(HTMLDivElement | null)[]>([]);
  
  // Extract page title from path
  const getPageTitle = () => {
    const segments = path.split('/');
    const lastSegment = segments[segments.length - 1];
    return lastSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  // Check if this is the Quick Start Guide page
  const isQuickStartGuide = path === '/quick-start';

  // Get theme from localStorage
  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme({ mode: initialTheme });
  }, []);
  
  // Intersection observer for sections
  useEffect(() => {
    if (!isQuickStartGuide) return;
    
    const observerOptions = {
      root: null,
      rootMargin: '0px',
      threshold: 0.5,
    };
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = Number(entry.target.getAttribute('data-section-index'));
          if (!isNaN(index)) {
            setActiveSection(index);
          }
        }
      });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    sectionRefs.current.forEach(ref => {
      if (ref) observer.observe(ref);
    });
    
    return () => {
      observer.disconnect();
    };
  }, [isQuickStartGuide]);

  return (
    <div className="max-w-5xl mx-auto px-6 py-12">
      <ScrollRevealContainer>
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center">
              {isQuickStartGuide ? (
                <Terminal className="h-6 w-6 text-white" />
              ) : (
                <FileText className="h-6 w-6 text-white" />
              )}
            </div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {getPageTitle()}
            </h1>
          </div>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            {isQuickStartGuide 
              ? 'Learn how to use the RaaS Developer Portal'
              : `Documentation for ${getPageTitle().toLowerCase()}`}
          </p>
        </div>
      </ScrollRevealContainer>

      {isQuickStartGuide ? (
        <>
          <ScrollRevealContainer>
            <div className="prose prose-lg dark:prose-invert max-w-none mb-10">
              <p>
                Welcome to the RaaS (Remittance as a Service) Developer Portal! This guide will help you navigate 
                through the portal's features and resources to make the most of our API documentation.
              </p>
            </div>
          </ScrollRevealContainer>

          <div 
            ref={el => sectionRefs.current[0] = el} 
            data-section-index="0"
            className="mb-12"
          >
            <motion.h2 
              className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span 
                className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 mr-3 text-sm font-bold"
                animate={{ 
                  scale: activeSection === 0 ? [1, 1.2, 1] : 1,
                  backgroundColor: activeSection === 0 ? ['#dbeafe', '#93c5fd', '#dbeafe'] : '#dbeafe'
                }}
                transition={{ duration: 1, repeat: activeSection === 0 ? Infinity : 0, repeatDelay: 2 }}
              >
                1
              </motion.span>
              Getting Started with the Portal
            </motion.h2>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6 overflow-hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Accessing the Developer Portal</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                The RaaS Developer Portal provides comprehensive documentation and tools to help you integrate with our API:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mt-6">
                {[
                  {
                    title: "Browse Documentation",
                    description: "Explore our detailed API documentation, including authentication guides, endpoint references, and best practices."
                  },
                  {
                    title: "Test API Endpoints",
                    description: "Use our interactive sandbox to test API calls directly from your browser without writing any code."
                  },
                  {
                    title: "View Code Examples",
                    description: "Copy ready-to-use code snippets in multiple programming languages (JavaScript, Python, Java, C#, PHP)."
                  },
                  {
                    title: "Download Resources",
                    description: "Access API specifications, SDKs, and other resources to accelerate your integration process."
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={`feature-${index}`}
                    className="bg-gray-50 dark:bg-gray-900 p-5 rounded-lg border border-gray-200 dark:border-gray-700 cursor-pointer"
                    whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)" }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.3 + (index * 0.1) }}
                    onClick={() => setExpandedCard(expandedCard === index ? null : index)}
                  >
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-2 flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-6 h-6 rounded-full bg-primary-100 dark:bg-primary-800 text-primary-600 dark:text-primary-400 flex items-center justify-center mr-2 text-xs font-bold">
                          {index + 1}
                        </span>
                        {item.title}
                      </div>
                      {expandedCard === index ? 
                        <ChevronUp className="h-4 w-4 text-gray-500" /> : 
                        <ChevronDown className="h-4 w-4 text-gray-500" />
                      }
                    </h4>
                    <AnimatePresence>
                      {(expandedCard === index || expandedCard === null) && (
                        <motion.div
                          initial={expandedCard !== null ? { opacity: 0, height: 0 } : false}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <p className="text-sm text-gray-600 dark:text-gray-300">
                            {item.description}
                          </p>
                          {expandedCard === index && (
                            <motion.div 
                              className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              <p className="text-xs text-primary-600 dark:text-primary-400">
                                Click to learn more about this feature in the relevant documentation section.
                              </p>
                            </motion.div>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-md"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 0.5, delay: 1.2, repeat: 1 }}
                    >
                      <CheckCircle className="h-5 w-5 text-blue-500" />
                    </motion.div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-blue-800 dark:text-blue-300">
                      <strong>Pro Tip:</strong> Bookmark the Developer Portal for quick access to our documentation and tools during your integration journey.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <ScrollRevealContainer>
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 mr-3 text-sm font-bold">2</span>
                Navigating the Portal
              </h2>
              
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Key Sections</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <ArrowRight className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white">Introduction</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Overview of the RaaS platform, key features, and integration process.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <ArrowRight className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white">Authentication</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Detailed guide on how to authenticate with the RaaS API, including token management.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <ArrowRight className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white">API Reference</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Complete documentation for all API endpoints, including parameters, responses, and examples.
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <ArrowRight className="h-5 w-5 text-primary-600 dark:text-primary-400" />
                    </div>
                    <div className="ml-3">
                      <h4 className="text-md font-medium text-gray-900 dark:text-white">Sandbox Testing</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300">
                        Interactive environment to test API calls directly from the portal.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollRevealContainer>

          <div 
            ref={el => sectionRefs.current[2] = el} 
            data-section-index="2"
            className="mb-12"
          >
            <motion.h2 
              className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.span 
                className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 mr-3 text-sm font-bold"
                animate={{ 
                  scale: activeSection === 2 ? [1, 1.2, 1] : 1,
                  backgroundColor: activeSection === 2 ? ['#dcfce7', '#86efac', '#dcfce7'] : '#dcfce7'
                }}
                transition={{ duration: 1, repeat: activeSection === 2 ? Infinity : 0, repeatDelay: 2 }}
              >
                3
              </motion.span>
              Testing the API in Your Browser
            </motion.h2>
            
            <motion.div 
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Interactive API Testing</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4">
                Our interactive Sandbox Testing page allows you to try out API calls directly in your browser without writing any code:
              </p>
              
              <div className="relative">
                <motion.div
                  className="absolute left-4 top-0 bottom-0 w-0.5 bg-green-200 dark:bg-green-800"
                  initial={{ height: 0 }}
                  animate={{ height: '100%' }}
                  transition={{ duration: 1.5 }}
                />
                
                <ol className="space-y-4 text-gray-600 dark:text-gray-300 list-none ml-8">
                  {[
                    { text: "Navigate to the Sandbox Testing page from the sidebar menu" },
                    { text: "Select an endpoint from the available options (e.g., Get Codes, Create Quote)" },
                    { text: "Fill in the required parameters in the form fields with sample data" },
                    { text: "Click \"Send Request\" to execute the API call" },
                    { text: "View the response in the results panel to understand the data structure" }
                  ].map((step, index) => (
                    <motion.li 
                      key={`step-${index}`}
                      className="relative pl-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: 0.5 + (index * 0.15) }}
                    >
                      <motion.div 
                        className="absolute -left-8 mt-1.5 w-4 h-4 rounded-full bg-green-500 dark:bg-green-400 flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2, delay: 0.5 + (index * 0.15) }}
                        whileHover={{ scale: 1.3, backgroundColor: '#10b981' }}
                      >
                        <span className="text-white text-xs font-bold">{index + 1}</span>
                      </motion.div>
                      <motion.div
                        whileHover={{ x: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                      >
                        {step.text}
                      </motion.div>
                    </motion.li>
                  ))}
                </ol>
              </div>
              
              <motion.div 
                className="mt-8 p-5 bg-gray-50 dark:bg-gray-900 rounded-lg border border-gray-200 dark:border-gray-700"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.5 }}
                whileHover={{ 
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  y: -5
                }}
              >
                <div className="flex flex-col sm:flex-row items-start sm:items-center">
                  <div className="flex-shrink-0 mb-4 sm:mb-0 sm:mr-4">
                    <motion.div
                      className="w-16 h-16 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center"
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 0.95, 1]
                      }}
                      transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
                    >
                      <Terminal className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </motion.div>
                  </div>
                  <div>
                    <h4 className="text-md font-medium text-gray-900 dark:text-white mb-1">Try It Now</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                      Experience our interactive API sandbox to see how easy it is to test endpoints.
                    </p>
                    <motion.button
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Code className="mr-2 h-4 w-4" />
                      Open Sandbox
                    </motion.button>
                  </div>
                </div>
              </motion.div>
              
              <motion.div 
                className="mt-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-md"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 1.8 }}
                whileHover={{ scale: 1.02 }}
              >
                <div className="flex">
                  <div className="flex-shrink-0">
                    <motion.div
                      animate={{ rotate: [0, 15, -15, 0] }}
                      transition={{ duration: 0.5, delay: 2, repeat: 1 }}
                    >
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    </motion.div>
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-green-800 dark:text-green-300">
                      <strong>Partner Benefit:</strong> The sandbox environment lets you experiment with different parameters and see 
                      exactly how the API behaves before writing any code. This helps you understand the data flow and plan your integration more effectively.
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          <ScrollRevealContainer>
            <div className="mb-12">
              <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-6 flex items-center">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-primary-100 dark:bg-primary-900 text-primary-600 dark:text-primary-400 mr-3 text-sm font-bold">4</span>
                Exploring API Documentation
              </h2>
              
              <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Understanding API Reference Pages</h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  Each API endpoint in the documentation includes:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Endpoint Information</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
                      <li>HTTP method and URL</li>
                      <li>Description and purpose</li>
                      <li>Required headers</li>
                      <li>Authentication requirements</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Request Details</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
                      <li>Required and optional parameters</li>
                      <li>Parameter data types</li>
                      <li>Validation rules</li>
                      <li>Example request bodies</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Response Information</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
                      <li>Success response format</li>
                      <li>Error response scenarios</li>
                      <li>Status codes and meanings</li>
                      <li>Example responses</li>
                    </ul>
                  </div>
                  
                  <div className="bg-gray-50 dark:bg-gray-900 p-4 rounded-md">
                    <h4 className="text-sm font-medium text-gray-900 dark:text-white mb-2">Code Examples</h4>
                    <ul className="text-sm text-gray-600 dark:text-gray-300 list-disc list-inside space-y-1">
                      <li>Implementation in multiple languages</li>
                      <li>JavaScript, Python, Java, C#, PHP</li>
                      <li>Copy-paste ready code snippets</li>
                      <li>Best practices for implementation</li>
                    </ul>
                  </div>
                </div>
                
                <div className="flex justify-center mt-6">
                  <Link to="/api-reference/auth" className="inline-flex items-center px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium transition-colors duration-200">
                    <Code className="h-4 w-4 mr-2" />
                    Explore API Reference
                  </Link>
                </div>
              </div>
            </div>
          </ScrollRevealContainer>

          <div 
            ref={el => sectionRefs.current[4] = el} 
            data-section-index="4"
            className="mb-12"
          >
            <motion.div 
              className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <motion.h2 
                className="text-xl font-semibold text-gray-900 dark:text-white mb-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                Partner Resources
              </motion.h2>
              <motion.p 
                className="text-gray-600 dark:text-gray-300 mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                To help you successfully integrate with our RaaS platform, we provide these additional resources:
              </motion.p>
              
              <div className="grid md:grid-cols-2 gap-4">
                {[
                  {
                    title: "API Specification",
                    description: "Download the complete OpenAPI specification to integrate with your development tools.",
                    color: "blue"
                  },
                  {
                    title: "Partner SDKs",
                    description: "Ready-to-use client libraries for JavaScript, Python, Java, C#, and PHP.",
                    color: "purple"
                  },
                  {
                    title: "Integration Guide",
                    description: "Comprehensive step-by-step guide with best practices for a successful integration.",
                    color: "amber"
                  },
                  {
                    title: "Partner Support",
                    description: "Direct access to our dedicated partner support team for technical assistance.",
                    color: "green"
                  }
                ].map((resource, index) => (
                  <motion.div 
                    key={`resource-${index}`}
                    className={`p-4 rounded-lg border border-${resource.color}-200 dark:border-${resource.color}-900 cursor-pointer relative overflow-hidden`}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.4 + (index * 0.1) }}
                    whileHover={{ 
                      scale: 1.03, 
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                      backgroundColor: theme.mode === 'dark' ? '#1f2937' : '#f9fafb'
                    }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={() => setHoveredResource(index)}
                    onMouseLeave={() => setHoveredResource(null)}
                  >
                    <motion.div 
                      className={`absolute inset-0 bg-gradient-to-r from-${resource.color}-50 to-transparent dark:from-${resource.color}-900/20 dark:to-transparent`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: hoveredResource === index ? 1 : 0 }}
                      transition={{ duration: 0.3 }}
                    />
                    
                    <div className="flex items-start relative z-10">
                      <motion.div 
                        className={`flex-shrink-0 w-10 h-10 rounded-full bg-${resource.color}-100 dark:bg-${resource.color}-900/50 flex items-center justify-center`}
                        animate={{ 
                          rotate: hoveredResource === index ? [0, 15, -15, 0] : 0,
                          scale: hoveredResource === index ? [1, 1.2, 1] : 1,
                        }}
                        transition={{ duration: 0.5 }}
                      >
                        <ExternalLink className={`h-5 w-5 text-${resource.color}-600 dark:text-${resource.color}-400`} />
                      </motion.div>
                      
                      <div className="ml-4">
                        <h3 className="text-md font-medium text-gray-900 dark:text-white">{resource.title}</h3>
                        <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
                          {resource.description}
                        </p>
                        
                        <motion.div 
                          className="mt-3"
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ 
                            opacity: hoveredResource === index ? 1 : 0,
                            height: hoveredResource === index ? 'auto' : 0
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          <button className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-md text-white bg-${resource.color}-600 hover:bg-${resource.color}-700`}>
                            Access Resource
                          </button>
                        </motion.div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <motion.div 
                className="mt-8 text-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.5 }}
              >
                <motion.button
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  View All Resources
                </motion.button>
              </motion.div>
            </motion.div>
          </div>
        </>
      ) : (
        <>
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
        </>
      )}

      <motion.div 
        className="mt-12 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 relative overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        whileHover={{ boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)" }}
      >
        <motion.div 
          className="absolute -right-20 -top-20 w-64 h-64 rounded-full bg-primary-100 dark:bg-primary-900/20 opacity-50"
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.5, 0.3, 0.5],
          }}
          transition={{ duration: 8, repeat: Infinity, repeatType: "reverse" }}
        />
        
        <motion.div 
          className="absolute -left-10 -bottom-10 w-40 h-40 rounded-full bg-blue-100 dark:bg-blue-900/20 opacity-40"
          animate={{ 
            scale: [1, 1.2, 1],
            opacity: [0.4, 0.2, 0.4],
          }}
          transition={{ duration: 6, repeat: Infinity, repeatType: "reverse", delay: 1 }}
        />
        
        <div className="relative z-10">
          <motion.h3 
            className="text-lg font-medium text-gray-900 dark:text-white mb-2"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            Need help?
          </motion.h3>
          
          <motion.p 
            className="text-gray-600 dark:text-gray-300 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.5 }}
          >
            Our support team is ready to assist you with any questions about using the developer portal or API integration.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <motion.button 
              className="px-4 py-2 bg-primary-600 hover:bg-primary-700 text-white rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <motion.span 
                initial={{ x: 0 }}
                whileHover={{ x: -4 }}
              >
                Contact Support
              </motion.span>
              <motion.svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-4 w-4 ml-2" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
                initial={{ x: 0, opacity: 0 }}
                whileHover={{ x: 4, opacity: 1 }}
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </motion.svg>
            </motion.button>
            
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link 
                to="/api-reference/auth" 
                className="px-4 py-2 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
              >
                <Code className="h-4 w-4 mr-2" />
                View API Reference
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
};

export default PlaceholderPage; 