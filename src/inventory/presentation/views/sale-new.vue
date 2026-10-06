<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import { formatPen } from '../../../shared/domain/model/money.js'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import PageHeader from '../../../shared/presentation/components/page-header.vue'
import { useSalesStore } from '../../application/sales.store.js'

// US26 · M11 new sale, M12 insufficient stock, M13 product without sale price
const { t } = useI18n()
const router = useRouter()
const store = useSalesStore()

const newRow = () => ({ productId: null, quantity: 1 })
const rows = ref([newRow()])
// null | { kind: 'empty' | 'quantity' | 'generic' } | { kind: 'stock', name, available } | { kind: 'price', name }
const error = ref(null)

const stockError = computed(() => (error.value?.kind === 'stock' ? error.value : null))
const priceError = computed(() => (error.value?.kind === 'price' ? error.value : null))

const optionOf = (row) => store.options.find((o) => o.id === row.productId)

// The total is "—" while some product has no price (M13)
const total = computed(() => {
  const lines = rows.value.map((r) => ({ o: optionOf(r), q: r.quantity })).filter((l) => l.o)
  if (lines.some((l) => !l.o.salePrice)) return null
  return lines.reduce((sum, l) => sum + l.o.salePrice * (l.q ?? 0), 0)
})

onMounted(store.fetchOptions)

const add = () => rows.value.push(newRow())
const remove = (i) => { if (rows.value.length > 1) rows.value.splice(i, 1) }

async function register() {
  error.value = null
  const chosen = rows.value.filter((r) => r.productId !== null)
  if (!chosen.length) return void (error.value = { kind: 'empty' })
  if (chosen.some((r) => !Number.isInteger(r.quantity) || r.quantity < 1)) return void (error.value = { kind: 'quantity' })

  // Same checks the backend does, so the user sees M12 / M13 without waiting (the backend still validates, R13 / R14)
  const noPrice = chosen.map((r) => optionOf(r)).find((o) => !o.salePrice)
  if (noPrice) return void (error.value = { kind: 'price', name: noPrice.name })
  const totals = new Map()
  for (const r of chosen) totals.set(r.productId, (totals.get(r.productId) ?? 0) + r.quantity)
  for (const [id, qty] of totals) {
    const o = store.options.find((x) => x.id === id)
    if (qty > o.stock) return void (error.value = { kind: 'stock', name: o.name, available: o.stock })
  }

  const result = await store.register(chosen.map((r) => ({ productId: r.productId, quantity: r.quantity, unitPrice: optionOf(r).salePrice })))
  if (result.ok) return void router.push(`/sales/${result.id}`) // M14
  const e = result.error
  if (e.code === 'INSUFFICIENT_STOCK') error.value = { kind: 'stock', name: String(e.productoNombre), available: Number(e.available) }
  else if (e.code === 'NO_SALE_PRICE') error.value = { kind: 'price', name: String(e.productoNombre) }
  else error.value = { kind: 'generic' }
  store.fetchOptions() // the stock may have changed
}
</script>

<template>
  <section aria-labelledby="sale-new-title">
    <PageHeader :title="t('inventory.saleNew.title')" title-id="sale-new-title" />

    <div class="ss-card">
      <h2 class="h2">{{ t('inventory.saleNew.items') }}</h2>

      <AlertBanner v-if="error?.kind === 'empty'" tone="error">{{ t('inventory.saleNew.errorEmpty') }}</AlertBanner>
      <AlertBanner v-if="error?.kind === 'quantity'" tone="error">{{ t('inventory.saleNew.errorQuantity') }}</AlertBanner>
      <AlertBanner v-if="error?.kind === 'generic'" tone="error">{{ t('shared.error') }}</AlertBanner>
      <AlertBanner v-if="stockError" tone="error">
        {{ t('inventory.saleNew.errorStock', { name: stockError.name, available: stockError.available }) }}
      </AlertBanner>
      <AlertBanner v-if="priceError" tone="error">
        <strong>{{ t('inventory.saleNew.errorPrice', { name: priceError.name }) }}</strong>
        <span> {{ t('inventory.saleNew.errorPriceHelp') }} </span>
        <router-link to="/products" custom v-slot="{ navigate }">
          <Button :label="t('inventory.saleNew.openCatalog')" variant="outlined" size="small" @click="navigate" />
        </router-link>
      </AlertBanner>

      <div v-for="(row, i) in rows" :key="i" class="row">
        <div class="cell">
          <label class="sr-only" :for="`product-${i}`">{{ t('inventory.saleNew.product') }}</label>
          <Select
            v-model="row.productId" :input-id="`product-${i}`" :options="store.options" option-label="name" option-value="id"
            :placeholder="t('inventory.saleNew.choose')" show-clear class="ss-field-full"
          />
        </div>
        <div class="cell">
          <label class="sr-only" :for="`qty-${i}`">{{ t('inventory.saleNew.qty') }}</label>
          <InputNumber v-model="row.quantity" :input-id="`qty-${i}`" :min="1" :step="1" :use-grouping="false" fluid />
        </div>
        <template v-if="optionOf(row)">
          <span class="info">
            <template v-if="optionOf(row).salePrice">{{ t('inventory.saleNew.price') }} {{ formatPen(optionOf(row).salePrice) }}</template>
            <template v-else>{{ t('inventory.saleNew.priceNotSet') }}</template>
          </span>
          <span class="info">{{ t('inventory.saleNew.stock', { count: optionOf(row).stock }) }}</span>
          <strong class="sub">{{ optionOf(row).salePrice ? formatPen(optionOf(row).salePrice * (row.quantity ?? 0)) : '—' }}</strong>
        </template>
        <template v-else>
          <span class="info" /><span class="info" /><strong class="sub">—</strong>
        </template>
        <Button
          type="button" icon="pi pi-times" severity="secondary" text rounded
          :aria-label="t('inventory.saleNew.remove')" @click="remove(i)"
        />
      </div>

      <Button type="button" :label="t('inventory.saleNew.add')" variant="outlined" @click="add" />

      <div class="total" aria-live="polite">
        <span>{{ t('inventory.saleNew.total') }}</span><strong>{{ total === null ? '—' : formatPen(total) }}</strong>
      </div>
    </div>

    <div class="ss-actions">
      <router-link to="/sales" custom v-slot="{ navigate }">
        <Button type="button" :label="t('shared.cancel')" text @click="navigate" />
      </router-link>
      <Button type="button" :label="t('inventory.saleNew.register')" :loading="store.loading" @click="register" />
    </div>
  </section>
</template>

<style scoped>
.h2 { font-size: 1rem; margin: 0 0 1rem; }
.row { display: grid; grid-template-columns: minmax(160px, 2fr) 110px 1fr 1fr 90px 48px; gap: 0.5rem; align-items: center; margin-bottom: 0.75rem; }
.info { color: var(--p-text-muted-color); font-size: 0.85rem; }
.sub { text-align: right; }
.total { display: flex; justify-content: space-between; margin-top: 1rem; padding-top: 1rem; border-top: 1px solid var(--p-content-border-color); font-size: 1.1rem; }
@media (max-width: 768px) { .row { grid-template-columns: 1fr 110px; } }
</style>
