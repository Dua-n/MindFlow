
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 8080,
    strictPort: false,
    allowedHosts: [
      'all',
      'ab9c2f98-1b51-476e-ba85-076350e2a334-00-14jmle3v57qdq.kirk.replit.dev'
    ]
  }
})
