import { createI18n } from 'vue-i18n'
import en from '../locales/en.json'
import es from '../locales/es.json'

// en = en_US (default), es = es_419
const stored = localStorage.getItem('smartstock.locale')

export default createI18n({
  legacy: false,
  locale: stored === 'es' ? 'es' : 'en',
  fallbackLocale: 'en',
  messages: { en, es },
})
