<script setup>
import { computed, reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import AuthLayout from '../../../shared/presentation/components/auth-layout.vue'
import FormField from '../../../shared/presentation/components/form-field.vue'
import { useIamStore } from '../../application/iam.store.js'

// US02 · M20 sign in, M21 wrong credentials
const { t } = useI18n()
const router = useRouter()
const store = useIamStore()

const form = reactive({ email: '', password: '' })
const failed = ref(false)
const submitted = ref(false)

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
const emailError = computed(() => (submitted.value && !emailValid.value ? t('iam.error.email') : ''))
const passwordError = computed(() => {
  if (failed.value) return t('iam.signIn.invalidField')
  return submitted.value && !form.password ? t('iam.error.password') : ''
})

async function submit() {
  submitted.value = true
  failed.value = false
  if (!emailValid.value || !form.password) return
  const result = await store.signIn(form.email, form.password)
  if (result === 'OK') router.push('/dashboard')
  else failed.value = true // R3: it never says which of the two data failed
}
</script>

<template>
  <AuthLayout>
    <h1>{{ t('iam.signIn.title') }}</h1>
    <p class="ss-muted">{{ t('iam.signIn.subtitle') }}</p>

    <AlertBanner v-if="failed" tone="error">{{ t('iam.signIn.invalid') }}</AlertBanner>

    <form novalidate @submit.prevent="submit">
      <FormField id="email" :label="t('iam.field.email')" :error="emailError">
        <InputText
          id="email" v-model="form.email" type="email" autocomplete="username" class="ss-field-full"
          :invalid="!!emailError" :aria-invalid="!!emailError" :aria-describedby="emailError ? 'email-error' : undefined"
        />
      </FormField>

      <FormField id="password" :label="t('iam.field.password')" :error="passwordError">
        <InputText
          id="password" v-model="form.password" type="password" autocomplete="current-password" class="ss-field-full"
          :invalid="!!passwordError" :aria-invalid="!!passwordError" :aria-describedby="passwordError ? 'password-error' : undefined"
        />
      </FormField>

      <router-link class="forgot" to="/forgot-password">{{ t('iam.signIn.forgot') }}</router-link>

      <Button type="submit" class="full" :label="t('iam.signIn.submit')" :loading="store.loading" />
    </form>

    <p class="switch">
      {{ t('iam.signIn.new') }}
      <router-link to="/sign-up">{{ t('iam.signIn.create') }}</router-link>
    </p>
  </AuthLayout>
</template>

<style scoped>
.forgot { display: inline-block; margin-bottom: 1rem; }
.full { width: 100%; }
.switch { text-align: center; margin-top: 1.25rem; }
</style>