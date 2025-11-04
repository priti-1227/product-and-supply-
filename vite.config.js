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
      '/media': {
        target: 'http://54.167.114.0',
        changeOrigin: true,
        // No rewrite needed, as the path is the same
      }
    }
  }
})

// THIS CODE IS FOR VERCEL,JSON FILE FOR PRODUCTION THE ABOVE SOLUTION IS APPLY FOR TEMP BASED AS WE DONT HAVE BACKEND HTTPS
// {
//   "rewrites": [
//     {
//       "source": "/(.*)",
//       "destination": "/index.html"
//     }
//   ]
// }
