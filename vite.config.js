
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    https: true,
    strictPort: true,
    port: 3000,
    hmr: {
      protocol: 'ws',
      host: '0.0.0.0',
    },
    watch: {
      usePolling: true
    },
    cors: true,
    fs: {
      strict: false
    },
    allowedHosts: [
      '.replit.dev',
      'all'
    ]
  }
})
