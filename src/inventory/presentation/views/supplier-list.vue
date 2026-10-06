<script setup>
import { onMounted, reactive, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Column from 'primevue/column'
import DataTable from 'primevue/datatable'
import InputText from 'primevue/inputtext'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import EmptyState from '../../../shared/presentation/components/empty-state.vue'
import FormField from '../../../shared/presentation/components/form-field.vue'
import PageHeader from '../../../shared/presentation/components/page-header.vue'
import { usePurchasesStore } from '../../application/purchases.store.js'

// US29 · M7 new supplier, M8 duplicate supplier, M7A corrected data, M7B supplier saved
const { t } = useI18n()
const store = usePurchasesStore()

const formOpen = ref(false)
const duplicate = ref(false)
const failed = ref(false)
const savedName = ref('')
const form = reactive({
  name: '',
  email: '',
  phone: ''
})

const touched = reactive({
  name: false,
  email: false,
  phone: false
})

// Form validation rules: required name, valid email, phone like +51 987 654 321
const valid = {
  name: (v) => v !== '',
  email: (v) =>
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
  phone: (v) =>
      /^[+\d][\d\s-]{6,}$/.test(v),
}

// The fields are validated when the user leaves them (touched), as the flow says
function err(field) {
  return touched[field] && !valid[field](form[field])
      ? t(`inventory.supplierList.error.${field}`)
      : ''
}

const describedBy = (field) =>
    err(field)
        ? `supplier-${field}-error`
        : undefined

onMounted(store.fetchSuppliers)

function openForm() {
  formOpen.value = true
  savedName.value = ''
}

function closeForm() {
  formOpen.value = false
  duplicate.value = false

  Object.assign(form, {
    name: '',
    email: '',
    phone: ''
  })

  Object.assign(touched, {
    name: false,
    email: false,
    phone: false
  })
}

async function save() {
  duplicate.value = false
  failed.value = false

  Object.assign(touched, {
    name: true,
    email: true,
    phone: true
  })

  if (
      !Object.keys(valid).every(
          (f) => valid[f](form[f])
      )
  ) {
    return
  }

  const result =
      await store.createSupplier(
          form.name.trim(),
          form.email.trim(),
          form.phone.trim()
      )

  if (result.ok) {
    // M7B
    savedName.value = result.value.name
    closeForm()
    store.fetchSuppliers()
  } else if (
      result.error.code ===
      'DUPLICATE_SUPPLIER'
  ) {
    // M8, R8
    duplicate.value = true
  } else {
    failed.value = true
  }
}
</script>

<template>
  <section aria-labelledby="suppliers-title">
    <PageHeader
        :title="t('inventory.supplierList.title')"
        title-id="suppliers-title"
    >
      <router-link
          to="/purchases"
          custom
          v-slot="{ navigate }"
      >
        <Button
            :label="t('inventory.supplierList.back')"
            outlined
            @click="navigate"
        />
      </router-link>

      <Button
          type="button"
          :label="t('inventory.supplierList.new')"
          @click="openForm"
      />
    </PageHeader>

    <AlertBanner
        v-if="savedName"
        tone="success"
    >
      {{
        t(
            'inventory.supplierList.saved',
            { name: savedName }
        )
      }}
    </AlertBanner>

    <AlertBanner
        v-if="store.error"
        tone="error"
    >
      {{ t('shared.error') }}
    </AlertBanner>

    <form
        v-if="formOpen"
        class="ss-card ss-form"
        novalidate
        @submit.prevent="save"
    >
      <h2 class="h2">
        {{ t('inventory.supplierList.formTitle') }}
      </h2>

      <AlertBanner
          v-if="duplicate"
          tone="error"
      >
        {{ t('inventory.supplierList.duplicate') }}
      </AlertBanner>

      <AlertBanner
          v-if="failed"
          tone="error"
      >
        {{ t('shared.error') }}
      </AlertBanner>

      <FormField
          id="supplier-name"
          :label="t('inventory.supplierList.name')"
          :error="err('name')"
      >
        <InputText
            id="supplier-name"
            v-model="form.name"
            :invalid="!!err('name')"
            :aria-invalid="!!err('name')"
            :aria-describedby="describedBy('name')"
            class="ss-field-full"
            @blur="touched.name = true"
        />
      </FormField>

      <FormField
          id="supplier-email"
          :label="t('inventory.supplierList.email')"
          :error="err('email')"
      >
        <InputText
            id="supplier-email"
            v-model="form.email"
            type="email"
            :invalid="!!err('email')"
            :aria-invalid="!!err('email')"
            :aria-describedby="describedBy('email')"
            class="ss-field-full"
            @blur="touched.email = true"
        />
      </FormField>

      <FormField
          id="supplier-phone"
          :label="t('inventory.supplierList.phone')"
          :error="err('phone')"
      >
        <InputText
            id="supplier-phone"
            v-model="form.phone"
            type="tel"
            :invalid="!!err('phone')"
            :aria-invalid="!!err('phone')"
            :aria-describedby="describedBy('phone')"
            class="ss-field-full"
            @blur="touched.phone = true"
        />
      </FormField>

      <div class="ss-actions">
        <Button
            type="button"
            :label="t('shared.cancel')"
            text
            @click="closeForm"
        />

        <Button
            type="submit"
            :label="t('inventory.supplierList.save')"
            :loading="store.loading"
        />
      </div>
    </form>

    <DataTable
        :value="store.suppliers"
        data-key="id"
        size="small"
        :table-props="{
        'aria-label':
          t('inventory.supplierList.title')
      }"
    >
      <template #empty>
        <EmptyState
            :message="t('inventory.supplierList.empty')"
        />
      </template>

      <Column
          :header="t('inventory.supplierList.supplier')"
      >
        <template #body="{ data }">
          <strong>{{ data.name }}</strong>
        </template>
      </Column>

      <Column
          field="email"
          :header="t('inventory.supplierList.contact')"
      />

      <Column
          field="phone"
          :header="t('inventory.supplierList.phone')"
      />
    </DataTable>
  </section>
</template>

<style scoped>
.h2 {
  font-size: 1.05rem;
  margin: 0 0 1rem;
}
</style>