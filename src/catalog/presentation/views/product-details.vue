<script setup>
import { onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import Button from 'primevue/button'
import ProgressBar from 'primevue/progressbar'
import { useStockStore } from '../../../inventory/application/stock.store.js'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import Money from '../../../shared/presentation/components/money.vue'
import PageHeader from '../../../shared/presentation/components/page-header.vue'
import StatusTag from '../../../shared/presentation/components/status-tag.vue'
import StockLevelBadge from '../../../shared/presentation/components/stock-level-badge.vue'
import { useCatalogStore } from '../../application/catalog.store.js'

// US06 / US07 / US08 · M28 product details with the sensor reading and the recent readings
const { t, locale } = useI18n()
const route = useRoute()
const catalog = useCatalogStore()
const stock = useStockStore()

// ISO date-time shown as "Oct 4, 14:30" (local time)
const readingDate = (value) => new Intl.DateTimeFormat(locale.value, {
  month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit', hour12: false,
}).format(new Date(value))

function load() {
  catalog.fetchProduct(route.params.id)
  stock.fetchSensorDetail(route.params.id)
}

onMounted(load)
</script>

<template>
  <section aria-labelledby="product-title">
    <PageHeader :title="t('catalog.productDetails.title')" title-id="product-page-title">
      <router-link to="/products" custom v-slot="{ navigate }">
        <Button :label="t('catalog.productDetails.back')" severity="secondary" outlined @click="navigate" />
      </router-link>
      <router-link v-if="catalog.current" :to="`/products/${catalog.current.id}/edit`" custom v-slot="{ navigate }">
        <Button :label="t('catalog.productDetails.edit')" icon="pi pi-pencil" @click="navigate" />
      </router-link>
    </PageHeader>

    <AlertBanner v-if="catalog.error || stock.error" tone="error">
      {{ t('shared.error') }}
      <Button :label="t('shared.retry')" size="small" text @click="load" />
    </AlertBanner>
    <ProgressBar v-if="catalog.loading || stock.loading" mode="indeterminate" :aria-label="t('shared.loading')" />

    <template v-if="catalog.current">
      <div class="ss-card">
        <div class="title">
          <h2 id="product-title" class="h2">{{ catalog.current.name }}</h2>
          <span class="ss-muted">{{ catalog.current.sku }}</span>
          <StockLevelBadge :level="catalog.current.stockLevel" />
        </div>
        <dl class="facts">
          <div><dt>{{ t('catalog.field.category') }}</dt><dd>{{ catalog.current.category }}</dd></div>
          <div><dt>{{ t('catalog.field.unitWeight') }}</dt><dd>{{ catalog.current.unitWeight.toFixed(2) }} kg</dd></div>
          <div><dt>{{ t('catalog.productDetails.maxCapacity') }}</dt><dd>{{ catalog.current.maxCapacity }} {{ t('shared.units') }}</dd></div>
          <div>
            <dt>{{ t('catalog.field.salePrice') }}</dt>
            <dd><Money v-if="catalog.current.salePrice" :amount="catalog.current.salePrice" /><template v-else>{{ t('catalog.productDetails.notSet') }}</template></dd>
          </div>
          <div><dt>{{ t('catalog.field.purchaseCost') }}</dt><dd><Money :amount="catalog.current.purchaseCost" /></dd></div>
          <div><dt>{{ t('catalog.field.minThreshold') }}</dt><dd>{{ catalog.current.minThreshold }} {{ t('shared.units') }}</dd></div>
          <div><dt>{{ t('catalog.field.usualSupplier') }}</dt><dd>{{ catalog.current.usualSupplier || '—' }}</dd></div>
          <div><dt>{{ t('catalog.field.registeredStock') }}</dt><dd>{{ catalog.current.registeredStock }} {{ t('shared.units') }}</dd></div>
        </dl>
      </div>

      <div class="ss-card">
        <h2 class="h2">{{ t('catalog.productDetails.sensorReading') }}</h2>
        <template v-if="stock.sensorDetail">
          <template v-if="stock.sensorDetail.sensor">
            <p><StatusTag :status="stock.sensorDetail.sensor.status" /> <strong>{{ stock.sensorDetail.sensor.code }}</strong></p>
            <p class="big">{{ stock.sensorDetail.sensor.weightKg.toFixed(2) }} kg</p>
            <p>
              ≈ {{ stock.sensorDetail.sensor.units }} {{ t('shared.units') }}
              {{ t('catalog.productDetails.perUnit', { weight: catalog.current.unitWeight.toFixed(2) }) }}
            </p>
            <p v-if="stock.sensorDetail.sensor.minutesSinceReading !== null" class="ss-muted">
              {{ t('catalog.productDetails.lastReading') }} {{ t('shared.minutesAgo', { count: stock.sensorDetail.sensor.minutesSinceReading }) }}
            </p>
            <p class="ss-muted">
              {{ t('catalog.productDetails.alertReference') }}
              {{ t(stock.sensorDetail.sensor.status === 'online' ? 'catalog.productDetails.referenceSensor' : 'catalog.productDetails.referenceRegistered') }}
            </p>
            <div class="row">
              <router-link :to="`/sensors/${stock.sensorDetail.sensor.sensorId}/threshold`" custom v-slot="{ navigate }">
                <Button :label="t('catalog.productDetails.configure')" size="small" severity="secondary" outlined @click="navigate" />
              </router-link>
              <router-link to="/sensors" custom v-slot="{ navigate }">
                <Button :label="t('catalog.productDetails.viewSensor')" size="small" severity="secondary" outlined @click="navigate" />
              </router-link>
            </div>
          </template>
          <template v-else>
            <p class="ss-muted">{{ t('catalog.productDetails.noSensor') }}</p>
            <router-link to="/sensors/link" custom v-slot="{ navigate }">
              <Button :label="t('catalog.productDetails.linkSensor')" size="small" severity="secondary" outlined @click="navigate" />
            </router-link>
          </template>
        </template>
      </div>

      <div v-if="stock.sensorDetail?.readings?.length" class="ss-card">
        <h2 class="h2">{{ t('catalog.productDetails.recent') }}</h2>
        <div v-for="r in stock.sensorDetail.readings" :key="r.id" class="reading">
          <span>{{ readingDate(r.date) }}</span><span>{{ r.weightKg.toFixed(2) }} kg</span><span>{{ r.units }} {{ t('shared.units') }}</span>
        </div>
      </div>
    </template>
  </section>
</template>

<style scoped>
.title { display: flex; gap: 0.75rem; align-items: center; flex-wrap: wrap; margin-bottom: 1rem; }
.h2 { font-size: 1.1rem; margin: 0 0 0.75rem; }
.title .h2 { margin: 0; }
.facts { display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 1rem; margin: 0; }
dt { color: var(--p-text-muted-color); font-size: 0.75rem; text-transform: uppercase; }
dd { margin: 0; font-weight: 600; }
.big { font-size: 1.6rem; font-weight: 600; margin: 0.25rem 0; }
p { margin: 0.25rem 0; }
.row { display: flex; gap: 0.5rem; flex-wrap: wrap; margin-top: 0.75rem; }
.reading { display: grid; grid-template-columns: 1fr 1fr 1fr; padding: 0.4rem 0; border-bottom: 1px solid var(--p-content-border-color); }
</style>
