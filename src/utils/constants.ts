// Application Constants
export const APP_CONFIG = {
  name: 'RaaS Developer Portal',
  description: 'Developer documentation and API reference for Remittance as a Service',
  version: '1.0.0',
  author: 'RaaS Team',
} as const;

// API Configuration
export const API_CONFIG = {
  baseUrl: (import.meta as any).env?.VITE_API_BASE_URL || 'https://api.raasplatform.com',
  sandboxUrl: (import.meta as any).env?.VITE_SANDBOX_API_URL || 'https://sandbox.raasplatform.com',
  version: 'v2.0',
} as const;

// Supported Countries
export const COUNTRIES = [
  { code: 'UAE', name: 'United Arab Emirates', flag: '🇦🇪', apiVersion: 'v2.0-UAE' },
  { code: 'KSA', name: 'Saudi Arabia', flag: '🇸🇦', apiVersion: 'v2.0-KSA' },
  { code: 'USA', name: 'United States', flag: '🇺🇸', apiVersion: 'v1.0-USA' },
] as const;

// Theme Configuration
export const THEME_CONFIG = {
  defaultMode: 'light',
  storageKey: 'raas-portal-theme',
} as const;

// Animation Configuration
export const ANIMATION_CONFIG = {
  pageTransition: {
    duration: 0.3,
    ease: 'easeInOut',
  },
  staggerDelay: 0.1,
  reducedMotionQuery: '(prefers-reduced-motion: reduce)',
} as const;

// Routes
export const ROUTES = {
  home: '/',
  introduction: '/introduction',
  authentication: '/authentication',
  apiReference: '/api-reference',
  apiEndpoint: (id: string) => `/api-reference/${id}`,
} as const;

// HTTP Methods
export const HTTP_METHODS = [
  'GET',
  'POST', 
  'PUT',
  'DELETE',
  'PATCH',
] as const;

// Sample API Data
export const SAMPLE_ENDPOINTS = [
  'POST /transactions',
  'GET /transactions/{id}',
  'GET /exchange-rates',
  'POST /customers',
  'GET /customers/{id}',
  'PUT /customers/{id}/verify',
  'POST /payment-sources',
  'POST /payment-destinations',
  'POST /payments',
] as const; 