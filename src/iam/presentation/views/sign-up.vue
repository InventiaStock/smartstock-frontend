<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import SelectButton from 'primevue/selectbutton'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import AuthLayout from '../../../shared/presentation/components/auth-layout.vue'
import FormField from '../../../shared/presentation/components/form-field.vue'
import { useIamStore } from '../../application/iam.store.js'

// US01 · M22 register, M23 email already registered, M24 register success
const { t } = useI18n()
const router = useRouter()
const store = useIamStore()

const form = reactive({ businessName: '', email: '', password: '', businessType: 'minimarket' })
const created = ref(null) // { email, businessType }
const emailTaken = ref(false)
const serverError = ref(false)
const submitted = ref(false)

const typeOptions = computed(() => [
  { value: 'minimarket', label: t('iam.businessType.minimarket') },
  { value: 'bodega', label: t('iam.businessType.bodega') },
])

const valid = computed(() => ({
  businessName: form.businessName.trim().length > 0,
  email: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email),
  password: form.password.length >= 8,
}))

function fieldError(name) {
  if (name === 'email' && emailTaken.value) return t('iam.signUp.emailTaken') // M23
  if (!submitted.value || valid.value[name]) return ''
  return t(`iam.error.${name}`)
}
const businessNameError = computed(() => fieldError('businessName'))
const emailError = computed(() => fieldError('email'))
const passwordError = computed(() => fieldError('password'))

async function submit() {
  submitted.value = true
  emailTaken.value = false
  serverError.value = false
  if (!valid.value.businessName || !valid.value.email || !valid.value.password) return
  const request = { ...form }
  const result = await store.signUp(request)
  if (result === 'OK') created.value = { email: request.email, businessType: request.businessType } // M24
  else if (result === 'EMAIL_TAKEN') emailTaken.value = true
  else serverError.value = true
}

function goToDashboard() {
  router.push('/dashboard')
}
</script>

<template>
  <AuthLayout>
    <section v-if="created" class="done" aria-labelledby="done-title">
      <p class="ok" aria-hidden="true">✓</p>
      <h1 id="done-title">{{ t('iam.signUp.successTitle') }}</h1>
      <p>{{ t('iam.signUp.successText') }}<br><strong>{{ created.email }}</strong></p>
      <p><strong>{{ t(`iam.businessType.${created.businessType}`) }}</strong> · {{ t('iam.signUp.menuReady') }}</p>
      <Button type="button" :label="t('iam.signUp.goDashboard')" @click="goToDashboard" />
    </section>
    <template v-else>
      <h1>{{ t('iam.signUp.title') }}</h1>
      <p class="ss-muted">{{ t('iam.signUp.subtitle') }}</p>

      <form novalidate @submit.prevent="submit">
        <FormField id="businessName" :label="t('iam.field.businessName')" :error="businessNameError">
          <InputText
            id="businessName" v-model="form.businessName" autocomplete="organization" class="ss-field-full"
            :invalid="!!businessNameError" :aria-invalid="!!businessNameError" :aria-describedby="businessNameError ? 'businessName-error' : undefined"
          />
        </FormField>

        <FormField id="email" :label="t('iam.field.email')" :error="emailError">
          <InputText
            id="email" v-model="form.email" type="email" autocomplete="username" class="ss-field-full"
            :invalid="!!emailError" :aria-invalid="!!emailError" :aria-describedby="emailError ? 'email-error' : undefined"
          />
        </FormField>

        <FormField id="password" :label="t('iam.field.password')" :error="passwordError">
          <InputText
            id="password" v-model="form.password" type="password" autocomplete="new-password" class="ss-field-full"
            :invalid="!!passwordError" :aria-invalid="!!passwordError" :aria-describedby="passwordError ? 'password-error' : undefined"
          />
        </FormField>

        <div class="type">
          <span id="type-label" class="label">{{ t('iam.field.businessType') }}</span>
          <SelectButton
            v-model="form.businessType" :options="typeOptions" option-label="label" option-value="value"
            :allow-empty="false" aria-labelledby="type-label"
          />
        </div>

        <AlertBanner v-if="serverError" tone="error">{{ t('shared.error') }}</AlertBanner>
        <Button type="submit" class="full" :label="t('iam.signUp.submit')" :loading="store.loading" />
      </form>

      <p class="switch">{{ t('iam.signUp.have') }} <router-link to="/sign-in">{{ t('iam.signUp.signIn') }}</router-link></p>
    </template>
  </AuthLayout>
</template>

<style scoped>
.full { width: 100%; margin-top: 1rem; }
.type { display: grid; gap: 0.35rem; margin-bottom: 0.5rem; }
.label { font-weight: 600; font-size: 0.85rem; }
.switch { text-align: center; margin-top: 1.25rem; }
.done { text-align: center; display: grid; gap: 0.5rem; justify-items: center; }
.ok { font-size: 2.5rem; margin: 0; color: var(--p-green-600); }
</style>
