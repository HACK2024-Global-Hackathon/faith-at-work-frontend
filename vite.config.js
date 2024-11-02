import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { ViteFaviconsPlugin } from 'vite-plugin-favicon2'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    ViteFaviconsPlugin({
      logo: './src/assets/logo.png',
      favicons: {
        appName: 'Faith@Work',
        appDescription: 'Your Monday Church'
      }
    })
  ],
  server: {
    port: 8080
  }
})
