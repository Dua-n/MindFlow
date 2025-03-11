import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Local development settings
    port: 3000,
    open: true, // Automatically open browser when starting
  }
});

