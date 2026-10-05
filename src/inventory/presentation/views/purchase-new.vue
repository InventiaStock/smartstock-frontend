<script setup>
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import DatePicker from 'primevue/datepicker'
import InputNumber from 'primevue/inputnumber'
import Select from 'primevue/select'
import { toIsoDate } from '../../../shared/domain/model/date-range.js'
import { formatPen } from '../../../shared/domain/model/money.js'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import FormField from '../../../shared/presentation/components/form-field.vue'
import PageHeader from '../../../shared/presentation/components/page-header.vue'
import { usePurchasesStore } from '../../application/purchases.store.js'

// US30 / US32 · M3 new purchase, M4 without products, M16 new purchase prefilled from a low stock alert
// The alert sends ?productId=1&quantity=10&needId=1 (read from the route query)
const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const store = usePurchasesStore()

// Prefill (M16)
const queryProductId = computed(() => Number(route.query.productId))
const queryQuantity = computed(() => Number(route.query.quantity))
const needId = computed(() =>
    route.query.needId
        ? String(route.query.needId)
        : undefined
)

const supplierId = ref(null)
const date = ref(new Date())
const rows = ref([])

// null | 'empty' | 'supplier' | 'quantity' | 'generic'
const error = ref(null)

const total = computed(() =>
    rows.value.reduce(
        (sum, r) =>
            sum +
            (r.quantity ?? 0) *
            (r.unitCost ?? 0),
        0
    )
)

let prefilled = false

const supplierOptions = computed(() =>
    store.suppliers.map((s) => ({
      id: s.id,
      name: s.name
    }))
)

const productOptions = computed(() =>
    store.options.map((o) => ({
      id: o.id,
      name: o.name
    }))
)

// Prefills the product, the quantity and the usual supplier once the catalog and the suppliers are loaded
watch(
    [
      () => store.options,
      () => store.suppliers
    ],
    ([options, suppliers]) => {
      if (
          prefilled ||
          !queryProductId.value ||
          !options.length ||
          !suppliers.length
      ) {
        return
      }

      const option = options.find(
          (o) => o.id === queryProductId.value
      )

      if (!option) return

      prefilled = true

      rows.value = [
        reactive({
          productId: option.id,
          quantity:
              queryQuantity.value || 1,
          unitCost:
          option.purchaseCost
        })
      ]

      const usual = suppliers.find(
          (s) =>
              s.name ===
              option.usualSupplier
      )

      if (usual) {
        supplierId.value = usual.id
      }
    },
    { immediate: true }
)

onMounted(() => {
  store.fetchSuppliers()
  store.fetchOptions()
})

function add() {
  rows.value.push({
    productId: null,
    quantity: 1,
    unitCost: 0
  })

  error.value = null
}

const remove = (i) =>
    rows.value.splice(i, 1)

function setProduct(i, value) {
  const option = store.options.find(
      (o) => o.id === value
  )

  rows.value[i].productId =
      option ? option.id : null

  if (option) {
    rows.value[i].unitCost =
        option.purchaseCost
  }
}

const subtotal = (row) =>
    formatPen(
        (row.quantity ?? 0) *
        (row.unitCost ?? 0)
    )

async function register() {
  error.value = null

  const chosen =
      rows.value.filter(
          (r) => r.productId !== null
      )

  if (!chosen.length) {
    error.value = 'empty'
    return
  }

  if (!supplierId.value) {
    error.value = 'supplier'
    return
  }

  if (
      chosen.some(
          (r) =>
              !Number.isInteger(r.quantity) ||
              r.quantity < 1
      )
  ) {
    error.value = 'quantity'
    return
  }

  const items = chosen.map((r) => ({
    productId: r.productId,
    quantity: r.quantity,
    unitCost: r.unitCost ?? 0
  }))

  const result =
      await store.register(
          supplierId.value,
          toIsoDate(
              date.value ??
              new Date()
          ),
          needId.value
              ? Number(needId.value)
              : null,
          items
      )

  if (result.ok) {
    router.push(
        `/purchases/${result.value}`
    )
  } else {
    error.value = 'generic'
  }
}
</script>

<template>
  <section aria-labelledby="purchase-new-title">
    <PageHeader
        :title="t('inventory.purchaseNew.title')"
        title-id="purchase-new-title"
    />

    <div class="ss-card">
      <AlertBanner
          v-if="needId"
          tone="warn"
      >
        {{ t('inventory.purchaseNew.fromAlert') }}
      </AlertBanner>

      <AlertBanner
          v-if="error === 'empty'"
          tone="error"
      >
        {{ t('inventory.purchaseNew.errorEmpty') }}
      </AlertBanner>

      <AlertBanner
          v-if="error === 'quantity'"
          tone="error"
      >
        {{ t('inventory.purchaseNew.errorQuantity') }}
      </AlertBanner>

      <AlertBanner
          v-if="error === 'generic'"
          tone="error"
      >
        {{ t('shared.error') }}
      </AlertBanner>

      <div class="ss-form-grid">
        <FormField
            id="supplier"
            :label="t('inventory.purchaseNew.supplier')"
            :error="
            error === 'supplier'
              ? t('inventory.purchaseNew.errorSupplier')
              : ''
          "
        >
          <Select
              v-model="supplierId"
              input-id="supplier"
              :options="supplierOptions"
              option-label="name"
              option-value="id"
              :placeholder="t('inventory.purchaseNew.chooseSupplier')"
              :invalid="error === 'supplier'"
              class="ss-field-full"
              :aria-invalid="error === 'supplier'"
              :aria-describedby="
              error === 'supplier'
                ? 'supplier-error'
                : undefined
            "
              @change="error = null"
          />
        </FormField>

        <FormField
            id="date"
            :label="t('inventory.purchaseNew.date')"
        >
          <DatePicker
              v-model="date"
              input-id="date"
              date-format="yy-mm-dd"
              show-icon
              fluid
          />
        </FormField>
      </div>

      <router-link
          to="/purchases/suppliers"
          class="ss-note"
      >
        {{ t('inventory.purchaseNew.newSupplier') }}
      </router-link>

      <h2 class="h2">
        {{ t('inventory.purchaseNew.products') }}
      </h2>

      <div
          v-for="(row, i) in rows"
          :key="i"
          class="row"
      >
        <div>
          <label
              class="sr-only"
              :for="`product-${i}`"
          >
            {{ t('inventory.purchaseNew.product') }}
          </label>

          <Select
              :model-value="row.productId"
              :input-id="`product-${i}`"
              :options="productOptions"
              option-label="name"
              option-value="id"
              :placeholder="t('inventory.purchaseNew.chooseProduct')"
              class="ss-field-full"
              @update:model-value="setProduct(i, $event)"
          />
        </div>

        <div>
          <label
              class="sr-only"
              :for="`qty-${i}`"
          >
            {{ t('inventory.purchaseNew.qty') }}
          </label>

          <InputNumber
              v-model="row.quantity"
              :input-id="`qty-${i}`"
              :min="1"
              :max-fraction-digits="0"
              fluid
          />
        </div>

        <div>
          <label
              class="sr-only"
              :for="`cost-${i}`"
          >
            {{ t('inventory.purchaseNew.unitCost') }}
          </label>

          <InputNumber
              v-model="row.unitCost"
              :input-id="`cost-${i}`"
              :min="0"
              :min-fraction-digits="0"
              :max-fraction-digits="2"
              fluid
          />
        </div>

        <strong class="sub">
          {{ subtotal(row) }}
        </strong>

        <Button
            icon="pi pi-times"
            text
            rounded
            severity="secondary"
            type="button"
            :aria-label="t('inventory.purchaseNew.remove')"
            @click="remove(i)"
        />
      </div>

      <p
          v-if="!rows.length"
          class="ss-muted"
      >
        {{ t('inventory.purchaseNew.noProducts') }}
      </p>

      <Button
          type="button"
          :label="t('inventory.purchaseNew.add')"
          outlined
          @click="add"
      />

      <div class="total">
        <span>
          {{ t('inventory.purchaseNew.total') }}
        </span>

        <strong>
          {{ formatPen(total) }}
        </strong>
      </div>
    </div>

    <div class="ss-actions">
      <router-link
          :to="needId ? '/alerts' : '/purchases'"
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
          type="button"
          :label="t('inventory.purchaseNew.register')"
          :loading="store.loading"
          @click="register"
      />
    </div>
  </section>
</template>

<style scoped>
.h2 {
  font-size: 1rem;
  margin: 1.25rem 0 0.75rem;
}

.row {
  display: grid;
  grid-template-columns:
    minmax(160px, 2fr)
    110px
    130px
    110px
    48px;
  gap: 0.5rem;
  align-items: center;
  margin-bottom: 0.75rem;
}

.sub {
  text-align: right;
}

.total {
  display: flex;
  justify-content: space-between;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top:
      1px solid
      var(--p-content-border-color);
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .row {
    grid-template-columns:
      1fr 110px;
  }
}
</style>