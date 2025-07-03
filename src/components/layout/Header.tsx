import { Moon, Sun, Menu, ChevronDown, Search, ExternalLink, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Theme, Country } from '../../types';
import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  theme: Theme;
  onThemeToggle: () => void;
  selectedCountry: string;
  onCountryChange: (country: string) => void;
  onMenuClick: () => void;
}

const countries: Country[] = [
  { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪', apiVersion: 'v2.0-UAE' },
  { code: 'KSA', name: 'Saudi Arabia', flag: '🇸🇦', apiVersion: 'v2.0-KSA' },
  { code: 'USA', name: 'United States', flag: '🇺🇸', apiVersion: 'v1.0-USA' },
];

const Header = ({ theme, onThemeToggle, selectedCountry, onCountryChange, onMenuClick }: HeaderProps) => {
  const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  
  const searchInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  
  const selectedCountryData = countries.find(c => c.code === selectedCountry) || countries[0];
  
  // Mock search results - in a real app, this would query your API endpoints
  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }
    
    const query = searchQuery.toLowerCase();
    const mockResults = [
      { 
        type: 'endpoint', 
        title: 'Create Transaction',
        path: '/api-reference/remittance',
        description: 'POST /amr/ras/api/v1_0/ras/createtransaction' 
      },
      { 
        type: 'endpoint', 
        title: 'Get Exchange Rates',
        path: '/api-reference/masters',
        description: 'GET /raas/masters/v1/rates' 
      },
      { 
        type: 'guide', 
        title: 'Authentication Guide',
        path: '/authentication',
        description: 'How to authenticate with the RaaS API' 
      },
    ].filter(item => 
      item.title.toLowerCase().includes(query) || 
      item.description.toLowerCase().includes(query)
    );
    
    setSearchResults(mockResults);
  }, [searchQuery]);
  
  useEffect(() => {
    if (searchOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [searchOpen]);
  
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchResults.length > 0) {
      navigate(searchResults[0].path);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };
  
  const closeSearch = () => {
    setSearchOpen(false);
    setSearchQuery('');
  };

  return (
    <header className="sticky top-0 z-30 w-full bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Mobile menu button */}
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Logo and title */}
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-primary-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">R</span>
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
                RaaS Developer Portal
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                API Documentation & Reference
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          {/* Search button (shows overlay on click) */}
          <button
            onClick={() => setSearchOpen(true)}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700"
            aria-label="Search documentation"
          >
            <Search className="h-5 w-5" />
          </button>
          
          {/* Country selector */}
          <div className="relative">
            <button
              onClick={() => setCountryDropdownOpen(!countryDropdownOpen)}
              className="flex items-center space-x-2 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200"
            >
              <span>{selectedCountryData.flag}</span>
              <span className="hidden sm:inline">{selectedCountryData.apiVersion}</span>
              <ChevronDown className="h-4 w-4" />
            </button>

            <AnimatePresence>
              {countryDropdownOpen && (
                <motion.div
                  className="absolute right-0 mt-2 w-56 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-50"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.15 }}
                >
                  <div className="py-1">
                    {countries.map((country) => (
                      <button
                        key={country.code}
                        onClick={() => {
                          onCountryChange(country.code);
                          setCountryDropdownOpen(false);
                        }}
                        className={`${
                          selectedCountry === country.code
                            ? 'bg-primary-50 dark:bg-primary-900 text-primary-700 dark:text-primary-300'
                            : 'text-gray-700 dark:text-gray-300'
                        } group flex items-center px-4 py-2 text-sm w-full text-left hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200`}
                      >
                        <span className="mr-3">{country.flag}</span>
                        <div>
                          <div className="font-medium">{country.name}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">
                            {country.apiVersion}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* External links */}
          <a 
            href="https://github.com/example/raas-developer-portal" 
            target="_blank" 
            rel="noopener noreferrer"
            className="hidden md:flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            <span>GitHub</span>
            <ExternalLink className="h-3.5 w-3.5" />
          </a>

          {/* Theme toggle */}
          <motion.button
            onClick={onThemeToggle}
            className="p-2 rounded-md text-gray-500 hover:text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 dark:hover:bg-gray-700 transition-colors duration-200"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            aria-label={theme.mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          >
            {theme.mode === 'light' ? (
              <Moon className="h-5 w-5" />
            ) : (
              <Sun className="h-5 w-5" />
            )}
          </motion.button>
        </div>
      </div>
      
      {/* Global search overlay */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div 
            className="fixed inset-0 z-50 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-start justify-center pt-20"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeSearch}
          >
            <motion.div 
              className="w-full max-w-2xl bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={e => e.stopPropagation()}
            >
              <form onSubmit={handleSearchSubmit} className="relative">
                <div className="flex items-center border-b border-gray-200 dark:border-gray-700">
                  <div className="pl-4">
                    <Search className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for endpoints, guides, and more..."
                    className="w-full py-4 pl-3 pr-12 text-gray-900 dark:text-gray-100 bg-transparent focus:outline-none placeholder:text-gray-400 dark:placeholder:text-gray-500"
                  />
                  <button
                    type="button"
                    onClick={closeSearch}
                    className="absolute right-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700"
                  >
                    <X className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
                
                {searchResults.length > 0 && (
                  <div className="max-h-80 overflow-y-auto p-2">
                    <div className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider px-3 py-2">
                      Results
                    </div>
                    <ul>
                      {searchResults.map((result, index) => (
                        <li key={index}>
                          <a
                            href={result.path}
                            className="flex flex-col px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md"
                            onClick={() => {
                              navigate(result.path);
                              closeSearch();
                            }}
                          >
                            <span className="font-medium text-gray-900 dark:text-gray-100">{result.title}</span>
                            <span className="text-sm text-gray-500 dark:text-gray-400">{result.description}</span>
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                
                {searchQuery.trim().length > 1 && searchResults.length === 0 && (
                  <div className="p-6 text-center text-gray-500 dark:text-gray-400">
                    No results found for "{searchQuery}"
                  </div>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

export default Header; 