<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <main class="nf">
    <h1>{{ t('shared.notFound.title') }}</h1>
    <p>{{ t('shared.notFound.text') }}</p>
    <router-link to="/dashboard">{{ t('shared.notFound.back') }}</router-link>
  </main>
</template>

<style scoped>
.nf { min-height: 100%; display: grid; place-content: center; gap: 0.5rem; text-align: center; padding: 2rem; }
</style>
