<script setup>
// Label + control + error message. Pass the control in the default slot and use the same id.
// The control should have :aria-invalid="!!error" and :aria-describedby="error ? `${id}-error` : undefined"
defineProps({ id: { type: String, required: true }, label: { type: String, required: true }, error: { type: String, default: '' } })
</script>

<template>
  <div class="field">
    <label :for="id">{{ label }}</label>
    <slot />
    <small v-if="error" :id="`${id}-error`" role="alert" class="error">{{ error }}</small>
  </div>
</template>

<style scoped>
.field { display: grid; gap: 0.35rem; margin-bottom: 1rem; }
label { font-weight: 600; font-size: 0.85rem; }
.error { color: var(--p-red-600); font-weight: 600; }
</style>
