<script setup>
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './language-switcher.vue'

const { t } = useI18n()
</script>

<template>
  <div class="auth">
    <aside class="brand">
      <strong class="logo">SmartStock</strong>
      <h2>{{ t('shared.footer') }}</h2>
    </aside>
    <main class="panel">
      <div class="lang"><language-switcher /></div>
      <div class="card"><slot /></div>
    </main>
  </div>
</template>

<style scoped>
.auth { min-height: 100%; display: grid; grid-template-columns: minmax(280px, 40%) 1fr; }
.brand { background: var(--p-primary-900); color: var(--p-surface-0); padding: 2rem; display: flex; flex-direction: column; gap: 3rem; }
.logo { font-size: 1.25rem; }
.brand h2 { font-size: 2rem; font-weight: 600; margin: auto 0; }
.panel { position: relative; display: grid; place-items: center; padding: 2rem 1rem; }
.lang { position: absolute; top: 1rem; right: 1rem; }
.card { width: min(440px, 100%); background: var(--p-surface-0); border: 1px solid var(--p-content-border-color); border-radius: 0.9rem; padding: 2rem; }
@media (max-width: 768px) { .auth { grid-template-columns: 1fr; } .brand { padding: 1rem 1.5rem; } .brand h2 { display: none; } }
</style>
