<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import Money from '../../../shared/presentation/components/money.vue'
import PageHeader from '../../../shared/presentation/components/page-header.vue'
import { useSalesStore } from '../../application/sales.store.js'

// US28 · M14 sale details with its stock movements
const { t, locale } = useI18n()
const route = useRoute()
const store = useSalesStore()

const mediumDate = (iso) => {
  const [y, m, d] = String(iso).split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(locale.value, { dateStyle: 'medium' })
}

const load = () => store.fetchSale(String(route.params.id))
onMounted(load)
</script>

<template>
  <section aria-labelledby="sale-title">
    <PageHeader :title="t('inventory.saleDetails.title')">
      <router-link to="/sales" custom v-slot="{ navigate }">
        <Button :label="t('inventory.saleDetails.back')" variant="outlined" @click="navigate" />
      </router-link>
    </PageHeader>

    <AlertBanner v-if="store.error" tone="error">
      {{ t('shared.error') }}
      <Button :label="t('shared.retry')" size="small" text @click="load" />
    </AlertBanner>
    <ProgressBar v-if="store.loading" mode="indeterminate" class="progress" :aria-label="t('shared.loading')" />

    <template v-if="store.current">
      <div class="ss-card">
        <h2 id="sale-title" class="h2">{{ t('inventory.saleDetails.sale') }} {{ store.current.id }}</h2>
        <dl class="meta">
          <div><dt>{{ t('inventory.saleList.date') }}</dt><dd>{{ mediumDate(store.current.date) }}</dd></div>
          <div><dt>{{ t('inventory.saleList.total') }}</dt><dd><Money :amount="store.current.total" /></dd></div>
        </dl>
      </div>

      <div class="ss-card">
        <h2 class="h2">{{ t('inventory.saleDetails.products') }}</h2>
        <div v-for="item in store.current.items" :key="item.productId" class="line">
          <span>{{ item.productName }}</span>
          <span class="ss-muted">{{ item.quantity }} × <Money :amount="item.unitPrice" /></span>
          <strong><Money :amount="item.subtotal" /></strong>
        </div>
      </div>

      <div class="ss-card">
        <h2 class="h2">{{ t('inventory.saleDetails.movements') }}</h2>
        <div v-for="m in store.current.movements" :key="m.id" class="line">
          <strong class="tag">{{ m.type }}</strong>
          <span>{{ m.productName }}</span>
          <span>{{ m.signedQuantity > 0 ? '+' : '' }}{{ m.signedQuantity }} {{ t('shared.units') }}</span>
        </div>
        <p v-if="!store.current.movements.length" class="ss-muted">{{ t('inventory.saleDetails.noMovements') }}</p>
      </div>
    </template>
  </section>
</template>

<style scoped>
.h2 { font-size: 1.05rem; margin: 0 0 0.75rem; }
.progress { height: 0.35rem; margin: 1rem 0; }
.meta { display: flex; gap: 2rem; margin: 0; }
dt { color: var(--p-text-muted-color); font-size: 0.8rem; text-transform: uppercase; }
dd { margin: 0; font-weight: 600; }
.line { display: grid; grid-template-columns: 1fr 1fr 120px; gap: 0.5rem; padding: 0.4rem 0; }
.line strong:last-child { text-align: right; }
.tag { background: var(--p-surface-100); border-radius: 0.4rem; padding: 0 0.5rem; width: max-content; }
</style>
