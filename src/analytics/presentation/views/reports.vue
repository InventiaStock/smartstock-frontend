<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import ProgressBar from 'primevue/progressbar'
import { currentMonth } from '../../../shared/domain/model/date-range.js'
import { formatPen } from '../../../shared/domain/model/money.js'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import DateRangeFilter from '../../../shared/presentation/components/date-range-filter.vue'
import EmptyState from '../../../shared/presentation/components/empty-state.vue'
import PageHeader from '../../../shared/presentation/components/page-header.vue'
import SummaryCard from '../../../shared/presentation/components/summary-card.vue'
import { useAnalyticsStore } from '../../application/analytics.store.js'

// US25 · M18 reports: sales, purchases and stock movements of the period (minimarket only)
const { t, locale } = useI18n()
const store = useAnalyticsStore()
const range = ref(currentMonth())

const load = () => store.fetchReport(range.value)
// yyyy-MM-dd is shown as a local date (no UTC shift)
const mediumDate = (value) => {
  const [y, m, day] = String(value).slice(0, 10).split('-').map(Number)
  return new Intl.DateTimeFormat(locale.value, { dateStyle: 'medium' }).format(new Date(y, m - 1, day))
}
const signed = (m) => `${m.signedQuantity > 0 ? '+' : ''}${m.signedQuantity}`

onMounted(load)
</script>

<template>
  <section aria-labelledby="reports-title">
    <PageHeader :title="t('analytics.reports.title')" title-id="reports-title" />
    <DateRangeFilter v-model="range" @search="load" />

    <AlertBanner v-if="store.error" tone="error">
      {{ t('shared.error') }}
      <Button :label="t('shared.retry')" size="small" text @click="load" />
    </AlertBanner>
    <ProgressBar v-if="store.loading" mode="indeterminate" :aria-label="t('shared.loading')" />

    <template v-if="store.report">
      <div class="ss-grid cards">
        <SummaryCard :label="t('analytics.reports.sales')" :value="formatPen(store.report.salesTotal)" />
        <SummaryCard :label="t('analytics.reports.purchases')" :value="formatPen(store.report.purchasesTotal)" />
        <SummaryCard :label="t('analytics.reports.movements')" :value="String(store.report.movements.length)" />
      </div>

      <h2 class="h2">{{ t('analytics.reports.summary') }}</h2>
      <DataTable :value="store.report.movements" data-key="id" size="small">
        <template #empty><EmptyState :message="t('analytics.reports.empty')" /></template>
        <Column :header="t('analytics.reports.type')">
          <template #body="{ data }"><strong>{{ data.type }}</strong></template>
        </Column>
        <Column field="productName" :header="t('analytics.reports.product')" />
        <Column :header="t('analytics.reports.quantity')">
          <template #body="{ data }">{{ signed(data) }}</template>
        </Column>
        <Column field="sourceId" :header="t('analytics.reports.source')" />
        <Column :header="t('analytics.reports.date')">
          <template #body="{ data }">{{ mediumDate(data.date) }}</template>
        </Column>
      </DataTable>
      <p v-for="id in store.report.pendingPurchases" :key="id" class="ss-note">{{ t('analytics.reports.pending', { id }) }}</p>
    </template>
  </section>
</template>

<style scoped>
.h2 { font-size: 1.05rem; margin: 1rem 0 0.75rem; }
.cards { margin-top: 1rem; }
</style>
