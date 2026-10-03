<script setup>
import { useI18n } from 'vue-i18n'

const { locale, t } = useI18n()
function setLocale(value) {
  locale.value = value
  localStorage.setItem('smartstock.locale', value)
  document.documentElement.lang = value === 'es' ? 'es-419' : 'en'
}
</script>

<template>
  <div class="switcher" role="group" :aria-label="t('shared.language')">
    <button type="button" :aria-pressed="locale === 'en'" @click="setLocale('en')">EN</button>
    <button type="button" :aria-pressed="locale === 'es'" @click="setLocale('es')">ES</button>
  </div>
</template>

<style scoped>
.switcher { display: inline-flex; border: 1px solid var(--p-content-border-color); border-radius: 0.6rem; overflow: hidden; background: var(--p-surface-0); }
button { border: 0; background: transparent; padding: 0.4rem 0.7rem; font-weight: 600; cursor: pointer; color: var(--p-text-color); }
button[aria-pressed='true'] { background: var(--p-primary-color); color: var(--p-primary-contrast-color); }
</style>
