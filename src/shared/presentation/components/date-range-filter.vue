<script setup>
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import { useI18n } from 'vue-i18n'

// Search by date range only (US27, US31)
const range = defineModel({ type: Array, default: () => [null, null] })
const emit = defineEmits(['search'])
const { t } = useI18n()
</script>

<template>
  <div class="range">
    <DatePicker v-model="range" selection-mode="range" :manual-input="false" show-icon :aria-label="t('shared.dateRange')" />
    <Button :label="t('shared.search')" @click="emit('search')" />
  </div>
</template>

<style scoped>
.range { display: flex; flex-wrap: wrap; gap: 0.5rem; align-items: center; }
</style>
