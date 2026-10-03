<script setup>
import { useI18n } from 'vue-i18n'

defineProps({ message: { type: String, default: '' } })
const { t } = useI18n()
</script>

<template>
  <div class="empty" role="status">
    <i class="pi pi-inbox" aria-hidden="true" />
    <p>{{ message || t('shared.empty') }}</p>
  </div>
</template>

<style scoped>
.empty { display: grid; justify-items: center; gap: 0.5rem; padding: 2rem 1rem; color: var(--p-text-muted-color); }
.empty i { font-size: 2rem; }
</style>
