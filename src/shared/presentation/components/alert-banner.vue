<script setup>
import Message from 'primevue/message'

// Message strip: error (red), success (green) or warning (orange).
// The icon and the text never rely on color alone. PrimeVue Message sets role="alert".
defineProps({
  tone: {
    type: String,
    default: 'error',
    validator: (value) => ['error', 'success', 'warn'].includes(value),
  },
})
</script>

<template>
  <Message class="banner" :severity="tone" :closable="false">
    <slot />
  </Message>
</template>

<style scoped>
.banner {
  margin-bottom: 1rem;
}
</style>

