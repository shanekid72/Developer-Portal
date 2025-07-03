import { ReactNode, useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Header from './Header';
import Sidebar from './Sidebar';
import ScrollToTop from '../ScrollToTop';
import { Theme } from '../../types';

interface MainLayoutProps {
  children: ReactNode;
  theme: Theme;
  onThemeToggle: () => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
}

const MainLayout = ({ 
  children, 
  theme, 
  onThemeToggle, 
  selectedCountry, 
  onCountryChange 
}: MainLayoutProps) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  
  // Handle closing sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sidebarOpen &&
        mainRef.current &&
        !mainRef.current.contains(event.target as Node)
      ) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [sidebarOpen]);
  
  // Initialize smooth scrolling for the main content area
  useEffect(() => {
    const main = mainRef.current;
    if (!main) return;
    
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReducedMotion) return;
    
    // Initialize ScrollTrigger for this container
    const ctx = gsap.context(() => {
      ScrollTrigger.refresh();
      
      // Apply a subtle parallax effect to sections when scrolling
      const sections = main.querySelectorAll('section');
      sections.forEach((section) => {
        gsap.to(section, {
          y: 10, // Reduced parallax effect for more subtle movement
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.5
          }
        });
      });
      
      // Fix for Swagger UI scrolling issues
      const fixSwaggerScrolling = () => {
        const swaggerContainers = document.querySelectorAll('.swagger-ui .opblock-body, .swagger-ui .responses-wrapper, .swagger-ui .model-box');
        swaggerContainers.forEach((container) => {
          if (container instanceof HTMLElement) {
            container.style.maxHeight = 'none';
            container.style.overflowY = 'visible';
          }
        });
      };
      
      // Run the fix initially and on resize
      fixSwaggerScrolling();
      window.addEventListener('resize', fixSwaggerScrolling);
      
      return () => {
        window.removeEventListener('resize', fixSwaggerScrolling);
      };
    }, main);
    
    return () => ctx.revert();
  }, []);

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      {/* Sidebar backdrop overlay (mobile) */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            className="fixed inset-0 z-20 lg:hidden bg-gray-900/50 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div
        className={`fixed z-30 inset-y-0 left-0 w-64 transform transition-transform duration-300 ease-in-out 
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
          lg:translate-x-0 lg:static lg:inset-0 
          bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 overflow-hidden`}
        initial={false}
      >
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </motion.div>

      {/* Main content */}
      <div ref={mainRef} className="flex-1 flex flex-col overflow-hidden">
        <Header
          theme={theme}
          onThemeToggle={onThemeToggle}
          selectedCountry={selectedCountry}
          onCountryChange={onCountryChange}
          onMenuClick={() => setSidebarOpen(true)}
        />
        
        <main className="flex-1 overflow-y-auto scroll-smooth" data-scroll>
          <motion.div
            ref={contentRef}
            className="min-h-full relative"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {children}
            
            {/* Footer */}
            <footer className="mt-12 py-6 px-4 sm:px-6 border-t border-gray-200 dark:border-gray-700">
              <div className="max-w-7xl mx-auto">
                <div className="flex flex-col md:flex-row justify-between items-center">
                  <div className="text-center md:text-left mb-4 md:mb-0">
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      &copy; {new Date().getFullYear()} RaaS (Remittance as a Service). All rights reserved.
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                      Terms of Service
                    </a>
                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                      Privacy Policy
                    </a>
                    <a href="#" className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary-500 dark:hover:text-primary-400">
                      Contact Us
                    </a>
                  </div>
                </div>
              </div>
            </footer>
          </motion.div>
        </main>
      </div>

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </div>
  );
};

export default MainLayout; 