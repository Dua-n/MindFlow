
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 3000,
    hmr: {
      protocol: 'ws',
      host: '0.0.0.0',
      port: 3001
    },
    watch: {
      usePolling: true
    },
    allowedHosts: 'all'
  }
})
