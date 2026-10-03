<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Tag from 'primevue/tag'

// status: pending | received | cancelled | completed | online | disconnected | available | lowStock | healthy | noData | discrepancy
const props = defineProps({ status: { type: String, required: true } })
const { t } = useI18n()
const severity = computed(() => ({
  pending: 'warn', received: 'success', cancelled: 'secondary', completed: 'success',
  online: 'success', disconnected: 'danger', available: 'secondary',
  lowStock: 'danger', healthy: 'success', noData: 'secondary', discrepancy: 'warn',
}[props.status] ?? 'secondary'))
</script>

<template>
  <Tag :severity="severity" :value="t(`shared.status.${status}`)" />
</template>
