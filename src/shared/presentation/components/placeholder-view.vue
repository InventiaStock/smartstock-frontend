<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useIamStore } from '../../../iam/application/iam.store.js'

// Temporary body for screens that are not implemented yet. Replace it with the real view.
const route = useRoute()
const iam = useIamStore()
const { t } = useI18n()
// In bodega the dashboard is called Home
const titleKey = computed(() =>
  route.name === 'dashboard' && iam.businessType === 'bodega' ? 'shared.menu.home' : route.meta.titleKey)
</script>

<template>
  <section class="ph" aria-labelledby="ph-title">
    <h1 id="ph-title">{{ t(titleKey) }}</h1>
    <p class="muted">{{ t('shared.placeholder.pending') }}</p>
    <dl>
      <dt>{{ t('shared.placeholder.context') }}</dt><dd>{{ route.meta.context }}</dd>
      <dt>{{ t('shared.placeholder.stories') }}</dt><dd>{{ route.meta.stories?.join(', ') }}</dd>
      <dt>{{ t('shared.placeholder.mockups') }}</dt><dd>{{ route.meta.mockups?.join(', ') }}</dd>
    </dl>
    <p class="muted">{{ t('shared.placeholder.hint') }}</p>
  </section>
</template>

<style scoped>
.ph { max-width: 640px; background: var(--p-surface-0); border: 1px dashed var(--p-content-border-color); border-radius: 0.9rem; padding: 1.5rem; }
.muted { color: var(--p-text-muted-color); }
dl { display: grid; grid-template-columns: max-content 1fr; gap: 0.35rem 1rem; }
dt { font-weight: 600; } dd { margin: 0; }
</style>
