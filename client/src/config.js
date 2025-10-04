// API Configuration
const config = {
  // Backend URL - automatically uses production URL when deployed
  API_URL: import.meta.env.VITE_API_URL || 'http://localhost:3001',
};

export default config;
