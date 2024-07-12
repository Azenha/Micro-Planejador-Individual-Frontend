import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import dotenv from 'dotenv'

dotenv.config()

export default defineConfig({
  plugins: [vue()],
  server: {
    port: process.env.VITE_PORT || 3000,
    proxy: {
      '/api': {
        target: `http://${process.env.VITE_API_HOST || 'localhost'}:${process.env.VITE_API_PORT || 3333}`,
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/api/, '')
      }
    }
  }
})
