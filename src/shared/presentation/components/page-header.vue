<script setup>
// Page title on the left and the main actions (default slot) on the right
defineProps({
  title: { type: String, required: true },
  subtitle: { type: String, default: '' },
  titleId: { type: String, default: 'page-title' },
})
</script>

<template>
  <header class="page-header">
    <div>
      <h1 :id="titleId">{{ title }}</h1>
      <p v-if="subtitle" class="subtitle">{{ subtitle }}</p>
    </div>

    <div class="actions">
      <slot />
    </div>
  </header>
</template>

<style scoped>
.page-header {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
}

.subtitle {
  margin: 0;
  color: var(--p-text-muted-color);
}

.actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  align-items: center;
}
</style>
