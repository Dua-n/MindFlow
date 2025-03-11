
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    strictPort: true,
    watch: {
      usePolling: true
    },
    cors: true,
    fs: {
      strict: false
    },
    hmr: {
      clientPort: 443
    },
    // Allow all hosts including Replit domains
    allowedHosts: 'all'
  }
})
