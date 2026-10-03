import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import { SmartStockPreset } from './shared/presentation/theme/smartstock-preset.js'
import 'primeicons/primeicons.css'
import App from './App.vue'
import router from './router'
import i18n from './i18n'
import './shared/presentation/styles/global.css'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(i18n)
  .use(PrimeVue, { theme: { preset: SmartStockPreset, options: { darkModeSelector: '.app-dark' } } })
  .mount('#app')
