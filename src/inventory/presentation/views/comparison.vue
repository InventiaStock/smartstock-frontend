<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import ProgressBar from 'primevue/progressbar'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import EmptyState from '../../../shared/presentation/components/empty-state.vue'
import PageHeader from '../../../shared/presentation/components/page-header.vue'
import StatusTag from '../../../shared/presentation/components/status-tag.vue'
import { useStockStore } from '../../application/stock.store.js'

// US11 / US12 · M39 comparison between the registered stock and the physical stock measured by the sensors
const { t } = useI18n()
const store = useStockStore()

onMounted(store.fetchComparison)
</script>

<template>
  <section aria-labelledby="comparison-title">
    <PageHeader :title="t('inventory.comparison.title')" title-id="comparison-title" />

    <AlertBanner v-if="store.error" tone="error">
      {{ t('shared.error') }}
      <Button :label="t('shared.retry')" size="small" text @click="store.fetchComparison" />
    </AlertBanner>
    <ProgressBar v-if="store.loading" mode="indeterminate" :aria-label="t('shared.loading')" />

    <template v-if="store.comparison">
      <AlertBanner v-if="store.comparison.discrepancies > 0" tone="warn">
        {{ t(store.comparison.discrepancies === 1 ? 'inventory.comparison.differsOne' : 'inventory.comparison.differsMany', { count: store.comparison.discrepancies }) }}
        <router-link to="/alerts" custom v-slot="{ navigate }">
          <Button :label="t('inventory.comparison.viewAlert')" size="small" severity="secondary" outlined @click="navigate" />
        </router-link>
      </AlertBanner>

      <DataTable :value="store.comparison.rows" data-key="productId" size="small">
        <template #empty><EmptyState :message="t('inventory.comparison.empty')" /></template>
        <Column :header="t('inventory.comparison.product')">
          <template #body="{ data }"><strong>{{ data.productName }}</strong></template>
        </Column>
        <Column :header="t('inventory.comparison.registered')">
          <template #body="{ data }">{{ data.registeredStock }} {{ t('shared.units') }}</template>
        </Column>
        <Column :header="t('inventory.comparison.physical')">
          <template #body="{ data }">
            <template v-if="data.weightKg !== null">{{ data.weightKg.toFixed(2) }} kg ≈ {{ data.physicalUnits }} {{ t('shared.units') }}</template>
            <template v-else>{{ t('inventory.comparison.noReading') }}</template>
          </template>
        </Column>
        <Column :header="t('inventory.comparison.difference')">
          <template #body="{ data }">{{ data.differencePct === null ? '—' : data.differencePct.toFixed(1) + '%' }}</template>
        </Column>
        <Column :header="t('inventory.comparison.result')">
          <template #body="{ data }"><StatusTag :status="data.statusKey" /></template>
        </Column>
      </DataTable>
      <p class="ss-note">{{ t('inventory.comparison.formula') }}</p>
      <p class="ss-note">{{ t('inventory.comparison.registeredOnlyNote') }}</p>
    </template>
  </section>
</template>
