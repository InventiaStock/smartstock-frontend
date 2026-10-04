import { createI18n } from 'vue-i18n'

// One folder per bounded context: src/locales/<context>/en.json and es.json.
// Every file is merged here, so each owner edits only their own translations.
const files = import.meta.glob('../locales/*/*.json', { eager: true, import: 'default' })

function merge(target, source) {
  for (const [key, value] of Object.entries(source)) {
    if (value && typeof value === 'object' && !Array.isArray(value)) {
      target[key] = merge(target[key] ?? {}, value)
    } else {
      target[key] = value
    }
  }
  return target
}

const messages = { en: {}, es: {} }

for (const [path, content] of Object.entries(files)) {
  const locale = path.endsWith('/es.json') ? 'es' : 'en'
  merge(messages[locale], content)
}

// en = en_US (default), es = es_419
const stored = localStorage.getItem('smartstock.locale')

export default createI18n({
  legacy: false,
  locale: stored === 'es' ? 'es' : 'en',
  fallbackLocale: 'en',
  messages,
})

