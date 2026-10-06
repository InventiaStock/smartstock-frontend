<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Select from 'primevue/select'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import FormField from '../../../shared/presentation/components/form-field.vue'
import PageHeader from '../../../shared/presentation/components/page-header.vue'
import { useDevicesStore } from '../../application/devices.store.js'

// US04 · M32 link sensor, M33 sensor already in use (R9)
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useDevicesStore()

const sensorId = ref(null)
const productId = ref(null)
// null | { kind: 'inUse', productName } | { kind: 'productHasSensor' } | { kind: 'missing' } | { kind: 'generic' }
const error = ref(null)

const sensorOptions = computed(() =>
    store.sensors.map((s) => ({
      id: s.id,
      label: `${s.code} · ${s.isAvailable ? t('shared.status.available') : t('devices.sensorLink.linkedTo', { name: s.productName })}`,
    })),
)
const productOptions = computed(() =>
    store.products.map((p) => ({
      id: p.id, hasSensor: p.hasSensor,
      label: p.hasSensor ? `${p.name} · ${t('devices.sensorLink.hasSensor')}` : p.name,
    })),
)

const sensor = computed(() => store.sensors.find((s) => s.id === sensorId.value))
const product = computed(() => store.products.find((p) => p.id === productId.value))

// The initial reading is only read from an available sensor (M32); a used sensor shows "—" (M33)
const initial = computed(() => {
  const s = sensor.value
  if (!s || !s.isAvailable) return null
  const p = product.value
  return { kg: s.weightKg, units: p && p.unitWeight > 0 ? Math.round(s.weightKg / p.unitWeight) : null }
})

const sensorError = computed(() => {
  const e = error.value
  if (e?.kind === 'inUse') return t('devices.sensorLink.inUseField', { name: e.productName })
  return e?.kind === 'missing' && !sensorId.value ? t('devices.sensorLink.required') : ''
})
const productError = computed(() => {
  const e = error.value
  if (e?.kind === 'productHasSensor') return t('devices.sensorLink.productHasSensor')
  return e?.kind === 'missing' && !productId.value ? t('devices.sensorLink.required') : ''
})

onMounted(() => {
  store.fetchSensors()
  store.fetchLinkProducts()
  // ?sensorId=4 preselects the sensor (the "Link" button of M31)
  const preset = Number(route.query.sensorId)
  if (preset) sensorId.value = preset
})

async function submit() {
  if (!sensorId.value || !productId.value) {
    error.value = { kind: 'missing' }
    return
  }
  const result = await store.link(sensorId.value, productId.value)
  if (result.ok) return router.push('/sensors') // M31 updated
  const code = result.error.code
  if (code === 'SENSOR_IN_USE') error.value = { kind: 'inUse', productName: String(result.error.productoNombre ?? '') } // R9
  else if (code === 'PRODUCT_HAS_SENSOR') error.value = { kind: 'productHasSensor' }
  else error.value = { kind: 'generic' }
}
</script>

<template>
  <section aria-labelledby="link-title">
    <PageHeader :title="t('devices.sensorLink.title')" title-id="link-title" />

    <form class="ss-card ss-form" novalidate @submit.prevent="submit">
      <AlertBanner v-if="error?.kind === 'inUse'" tone="error">{{ t('devices.sensorLink.inUse') }}</AlertBanner>
      <AlertBanner v-if="error?.kind === 'generic'" tone="error">{{ t('shared.error') }}</AlertBanner>

      <FormField id="sensor" :label="t('devices.sensorLink.sensor')" :error="sensorError">
        <Select
            v-model="sensorId" input-id="sensor" :options="sensorOptions" option-label="label" option-value="id"
            :placeholder="t('devices.sensorLink.chooseSensor')" :invalid="!!sensorError" class="ss-field-full"
            :aria-invalid="!!sensorError" :aria-describedby="sensorError ? 'sensor-error' : undefined" @change="error = null"
        />
      </FormField>

      <FormField id="product" :label="t('devices.sensorLink.product')" :error="productError">
        <Select
            v-model="productId" input-id="product" :options="productOptions" option-label="label" option-value="id"
            option-disabled="hasSensor" :placeholder="t('devices.sensorLink.chooseProduct')" :invalid="!!productError" class="ss-field-full"
            :aria-invalid="!!productError" :aria-describedby="productError ? 'product-error' : undefined" @change="error = null"
        />
      </FormField>

      <div class="reading" role="status" aria-live="polite">
        <strong>{{ t('devices.sensorLink.initialReading') }}</strong>
        <template v-if="initial">
          <span class="big">{{ initial.kg.toFixed(2) }} kg</span>
          <span>≈ {{ initial.units ?? '—' }} {{ t('shared.units') }}</span>
          <small class="ss-note">{{ t('devices.sensorLink.referenceNote') }}</small>
        </template>
        <template v-else>
          <span class="big">—</span>
          <small class="ss-note">{{ t('devices.sensorLink.chooseToRead') }}</small>
        </template>
      </div>

      <div class="ss-actions">
        <router-link to="/sensors" custom v-slot="{ navigate }">
          <Button type="button" :label="t('shared.cancel')" text @click="navigate" />
        </router-link>
        <Button type="submit" :label="t('devices.sensorLink.submit')" :loading="store.loading" />
      </div>
    </form>
  </section>
</template>

<style scoped>
.reading { display: grid; gap: 0.25rem; background: var(--p-primary-50); border-radius: 0.7rem; padding: 0.75rem 1rem; }
.big { font-size: 1.4rem; font-weight: 600; }
</style>