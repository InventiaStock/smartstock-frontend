<script setup>
// Card with a label, a big value and a small hint (dashboard, "this period" totals)
defineProps({
  label: { type: String, required: true },
  value: { type: String, required: true },
  hint: { type: String, default: '' },
})
</script>

<template>
  <div class="summary-card" role="group" :aria-label="label">
    <span class="label">{{ label }}</span>
    <strong class="value">{{ value }}</strong>
    <small v-if="hint" class="hint">{{ hint }}</small>
  </div>
</template>

<style scoped>
.summary-card {
  display: grid;
  gap: 0.2rem;
  background: var(--p-surface-0);
  border: 1px solid var(--p-content-border-color);
  border-radius: 0.9rem;
  padding: 1rem 1.25rem;
}

.label {
  color: var(--p-text-muted-color);
  font-size: 0.85rem;
}

.value {
  font-size: 1.6rem;
  font-weight: 600;
}

.hint {
  color: var(--p-text-muted-color);
}
</style>
