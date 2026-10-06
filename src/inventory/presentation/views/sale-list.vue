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
import Money from '../../../shared/presentation/components/money.vue'
import PageHeader from '../../../shared/presentation/components/page-header.vue'
import SummaryCard from '../../../shared/presentation/components/summary-card.vue'
import { useSalesStore } from '../../application/sales.store.js'

// US27 · M9 sales history, M10 no sales in the period
const { t, locale } = useI18n()
const store = useSalesStore()

const range = ref(currentMonth())

// 'yyyy-MM-dd' shown as a medium date in the current language
const mediumDate = (iso) => {
  const [y, m, d] = String(iso).split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(locale.value, { dateStyle: 'medium' })
}

function load() {
  store.fetchSales(range.value)
}

onMounted(load)
</script>

<template>
  <section aria-labelledby="sales-title">
    <PageHeader :title="t('inventory.saleList.title')" title-id="sales-title">
      <router-link to="/sales/new" custom v-slot="{ navigate }">
        <Button :label="t('inventory.saleList.new')" @click="navigate" />
      </router-link>
    </PageHeader>

    <div class="ss-grid">
      <SummaryCard :label="t('inventory.saleList.period')" :value="formatPen(store.total)" />
    </div>
    <DateRangeFilter v-model="range" @search="load" />

    <AlertBanner v-if="store.error" tone="error">
      {{ t('shared.error') }}
      <Button :label="t('shared.retry')" size="small" text @click="load" />
    </AlertBanner>
    <ProgressBar v-if="store.loading" mode="indeterminate" class="progress" :aria-label="t('shared.loading')" />

    <template v-if="!store.loading && !store.error">
      <DataTable v-if="store.sales.length" :value="store.sales" data-key="id" size="small" class="table">
        <Column :header="t('inventory.saleList.receipt')">
          <template #body="{ data }"><strong>{{ data.id }}</strong></template>
        </Column>
        <Column :header="t('inventory.saleList.date')">
          <template #body="{ data }">{{ mediumDate(data.date) }}</template>
        </Column>
        <Column :header="t('inventory.saleList.items')">
          <template #body="{ data }">{{ data.items.length }}</template>
        </Column>
        <Column :header="t('inventory.saleList.total')">
          <template #body="{ data }"><Money :amount="data.total" /></template>
        </Column>
        <Column>
          <template #body="{ data }">
            <router-link :to="`/sales/${data.id}`" custom v-slot="{ navigate }">
              <Button :label="t('inventory.saleList.receipt')" variant="outlined" size="small" @click="navigate" />
            </router-link>
          </template>
        </Column>
      </DataTable>
      <template v-else>
        <EmptyState :message="`${t('inventory.saleList.emptyTitle')} ${t('inventory.saleList.emptyText')}`" />
        <div class="center">
          <router-link to="/sales/new" custom v-slot="{ navigate }">
            <Button :label="t('inventory.saleList.new')" @click="navigate" />
          </router-link>
        </div>
      </template>
    </template>
  </section>
</template>

<style scoped>
.center { display: flex; justify-content: center; }
.progress { height: 0.35rem; margin: 1rem 0; }
.table { margin-top: 1rem; }
</style>
