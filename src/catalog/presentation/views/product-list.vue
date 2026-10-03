<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import StockLevelBadge from '../../../shared/presentation/components/stock-level-badge.vue'
import EmptyState from '../../../shared/presentation/components/empty-state.vue'
import { useCatalogStore } from '../../application/catalog.store.js'

const { t } = useI18n()
const store = useCatalogStore()
onMounted(store.fetchProducts)
</script>

<template>
  <section aria-labelledby="products-title">
    <h1 id="products-title">{{ t('catalog.productList.title') }}</h1>
    <p class="hint">US08 · M27 (reference view: copy this pattern in the other contexts)</p>
    <p v-if="store.error" role="alert" class="error">
      {{ t('shared.error') }}
      <Button :label="t('shared.retry')" size="small" text @click="store.fetchProducts" />
    </p>
    <DataTable :value="store.products" :loading="store.loading" data-key="id" size="small">
      <template #empty><empty-state :message="t('catalog.list.empty')" /></template>
      <Column field="name" :header="t('catalog.list.name')" />
      <Column field="category" :header="t('catalog.list.category')" />
      <Column :header="t('catalog.list.stock')">
        <template #body="{ data }">{{ data.registeredStock }} {{ t('catalog.list.units') }}</template>
      </Column>
      <Column :header="t('catalog.list.level')">
        <template #body="{ data }"><stock-level-badge :level="data.stockLevel" /></template>
      </Column>
    </DataTable>
  </section>
</template>

<style scoped>
.hint { color: var(--p-text-muted-color); }
.error { color: var(--p-red-600); }
</style>
