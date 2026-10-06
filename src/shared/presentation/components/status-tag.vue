<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Tag from 'primevue/tag'

// status: pending | received | cancelled | completed | online | disconnected |
// available | notLinked | lowStock | healthy | noData | discrepancy | match |
// registeredOnly | active | resolved | inProgress
const props = defineProps({
  status: { type: String, required: true },
})

const { t } = useI18n()

const severity = computed(() => ({
  pending: 'warn',
  received: 'success',
  cancelled: 'secondary',
  completed: 'success',
  online: 'success',
  disconnected: 'danger',
  available: 'secondary',
  lowStock: 'danger',
  healthy: 'success',
  noData: 'secondary',
  discrepancy: 'warn',
  notLinked: 'secondary',
  match: 'success',
  registeredOnly: 'secondary',
  active: 'danger',
  resolved: 'success',
  inProgress: 'warn',
}[props.status] ?? 'secondary'))
</script>

<template>
  <Tag :severity="severity" :value="t(`shared.status.${status}`)" />
</template>