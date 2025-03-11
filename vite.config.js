
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
    // Explicitly allow all hosts including your specific Replit domain
    allowedHosts: [
      '234b8f18-e228-4d68-ae82-82cd596e88cb-00-3k9e0w7guewmz.worf.replit.dev', 
      '*.replit.dev',
      '*.worf.replit.dev',
      'all'
    ]
  }
})
