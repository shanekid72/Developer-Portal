import { useEffect, useState, useRef } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollToPlugin } from 'gsap/ScrollToPlugin';
import MainLayout from './components/layout/MainLayout';
import IntroductionPage from './pages/IntroductionPage';
import AuthenticationPage from './pages/AuthenticationPage';
import APIReferencePage from './pages/APIReferencePage';
import SandboxTestingPage from './pages/SandboxTestingPage';
import APIReference from './pages/APIReference';
import PlaceholderPage from './pages/PlaceholderPage';
import { Theme } from './types';

// Register GSAP plugins
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

function App() {
  const [theme, setTheme] = useState<Theme>({ mode: 'light' });
  // const [selectedCountry, setSelectedCountry] = useState('UAE');
  const appRef = useRef<HTMLDivElement>(null);
  
  // Smooth scroll setup
  useEffect(() => {
    // Check for reduced motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    
    if (!prefersReducedMotion) {
      // Initialize smooth scrolling for the entire application
      const ctx = gsap.context(() => {
        // Setup smooth scrolling behavior
        gsap.config({
          autoSleep: 60,
          force3D: true
        });
        
        // Make scroll triggers update on resize
        ScrollTrigger.config({
          ignoreMobileResize: true
        });
        
        // Setup scroll behavior for all page transitions
        ScrollTrigger.clearScrollMemory();
        ScrollTrigger.defaults({
          scrub: true
        });
      }, appRef);
      
      // Reset scroll position on route changes
      const handleRouteChange = () => {
        window.scrollTo(0, 0);
      };
      
      window.addEventListener('popstate', handleRouteChange);
      
      return () => {
        ctx.revert();
        window.removeEventListener('popstate', handleRouteChange);
      };
    }
  }, []);

  useEffect(() => {
    // Check for saved theme preference or default to 'light'
    const savedTheme = localStorage.getItem('theme') as 'light' | 'dark' | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');
    setTheme({ mode: initialTheme });
    
    // Apply theme to document
    if (initialTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleTheme = () => {
    const newMode = theme.mode === 'light' ? 'dark' : 'light';
    setTheme({ mode: newMode });
    
    // Save to localStorage
    localStorage.setItem('theme', newMode);
    
    // Apply to document
    if (newMode === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <motion.div 
      ref={appRef}
      className="min-h-screen bg-white dark:bg-gray-950 scroll-smooth"
      data-scroll-container
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <MainLayout
        theme={theme}
        onThemeToggle={toggleTheme}
      >
        <Routes>
          {/* Main routes */}
          <Route path="/" element={<IntroductionPage />} />
          <Route path="/introduction" element={<IntroductionPage />} />
          <Route path="/authentication" element={<AuthenticationPage />} />
          <Route path="/quick-start" element={<PlaceholderPage />} />
          <Route path="/sandbox-testing" element={<SandboxTestingPage />} />
          
          {/* API Reference routes */}
          <Route path="/api-reference" element={<Navigate to="/api-reference/auth" replace />} />
          <Route path="/api-reference/:endpointId" element={<APIReferencePage theme={theme} />} />
          <Route path="/api-reference-swagger" element={<APIReference />} />
          
          {/* Guide routes */}
          <Route path="/guides/onboarding" element={<PlaceholderPage />} />
          <Route path="/guides/transactions" element={<PlaceholderPage />} />
          <Route path="/guides/rates" element={<PlaceholderPage />} />
          <Route path="/guides/errors" element={<PlaceholderPage />} />
          
          {/* Resource routes */}
          <Route path="/downloads" element={<PlaceholderPage />} />
          <Route path="/changelog" element={<PlaceholderPage />} />
          
          {/* Catch-all route */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </MainLayout>
    </motion.div>
  );
}

export default App; 