import { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ChevronRight, 
  BookOpen, 
  Key, 
  Code, 
  Shield, 
  UserCircle,
  DollarSign,
  X,
  Search,
  RefreshCw,
  FileText,
  CheckCircle
} from 'lucide-react';
import { NavigationItem } from '../../types';
import clsx from 'clsx';

interface SidebarProps {
  onClose: () => void;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'getting-started',
    title: 'Getting Started',
    icon: 'BookOpen',
    children: [
      { id: 'introduction', title: 'Introduction', href: '/introduction' },
      { id: 'quick-start', title: 'Quick Start Guide', href: '/quick-start' },
    ],
  },
  {
    id: 'api-reference',
    title: 'API Reference',
    icon: 'Code',
    children: [
      { id: 'auth-endpoints', title: 'Authentication', href: '/api-reference/auth' },
      { id: 'masters', title: 'Codes & Masters', href: '/api-reference/masters' },
      { id: 'remittance', title: 'Remittance API', href: '/api-reference/remittance' },
      { id: 'customer', title: 'Customer API', href: '/api-reference/customer' },
    ],
  },
  {
    id: 'guides',
    title: 'Integration Guides',
    icon: 'FileText',
    children: [
      { id: 'onboarding', title: 'Customer Onboarding', href: '/guides/onboarding' },
      { id: 'transactions', title: 'Creating Transactions', href: '/guides/transactions' },
      { id: 'rate-management', title: 'Rate Management', href: '/guides/rates' },
      { id: 'error-handling', title: 'Error Handling', href: '/guides/errors' },
    ],
  },
  {
    id: 'resources',
    title: 'Resources',
    icon: 'RefreshCw',
    children: [
      { id: 'api-swagger', title: 'API Specification', href: '/api-reference-swagger' },
      { id: 'downloads', title: 'Downloads', href: '/downloads' },
      { id: 'changelog', title: 'Changelog', href: '/changelog' },
    ],
  }
];

const iconMap = {
  BookOpen,
  Key,
  Code,
  Shield,
  UserCircle,
  DollarSign,
  RefreshCw,
  FileText,
  CheckCircle
};

const Sidebar = ({ onClose }: SidebarProps) => {
  const location = useLocation();
  const [expandedItems, setExpandedItems] = useState<string[]>(['getting-started', 'api-reference']);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<NavigationItem[]>([]);
  const searchRef = useRef<HTMLInputElement>(null);

  const toggleExpanded = (itemId: string) => {
    setExpandedItems(prev =>
      prev.includes(itemId)
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const isActive = (href: string) => {
    return location.pathname === href || location.pathname.startsWith(`${href}/`);
  };

  const isParentActive = (children: NavigationItem[]) => {
    return children.some(child => child.href && isActive(child.href));
  };

  useEffect(() => {
    // Auto-expand parent of active item
    navigationItems.forEach(item => {
      if (item.children && isParentActive(item.children) && !expandedItems.includes(item.id)) {
        setExpandedItems(prev => [...prev, item.id]);
      }
    });
  }, [location.pathname]);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults([]);
      return;
    }

    const query = searchQuery.toLowerCase();
    const results = navigationItems.flatMap(category => {
      if (!category.children) return [];
      
      return category.children.filter(item => 
        item.title.toLowerCase().includes(query) || 
        (item.id && item.id.toLowerCase().includes(query))
      );
    });

    setSearchResults(results);
  }, [searchQuery]);

  const handleClearSearch = () => {
    setSearchQuery('');
    if (searchRef.current) {
      searchRef.current.focus();
    }
  };

  const renderNavigationItem = (item: NavigationItem, level = 0) => {
    const Icon = iconMap[item.icon as keyof typeof iconMap] || BookOpen;
    const isExpanded = expandedItems.includes(item.id);
    const hasChildren = item.children && item.children.length > 0;
    const parentActive = hasChildren && isParentActive(item.children!);

    if (hasChildren) {
      return (
        <div key={item.id} className="mb-1">
          <button
            onClick={() => toggleExpanded(item.id)}
            className={clsx(
              'nav-item w-full justify-between',
              parentActive && 'active'
            )}
          >
            <div className="flex items-center space-x-3">
              <Icon className="h-5 w-5" />
              <span>{item.title}</span>
            </div>
            <motion.div
              animate={{ rotate: isExpanded ? 90 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <ChevronRight className="h-4 w-4" />
            </motion.div>
          </button>

          <AnimatePresence>
            {isExpanded && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="overflow-hidden"
              >
                <div className="ml-8 mt-1 space-y-1">
                  {item.children!.map(child => renderNavigationItem(child, level + 1))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      );
    }

    return (
      <Link
        key={item.id}
        to={item.href || '#'}
        onClick={onClose}
        className={clsx(
          'nav-item w-full',
          item.href && isActive(item.href) && 'active'
        )}
      >
        <div className="flex items-center space-x-3">
          {level === 0 && <Icon className="h-5 w-5" />}
          <span>{item.title}</span>
        </div>
      </Link>
    );
  };

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 lg:hidden">
        <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Navigation</h2>
        <button
          onClick={onClose}
          className="p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* Search */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-gray-400" />
          </div>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search documentation..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-500"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Search Results */}
        {searchResults.length > 0 && (
          <div className="mt-2 max-h-64 overflow-auto rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 shadow-lg">
            <ul className="py-1">
              {searchResults.map((result, index) => (
                <li key={`${result.id}-${index}`}>
                  <Link
                    to={result.href || '#'}
                    onClick={onClose}
                    className="block px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200"
                  >
                    {result.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4">
        <div className="space-y-2">
          {navigationItems.map(item => renderNavigationItem(item))}
        </div>
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="text-xs text-gray-500 dark:text-gray-400">
          <p>API Version: v2.0</p>
          <p className="mt-1">Last updated: July 2024</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar; 