# RaaS Developer Portal

A modern developer portal for Remittance as a Service (RaaS) API documentation, built with React, TypeScript, Vite, and Tailwind CSS.

## Features

- 🎨 Modern, responsive design with dark/light theme toggle
- 🌍 Country-specific API versions (UAE, KSA, USA)
- 📚 Comprehensive API documentation with interactive examples
- 🧪 "Try It" functionality for testing API endpoints
- 🎯 Clean navigation with collapsible sidebar
- ⚡ Fast development with Vite
- 🎭 Smooth animations with Framer Motion
- 📱 Mobile-friendly responsive design

## Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion + GSAP
- **Icons**: Lucide React
- **Routing**: React Router DOM
- **Code Highlighting**: Prism.js

## Project Structure

```
raas-developer-portal/
├── src/
│   ├── components/
│   │   ├── layout/           # Layout components (Header, Sidebar, MainLayout)
│   │   ├── documentation/    # API documentation components
│   │   ├── code-samples/     # Code sample components
│   │   └── try-it/          # Try It panel components
│   ├── pages/               # Page components
│   ├── types/               # TypeScript type definitions
│   ├── hooks/               # Custom React hooks
│   ├── utils/               # Utility functions
│   └── styles/              # Global styles
├── public/                  # Static assets
└── dist/                    # Build output
```

## Getting Started

### Prerequisites

- Node.js 16+ and npm (or yarn/pnpm)
- Modern web browser

### Installation

1. **Clone or download the project**
   ```bash
   # If you have the project files
   cd raas-developer-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Build for Production

```bash
npm run build
# or
yarn build
# or
pnpm build
```

The built files will be in the `dist/` directory.

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run dev:prod` - Start development server in production mode
- `npm run dev:prod:debug` - Start development server in production mode with debug

## Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=https://api.raasplatform.com
VITE_SANDBOX_API_URL=https://sandbox.raasplatform.com
VITE_APP_TITLE=RaaS Developer Portal
```

### Customization

#### Theme Configuration

Edit `tailwind.config.js` to customize colors, fonts, and other design tokens:

```javascript
module.exports = {
  theme: {
    extend: {
      colors: {
        primary: {
          // Your custom primary colors
        },
      },
    },
  },
}
```

#### Navigation

Edit the navigation structure in `src/components/layout/Sidebar.tsx`:

```typescript
const navigationItems: NavigationItem[] = [
  // Add your navigation items
];
```

## Key Components

### MainLayout
The main layout component that includes the header, sidebar, and content area.

### Sidebar
Collapsible navigation sidebar with nested menu items and active state management.

### Header
Top navigation bar with theme toggle, country selector, and mobile menu trigger.

### API Documentation Pages
- **IntroductionPage**: Overview and getting started information
- **AuthenticationPage**: API authentication and security guidelines
- **APIReferencePage**: Interactive API documentation with "Try It" functionality

## API Integration

The portal includes placeholder API endpoints and mock data. To integrate with your actual API:

1. Update the API endpoints in `src/pages/APIReferencePage.tsx`
2. Configure the base URL in your environment variables
3. Implement actual API calls in the "Try It" functionality
4. Add your authentication logic

## Animations

The project uses both Framer Motion and GSAP for animations:

- **Framer Motion**: Page transitions, component animations
- **GSAP**: Complex animations, scroll-triggered effects (following your animation rules)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For questions or support, please contact the development team.

## Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Start the development server:
   ```
   npm run dev
   ```

3. Start the CORS proxy server (optional, only needed if you encounter CORS issues):
   ```
   node cors-server.js
   ```

## Testing API Calls

To ensure API calls are visible in the browser's network tab:

1. Navigate to the API Reference section
2. Open your browser's developer tools (F12 or right-click > Inspect)
3. Go to the Network tab
4. Expand an API endpoint card and click the "Try It" button
5. You should see the API call appear in the network tab

If you encounter CORS issues, you can:

1. Install a CORS browser extension (like "CORS Unblock" for Chrome)
2. Use the included CORS proxy server by starting it with `node cors-server.js`
3. Visit the test page at `/cors-test.html` to test both direct and proxied API calls

## API Reference Structure

The API Reference section is organized into the following categories:

- Authentication
- Codes & Masters
- Remittance API
- Customer API

Each category contains detailed documentation for its endpoints, including request/response formats, code examples, and usage guidelines.

## Development Notes

- The API calls are made directly to the backend URL to ensure they appear in the network tab
- The CORS proxy server is available for testing and development purposes
- API endpoints are defined in the APIReferencePage.tsx file

---

Built with ❤️ for developers by developers. 