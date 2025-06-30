// Environment configuration
export const config = {
  // API Configuration
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'https://read-sea-api.onrender.com',
    timeout: parseInt(import.meta.env.VITE_API_TIMEOUT || '60000'),
  },
  
  // App Configuration
  app: {
    name: import.meta.env.VITE_APP_NAME || 'Red sea ',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    environment: import.meta.env.MODE || 'development',
  },
  
  // Feature Flags
  features: {
    enableNotifications: import.meta.env.VITE_ENABLE_NOTIFICATIONS !== 'false',
    enableAnalytics: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
    enableDevTools: import.meta.env.MODE === 'development',
  },

  // Demo Account
  demo: {
    email: import.meta.env.VITE_DEMO_EMAIL || 'mike1218@gmail.com',
    password: import.meta.env.VITE_DEMO_PASSWORD || 'Hesoyam1218@',
  },
  
  // Storage Keys
  storage: {
    authToken: 'authToken',
    refreshToken: 'refreshToken',
    userPreferences: 'userPreferences',
    theme: 'theme',
    // Redux Persist keys
    persistRoot: 'persist:Red sea -admin',
    persistAuth: 'persist:auth',
    persistUi: 'persist:ui',
  },
}

export default config
