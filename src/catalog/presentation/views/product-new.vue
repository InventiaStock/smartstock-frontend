<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import AutoComplete from 'primevue/autocomplete'
import Button from 'primevue/button'
import InputNumber from 'primevue/inputnumber'
import InputText from 'primevue/inputtext'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import FormField from '../../../shared/presentation/components/form-field.vue'
import PageHeader from '../../../shared/presentation/components/page-header.vue'
import { Product } from '../../domain/model/product.entity.js'
import { useCatalogStore } from '../../application/catalog.store.js'

// US13 · M29 new product, M30 missing name or unit weight
const { t } = useI18n()
const router = useRouter()
const store = useCatalogStore()

const form = reactive({
  name: '',
  sku: '',
  category: '',
  unitWeight: null,
  salePrice: null,
  purchaseCost: null,
  usualSupplier: '',
  initialStock: 0,
  minThreshold: 5,
})

const submitted = ref(false)
const serverFields = ref({})
const serverFailed = ref(false)
const suggestions = ref([])

// Form validation rules: required name and category, unit weight >= 0.001,
// threshold >= 1, stock >= 0
const fieldInvalid = computed(() => ({
  name: !form.name,
  category: !form.category,
  unitWeight: form.unitWeight === null || !(form.unitWeight >= 0.001),
  minThreshold: form.minThreshold === null || !(form.minThreshold >= 1),
}))

const formInvalid = computed(
    () =>
        Object.values(fieldInvalid.value).some(Boolean) ||
        (form.initialStock ?? 0) < 0
)

// The banner of M30 shows after a save with invalid fields
const invalid = computed(
    () =>
        submitted.value &&
        (
            formInvalid.value ||
            Object.keys(serverFields.value).length > 0
        )
)

function err(field) {
  if (!submitted.value) return ''

  return fieldInvalid.value[field] || serverFields.value[field]
      ? t(`catalog.error.${field}`)
      : ''
}

const describedBy = (field) =>
    err(field) ? `${field}-error` : undefined

// Accessibility attributes for the input that PrimeVue renders inside InputNumber
const numberPt = (field) => ({
  pcInputText: {
    root: {
      'aria-invalid': !!err(field),
      'aria-describedby': describedBy(field)
    }
  }
})

onMounted(store.fetchProducts)

function search(event) {
  const query = event.query.trim().toLowerCase()

  suggestions.value = store.categories.filter((c) =>
      c.toLowerCase().includes(query)
  )
}

async function submit() {
  submitted.value = true
  serverFields.value = {}
  serverFailed.value = false

  if (formInvalid.value) return

  const product = new Product({
    id: null,
    name: form.name.trim(),
    sku: form.sku.trim(),
    category: form.category.trim(),
    unitWeight: Number(form.unitWeight),
    salePrice:
        form.salePrice === null
            ? null
            : Number(form.salePrice),
    purchaseCost: Number(form.purchaseCost ?? 0),
    usualSupplier: form.usualSupplier.trim(),
    registeredStock: Number(form.initialStock ?? 0),
    minThreshold: Number(form.minThreshold),
    maxCapacity: 100,
    sensorId: null,
  })

  const result = await store.create(product)

  if (result.ok) {
    return router.push(`/products/${result.product.id}`)
  }

  const fields = result.error.errors ?? {}

  const map = {
    nombre: 'name',
    categoria: 'category',
    pesoUnitario: 'unitWeight',
    umbralMinimo: 'minThreshold'
  }

  const marked = Object.keys(fields)
      .map((k) => map[k])
      .filter(Boolean)

  if (
      result.error.code === 'INVALID_PRODUCT' &&
      marked.length
  ) {
    serverFields.value =
        Object.fromEntries(
            marked.map((f) => [f, true])
        )
  } else {
    serverFailed.value = true
  }
}
</script>

<template>
  <section aria-labelledby="product-new-title">
    <PageHeader
        :title="t('catalog.productNew.title')"
        title-id="product-new-title"
    />

    <form
        class="ss-card ss-form"
        novalidate
        @submit.prevent="submit"
    >
      <AlertBanner
          v-if="invalid"
          tone="error"
      >
        {{ t('catalog.productNew.review') }}
      </AlertBanner>

      <AlertBanner
          v-if="serverFailed"
          tone="error"
      >
        {{ t('shared.error') }}
      </AlertBanner>

      <FormField
          id="name"
          :label="t('catalog.field.name')"
          :error="err('name')"
      >
        <InputText
            id="name"
            v-model="form.name"
            :placeholder="t('catalog.field.namePlaceholder')"
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
              placeholder="RICE-1KG"
              class="ss-field-full"
          />
        </FormField>

        <FormField
            id="category"
            :label="t('catalog.field.category')"
            :error="err('category')"
        >
          <AutoComplete
              v-model="form.category"
              input-id="category"
              :suggestions="suggestions"
              dropdown
              :invalid="!!err('category')"
              fluid
              :input-props="{
              'aria-invalid': !!err('category'),
              'aria-describedby': describedBy('category')
            }"
              @complete="search"
          />
        </FormField>

        <FormField
            id="unitWeight"
            :label="t('catalog.field.unitWeight')"
            :error="err('unitWeight')"
        >
          <InputNumber
              v-model="form.unitWeight"
              input-id="unitWeight"
              :min="0"
              :min-fraction-digits="0"
              :max-fraction-digits="3"
              :invalid="!!err('unitWeight')"
              :pt="numberPt('unitWeight')"
              fluid
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
            id="initialStock"
            :label="t('catalog.field.initialStock')"
        >
          <InputNumber
              v-model="form.initialStock"
              input-id="initialStock"
              :min="0"
              :max-fraction-digits="0"
              fluid
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
              :pt="numberPt('minThreshold')"
              fluid
          />
        </FormField>
      </div>

      <p class="ss-note">
        {{ t('catalog.productNew.note') }}
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