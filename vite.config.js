import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // for backend not have https so this setup have to do
    server: {
    proxy: {
      '/api': {
        target: 'http://54.167.114.0',
        changeOrigin: true,
      },
    }
  }
})
