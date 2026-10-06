import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// GitHub Pages serves the app under /smartstock-frontend/. The base path is used by the
// production build and by `npm run preview`; `npm run dev` keeps working at http://localhost:5173/
export default defineConfig(({ command, isPreview }) => ({
  base: command === 'build' || isPreview ? '/smartstock-frontend/' : '/',
  plugins: [vue()],
}))