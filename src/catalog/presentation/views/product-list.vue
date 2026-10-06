<script setup>
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import Select from 'primevue/select'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import EmptyState from '../../../shared/presentation/components/empty-state.vue'
import PageHeader from '../../../shared/presentation/components/page-header.vue'
import StatusTag from '../../../shared/presentation/components/status-tag.vue'
import StockLevelBadge from '../../../shared/presentation/components/stock-level-badge.vue'
import { useCatalogStore } from '../../application/catalog.store.js'

// US08 · M27 products: registered stock, stock level (online sensor first) and sensor state
const { t } = useI18n()
const store = useCatalogStore()
const query = ref('')
const level = ref('all') // 'all' | 'lowStock' | 'healthy'

const levelOptions = computed(() => [
  { value: 'all', label: t('catalog.productList.levelAll') },
  { value: 'lowStock', label: t('shared.status.lowStock') },
  { value: 'healthy', label: t('shared.status.healthy') },
])

// Search by name or SKU + filter by stock level
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase()
  return store.products.filter((p) =>
    (!q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q)) &&
    (level.value === 'all' || p.stockLevel === level.value))
})

onMounted(store.fetchProducts)
</script>

<template>
  <section aria-labelledby="products-title">
    <PageHeader :title="t('catalog.productList.title')" title-id="products-title">
      <router-link to="/products/new" custom v-slot="{ navigate }">
        <Button :label="t('catalog.productList.new')" icon="pi pi-plus" @click="navigate" />
      </router-link>
    </PageHeader>

    <div class="filters" role="search">
      <div class="field">
        <label class="sr-only" for="search">{{ t('catalog.productList.searchLabel') }}</label>
        <InputText id="search" v-model="query" type="search" fluid :placeholder="t('catalog.productList.search')" />
      </div>
      <div class="field">
        <label class="sr-only" for="level">{{ t('catalog.productList.level') }}</label>
        <Select
          v-model="level" input-id="level" :options="levelOptions" option-label="label" option-value="value"
          fluid :aria-label="t('catalog.productList.level')"
        />
      </div>
    </div>

    <AlertBanner v-if="store.error" tone="error">
      {{ t('shared.error') }}
      <Button :label="t('shared.retry')" size="small" text @click="store.fetchProducts" />
    </AlertBanner>

    <DataTable :value="filtered" :loading="store.loading" data-key="id" size="small">
      <template #empty><EmptyState v-if="!store.loading && !store.error" :message="t('catalog.list.empty')" /></template>
      <Column :header="t('catalog.list.name')">
        <template #body="{ data }"><strong>{{ data.name }}</strong><br /><small class="ss-muted">{{ data.sku }}</small></template>
      </Column>
      <Column field="category" :header="t('catalog.list.category')" />
      <Column :header="t('catalog.list.stock')">
        <template #body="{ data }">{{ data.registeredStock }} {{ t('shared.units') }}</template>
      </Column>
      <Column :header="t('catalog.list.level')">
        <template #body="{ data }"><StockLevelBadge :level="data.stockLevel" /></template>
      </Column>
      <Column :header="t('catalog.list.sensor')">
        <template #body="{ data }"><StatusTag :status="data.sensorStatus === 'none' ? 'notLinked' : data.sensorStatus" /></template>
      </Column>
      <Column header="">
        <template #body="{ data }">
          <router-link :to="`/products/${data.id}`" custom v-slot="{ navigate }">
            <Button :label="t('shared.details')" size="small" severity="secondary" outlined @click="navigate" />
          </router-link>
        </template>
      </Column>
    </DataTable>
    <p v-if="filtered.length" class="ss-note">
      {{ t('catalog.productList.note') }}
      {{ t('catalog.productList.showing', { shown: filtered.length, total: store.products.length }) }}
    </p>
  </section>
</template>

<style scoped>
.filters { display: flex; flex-wrap: wrap; gap: 0.75rem; margin-bottom: 1rem; }
.field { min-width: 220px; }
</style>
