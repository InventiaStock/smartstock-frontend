<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import ProgressBar from 'primevue/progressbar'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import FormField from '../../../shared/presentation/components/form-field.vue'
import PageHeader from '../../../shared/presentation/components/page-header.vue'
import { Product } from '../../domain/model/product.entity.js'
import { useCatalogStore } from '../../application/catalog.store.js'

// US14 · M19 edit product (prices, supplier, threshold). The registered stock is shown but never edited (R17).
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = useCatalogStore()
const id = route.params.id

const form = reactive({
  name: '',
  sku: '',
  salePrice: null,
  purchaseCost: null,
  usualSupplier: '',
  registeredStock: 0,
  minThreshold: null
})

const submitted = ref(false)
const failed = ref(false)

const fieldInvalid = computed(() => ({
  name: !form.name,
  minThreshold:
      form.minThreshold === null ||
      !(form.minThreshold >= 1),
}))

watch(
    () => store.current,
    (p) => {
      if (!p) return

      Object.assign(form, {
        name: p.name,
        sku: p.sku,
        salePrice: p.salePrice,
        purchaseCost: p.purchaseCost,
        usualSupplier: p.usualSupplier,
        registeredStock: p.registeredStock,
        minThreshold: p.minThreshold,
      })
    }
)

onMounted(() => store.fetchProduct(id))

const err = (field) =>
    submitted.value &&
    fieldInvalid.value[field]
        ? t(`catalog.error.${field}`)
        : ''

const describedBy = (field) =>
    err(field)
        ? `${field}-error`
        : undefined

async function submit() {
  submitted.value = true
  failed.value = false

  const current = store.current

  if (
      Object.values(fieldInvalid.value).some(Boolean) ||
      !current
  ) {
    return
  }

  const updated = new Product({
    id: current.id,
    name: form.name.trim(),
    sku: form.sku.trim(),
    category: current.category,
    unitWeight: current.unitWeight,
    salePrice:
        form.salePrice === null
            ? null
            : Number(form.salePrice),
    purchaseCost:
        Number(form.purchaseCost ?? 0),
    usualSupplier:
        form.usualSupplier.trim(),
    registeredStock:
    current.registeredStock,
    minThreshold:
        Number(form.minThreshold),
    maxCapacity:
    current.maxCapacity,
    sensorId:
    current.sensorId,
  })

  const result =
      await store.update(id, updated)

  if (result.ok) {
    router.push('/products')
  } else {
    failed.value = true
  }
}
</script>

<template>
  <section aria-labelledby="product-edit-title">
    <PageHeader
        :title="t('catalog.productEdit.title')"
        title-id="product-edit-title"
    />

    <ProgressBar
        v-if="store.loading && !store.current"
        mode="indeterminate"
        style="height: 6px"
        :aria-label="t('shared.loading')"
    />

    <AlertBanner
        v-if="store.error"
        tone="error"
    >
      {{ t('shared.error') }}
    </AlertBanner>

    <AlertBanner
        v-if="failed"
        tone="error"
    >
      {{ t('catalog.productEdit.failed') }}
    </AlertBanner>

    <form
        v-if="store.current"
        class="ss-card ss-form"
        novalidate
        @submit.prevent="submit"
    >
      <FormField
          id="name"
          :label="t('catalog.field.name')"
          :error="err('name')"
      >
        <InputText
            id="name"
            v-model="form.name"
            :invalid="!!err('name')"
            :aria-invalid="!!err('name')"
            :aria-describedby="describedBy('name')"
            class="ss-field-full"
        />
      </FormField>

      <div class="ss-form-grid">
        <FormField
            id="sku"
            :label="t('catalog.field.sku')"
        >
          <InputText
              id="sku"
              v-model="form.sku"
              class="ss-field-full"
          />
        </FormField>

        <FormField
            id="salePrice"
            :label="t('catalog.field.salePrice')"
        >
          <InputNumber
              v-model="form.salePrice"
              input-id="salePrice"
              :min="0"
              :min-fraction-digits="0"
              :max-fraction-digits="2"
              fluid
          />
        </FormField>

        <FormField
            id="purchaseCost"
            :label="t('catalog.field.purchaseCost')"
        >
          <InputNumber
              v-model="form.purchaseCost"
              input-id="purchaseCost"
              :min="0"
              :min-fraction-digits="0"
              :max-fraction-digits="2"
              fluid
          />
        </FormField>

        <FormField
            id="usualSupplier"
            :label="t('catalog.field.usualSupplier')"
        >
          <InputText
              id="usualSupplier"
              v-model="form.usualSupplier"
              class="ss-field-full"
          />
        </FormField>

        <FormField
            id="registeredStock"
            :label="t('catalog.field.registeredStock')"
        >
          <InputNumber
              v-model="form.registeredStock"
              input-id="registeredStock"
              disabled
              fluid
              :pt="{
              pcInputText: {
                root: {
                  'aria-describedby': 'stock-help'
                }
              }
            }"
          />
        </FormField>

        <FormField
            id="minThreshold"
            :label="t('catalog.field.minThreshold')"
            :error="err('minThreshold')"
        >
          <InputNumber
              v-model="form.minThreshold"
              input-id="minThreshold"
              :min="1"
              :max-fraction-digits="0"
              :invalid="!!err('minThreshold')"
              :pt="{
              pcInputText: {
                root: {
                  'aria-invalid': !!err('minThreshold'),
                  'aria-describedby': describedBy('minThreshold')
                }
              }
            }"
              fluid
          />
        </FormField>
      </div>

      <p
          id="stock-help"
          class="ss-note"
      >
        {{ t('catalog.productEdit.stockHelp') }}
      </p>

      <p class="ss-note">
        {{ t('catalog.productEdit.note') }}
      </p>

      <div class="ss-actions">
        <router-link
            to="/products"
            custom
            v-slot="{ navigate }"
        >
          <Button
              type="button"
              :label="t('shared.cancel')"
              text
              @click="navigate"
          />
        </router-link>

        <Button
            type="submit"
            :label="t('catalog.productNew.save')"
            :loading="store.loading"
        />
      </div>
    </form>
  </section>
</template>