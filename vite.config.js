
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    strictPort: true,
    port: 3000,
    hmr: {
      clientPort: 443,
      path: 'ws',
      host: '0.0.0.0'
    },
    watch: {
      usePolling: true
    }
  }
})
