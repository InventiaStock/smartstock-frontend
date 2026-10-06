<script setup>
import { onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import { currentMonth } from '../../../shared/domain/model/date-range.js'
import { formatPen } from '../../../shared/domain/model/money.js'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import DateRangeFilter from '../../../shared/presentation/components/date-range-filter.vue'
import EmptyState from '../../../shared/presentation/components/empty-state.vue'
import Money from '../../../shared/presentation/components/money.vue'
import PageHeader from '../../../shared/presentation/components/page-header.vue'
import StatusTag from '../../../shared/presentation/components/status-tag.vue'
import SummaryCard from '../../../shared/presentation/components/summary-card.vue'
import { usePurchasesStore } from '../../application/purchases.store.js'

// US31 · M1 purchase history, M2 no purchases in the period
const { t, locale } = useI18n()
const store = usePurchasesStore()
const range = ref(currentMonth()) // [start, end]

const statusKey = (status) =>
    status === 'RECEIVED'
        ? 'received'
        : status === 'CANCELLED'
            ? 'cancelled'
            : 'pending'

// yyyy-MM-dd shown as a medium date in the current language
const mediumDate = (value) =>
    new Date(
        value.length === 10
            ? `${value}T00:00:00`
            : value
    ).toLocaleDateString(
        locale.value,
        { dateStyle: 'medium' }
    )

const load = () =>
    store.fetchPurchases(range.value)

onMounted(load)
</script>

<template>
  <section aria-labelledby="purchases-title">
    <PageHeader
        :title="t('inventory.purchaseList.title')"
        title-id="purchases-title"
    >
      <router-link
          to="/purchases/suppliers"
          custom
          v-slot="{ navigate }"
      >
        <Button
            :label="t('inventory.purchaseList.suppliers')"
            outlined
            @click="navigate"
        />
      </router-link>

      <router-link
          to="/purchases/new"
          custom
          v-slot="{ navigate }"
      >
        <Button
            :label="t('inventory.purchaseList.new')"
            @click="navigate"
        />
      </router-link>
    </PageHeader>

    <div class="ss-grid">
      <SummaryCard
          :label="t('inventory.purchaseList.period')"
          :value="formatPen(store.total)"
      />
    </div>

    <DateRangeFilter
        v-model="range"
        @search="load"
    />

    <AlertBanner
        v-if="store.error"
        tone="error"
    >
      {{ t('shared.error') }}

      <Button
          :label="t('shared.retry')"
          size="small"
          text
          @click="load"
      />
    </AlertBanner>

    <div class="table-area">
      <DataTable
          v-if="!store.error"
          :value="store.purchases"
          :loading="store.loading"
          data-key="id"
          size="small"
          :table-props="{
          'aria-label':
            t('inventory.purchaseList.title')
        }"
      >
        <template #empty>
          <EmptyState
              :message="`${t('inventory.purchaseList.emptyTitle')} ${t('inventory.purchaseList.emptyText')}`"
          />

          <div class="center">
            <router-link
                to="/purchases/new"
                custom
                v-slot="{ navigate }"
            >
              <Button
                  :label="t('inventory.purchaseList.new')"
                  @click="navigate"
              />
            </router-link>
          </div>
        </template>

        <Column
            :header="t('inventory.purchaseList.date')"
        >
          <template #body="{ data }">
            {{ mediumDate(data.date) }}
          </template>
        </Column>

        <Column
            field="supplierName"
            :header="t('inventory.purchaseList.supplier')"
        />

        <Column
            :header="t('inventory.purchaseList.status')"
        >
          <template #body="{ data }">
            <StatusTag
                :status="statusKey(data.status)"
            />
          </template>
        </Column>

        <Column
            :header="t('inventory.purchaseList.items')"
        >
          <template #body="{ data }">
            {{ data.items.length }}
          </template>
        </Column>

        <Column
            :header="t('inventory.purchaseList.total')"
        >
          <template #body="{ data }">
            <Money :amount="data.total" />
          </template>
        </Column>

        <Column
            :header="t('inventory.purchaseList.receipt')"
        >
          <template #body="{ data }">
            <router-link
                :to="`/purchases/${data.id}`"
            >
              <strong>{{ data.id }}</strong>
            </router-link>
          </template>
        </Column>
      </DataTable>
    </div>

    <p
        v-if="
        !store.loading &&
        !store.error &&
        store.purchases.length
      "
        class="ss-note"
    >
      {{
        t(
            'inventory.purchaseList.showing',
            { count: store.purchases.length }
        )
      }}
    </p>
  </section>
</template>

<style scoped>
.table-area {
  margin-top: 1rem;
}

.center {
  display: flex;
  justify-content: center;
}
</style>