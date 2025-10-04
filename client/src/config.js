// API Configuration
const config = {
  // Backend URL - automatically uses production URL when deployed
  // Remove trailing slash if present
  API_URL: (import.meta.env.VITE_API_URL || 'http://localhost:3001').replace(/\/$/, ''),
};

export default config;
