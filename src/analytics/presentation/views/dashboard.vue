<script setup>
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import { useIamStore } from '../../../iam/application/iam.store.js'
import { formatPen } from '../../../shared/domain/model/money.js'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import EmptyState from '../../../shared/presentation/components/empty-state.vue'
import Money from '../../../shared/presentation/components/money.vue'
import PageHeader from '../../../shared/presentation/components/page-header.vue'
import StockLevelBadge from '../../../shared/presentation/components/stock-level-badge.vue'
import SummaryCard from '../../../shared/presentation/components/summary-card.vue'
import { useAnalyticsStore } from '../../application/analytics.store.js'

// US15 · M17 Dashboard (minimarket) / Home (bodega): sales and purchases of the day, low stock, recent activity
const { t } = useI18n()
const store = useAnalyticsStore()
const iam = useIamStore()
// In bodega the same screen is called Home
const title = computed(() => t(iam.businessType === 'bodega' ? 'shared.menu.home' : 'analytics.dashboard.title'))

onMounted(store.fetchDashboard)
</script>

<template>
  <section aria-labelledby="dashboard-title">
    <PageHeader :title="title" title-id="dashboard-title" />

    <AlertBanner v-if="store.error" tone="error">
      {{ t('shared.error') }}
      <Button :label="t('shared.retry')" size="small" text @click="store.fetchDashboard" />
    </AlertBanner>
    <ProgressBar v-if="store.loading && !store.dashboard" mode="indeterminate" :aria-label="t('shared.loading')" />

    <template v-if="store.dashboard">
      <div class="ss-grid">
        <router-link class="card-link" to="/sales">
          <SummaryCard
            :label="t('analytics.dashboard.salesToday')"
            :value="formatPen(store.dashboard.salesToday.total)"
            :hint="t(store.dashboard.salesToday.count === 1 ? 'analytics.dashboard.saleOne' : 'analytics.dashboard.saleMany', { count: store.dashboard.salesToday.count })"
          />
        </router-link>
        <router-link class="card-link" to="/purchases">
          <SummaryCard
            :label="t('analytics.dashboard.purchasesToday')"
            :value="formatPen(store.dashboard.purchasesToday.total)"
            :hint="t(store.dashboard.purchasesToday.count === 1 ? 'analytics.dashboard.purchaseOne' : 'analytics.dashboard.purchaseMany', { count: store.dashboard.purchasesToday.count })"
          />
        </router-link>
        <router-link class="card-link" to="/alerts">
          <SummaryCard
            :label="t('analytics.dashboard.lowStockAlerts')"
            :value="String(store.dashboard.lowStockAlerts)"
            :hint="t('analytics.dashboard.needsAttention')"
          />
        </router-link>
      </div>

      <div class="two">
        <div class="ss-card">
          <h2 class="h2">{{ t('analytics.dashboard.recent') }}</h2>
          <router-link v-for="a in store.dashboard.recentActivity" :key="a.id" class="line" :to="a.link">
            <span>{{ t(a.type === 'SALE' ? 'analytics.dashboard.sale' : 'analytics.dashboard.purchase') }} {{ a.id }}</span>
            <strong><Money :amount="a.total" /></strong>
          </router-link>
          <EmptyState v-if="!store.dashboard.recentActivity.length" :message="t('analytics.dashboard.noActivity')" />
        </div>

        <div class="ss-card">
          <h2 class="h2">{{ t('analytics.dashboard.stockOverview') }}</h2>
          <router-link v-for="s in store.dashboard.stockOverview" :key="s.productId" class="line" :to="`/products/${s.productId}`">
            <span>{{ s.name }} · {{ s.units }} {{ t('shared.units') }}</span>
            <StockLevelBadge :level="s.level" />
          </router-link>
          <EmptyState v-if="!store.dashboard.stockOverview.length" :message="t('analytics.dashboard.noProducts')" />
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.card-link { text-decoration: none; color: inherit; display: block; }
.two { display: grid; gap: 1rem; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); }
.h2 { font-size: 1.05rem; margin: 0 0 0.75rem; }
.line { display: flex; justify-content: space-between; align-items: center; padding: 0.6rem 0; border-bottom: 1px solid var(--p-content-border-color); color: inherit; text-decoration: none; }
.line:last-child { border-bottom: 0; }
</style>
