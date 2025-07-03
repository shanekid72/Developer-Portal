# RaaS Developer Portal - Setup Guide

## 🎯 Overview

You now have a complete, modern developer portal for your RaaS (Remittance as a Service) product! This portal includes:

- ✅ **Responsive layout** with sidebar navigation
- ✅ **Dark/light theme toggle**
- ✅ **Country selection** (UAE, KSA, USA)
- ✅ **API documentation** with interactive examples
- ✅ **"Try It" functionality** for testing endpoints
- ✅ **Modern design** similar to LeanTech's portal
- ✅ **TypeScript** for type safety
- ✅ **Tailwind CSS** for styling
- ✅ **Framer Motion** for animations

## 📁 Project Structure Created

```
raas-developer-portal/
├── public/
├── src/
│   ├── components/
│   │   └── layout/
│   │       ├── MainLayout.tsx     # Main layout with sidebar
│   │       ├── Header.tsx         # Header with theme toggle
│   │       └── Sidebar.tsx        # Navigation sidebar
│   ├── pages/
│   │   ├── IntroductionPage.tsx   # Welcome/overview page
│   │   ├── AuthenticationPage.tsx # API auth documentation
│   │   └── APIReferencePage.tsx   # Interactive API docs
│   ├── types/
│   │   └── index.ts               # TypeScript interfaces
│   ├── utils/
│   │   └── constants.ts           # App configuration
│   ├── App.tsx                    # Main app component
│   ├── main.tsx                   # React entry point
│   └── index.css                  # Global styles
├── package.json                   # Dependencies & scripts
├── tailwind.config.js             # Tailwind configuration
├── tsconfig.json                  # TypeScript config
├── vite.config.ts                 # Vite build config
├── .env.example                   # Environment variables
└── README.md                      # Documentation
```

## 🚀 Quick Start

### Prerequisites
First, you'll need to install Node.js:
1. Download from [nodejs.org](https://nodejs.org/)
2. Install Node.js 16+ and npm

### Installation Steps

1. **Navigate to your project directory:**
   ```bash
   cd "path/to/your/developer portal"
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Visit `http://localhost:3000`

## 🎨 Features Implemented

### 1. **Main Layout**
- Responsive sidebar that collapses on mobile
- Header with branding and controls
- Smooth animations and transitions

### 2. **Navigation**
- Collapsible sections in sidebar
- Active state highlighting
- Mobile-friendly menu

### 3. **Theme System**
- Dark/light mode toggle
- Persistent theme preference
- Smooth color transitions

### 4. **Country Selection**
- Dropdown with flags and API versions
- Support for UAE, KSA, and USA markets
- Easy to extend for more countries

### 5. **API Documentation**
- Interactive endpoint explorer
- Code examples in multiple languages
- Parameter documentation
- Response examples

### 6. **Try It Panel**
- Form inputs for API parameters
- Mock API responses
- Loading states and error handling
- Copy code functionality

## 🛠 Customization Guide

### Adding New API Endpoints

Edit `src/pages/APIReferencePage.tsx` and add to the `endpoints` array:

```typescript
{
  id: 'your-endpoint',
  title: 'Your Endpoint',
  method: 'POST',
  path: '/v2/your-endpoint',
  description: 'Description of your endpoint',
  parameters: [
    // Add parameter definitions
  ],
  responses: [
    // Add response examples
  ],
  codeExamples: [
    // Add code samples
  ]
}
```

### Modifying Navigation

Edit `src/components/layout/Sidebar.tsx` and update the `navigationItems` array:

```typescript
const navigationItems: NavigationItem[] = [
  {
    id: 'your-section',
    title: 'Your Section',
    icon: 'YourIcon',
    children: [
      { id: 'page1', title: 'Page 1', href: '/page1' },
      // Add more pages
    ],
  },
];
```

### Changing Colors and Styling

Edit `tailwind.config.js` to customize the theme:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        // Your brand colors
        500: '#your-color',
        600: '#your-darker-color',
      },
    },
  },
}
```

### Adding New Countries

Edit `src/utils/constants.ts` and add to the `COUNTRIES` array:

```typescript
{ code: 'NEW', name: 'New Country', flag: '🏳️', apiVersion: 'v1.0-NEW' }
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🌟 Next Steps

1. **Install Node.js** if you haven't already
2. **Run the commands** above to see your portal
3. **Customize the content** for your specific API
4. **Replace mock data** with real API integration
5. **Deploy to your hosting platform**

## 📝 Integration Notes

- Replace mock API calls in "Try It" with real endpoints
- Update authentication examples with your actual API keys
- Customize the branding and colors to match your company
- Add more documentation pages as needed

## 🎉 You're Ready!

Your developer portal is now complete and ready to use. The structure is extensible and follows modern React best practices. Simply install Node.js, run the commands above, and start customizing for your needs!

---

**Need help?** The code is well-commented and follows standard React patterns. Each component is modular and easy to understand. 