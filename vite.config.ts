import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // Local development settings
    port: 3000,
    open: true, // Automatically open browser when starting
    headers: {
      'Content-Security-Policy': `
        default-src 'self';
        script-src 'self' 'unsafe-eval' 'unsafe-inline';
        style-src 'self' 'unsafe-inline';
        img-src 'self' data: https:;
        connect-src 'self' https://openrouter.ai https://api.openrouter.ai;
        font-src 'self';
      `.replace(/\s+/g, ' ').trim()
    }
  }
});

