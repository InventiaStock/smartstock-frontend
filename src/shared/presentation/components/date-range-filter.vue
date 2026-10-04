<script setup>
import { onMounted } from 'vue'
import DatePicker from 'primevue/datepicker'
import Button from 'primevue/button'
import { useI18n } from 'vue-i18n'
import { currentMonth } from '../../domain/model/date-range.js'

// Search by date range only (US27, US31, US25).
// initial="currentMonth" starts with the current month already selected.
const range = defineModel({ type: Array, default: () => [null, null] })
const props = defineProps({ initial: { type: String, default: '' } })
const emit = defineEmits(['search'])
const { t } = useI18n()

onMounted(() => {
  if (props.initial === 'currentMonth') range.value = currentMonth()
})
</script>

<template>
  <div class="range" role="search">
    <DatePicker
        v-model="range"
        selection-mode="range"
        :manual-input="false"
        show-icon
        :aria-label="t('shared.dateRange')"
    />
    <Button :label="t('shared.search')" @click="emit('search')" />
  </div>
</template>

<style scoped>
.range {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}
</style>
