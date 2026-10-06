<script setup>
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import AlertBanner from '../../../shared/presentation/components/alert-banner.vue'
import AuthLayout from '../../../shared/presentation/components/auth-layout.vue'
import FormField from '../../../shared/presentation/components/form-field.vue'
import { useIamStore } from '../../application/iam.store.js'

// US03 · M25 forgot password, M26 reset link sent (the link expires in 24 hours)
const { t } = useI18n()
const store = useIamStore()

const email = ref('')
const sentTo = ref(null)
const failed = ref(false)
const submitted = ref(false)

const emailValid = computed(() => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value))
const emailError = computed(() => (submitted.value && !emailValid.value ? t('iam.error.email') : ''))

async function send() {
  submitted.value = true
  failed.value = false
  if (!emailValid.value) return
  const ok = await store.requestPasswordReset(email.value)
  if (ok) sentTo.value = email.value
  else failed.value = true
}
</script>

<template>
  <AuthLayout>
    <section v-if="sentTo" class="sent" aria-labelledby="sent-title">
      <h1 id="sent-title">{{ t('iam.forgotPassword.sentTitle') }}</h1>
      <p>{{ t('iam.forgotPassword.sentText') }}<br><strong>{{ sentTo }}</strong></p>
      <p class="ss-muted">{{ t('iam.forgotPassword.expires') }}</p>
      <div class="row">
        <router-link to="/sign-in" custom v-slot="{ navigate }">
          <Button type="button" :label="t('iam.forgotPassword.back')" variant="outlined" @click="navigate" />
        </router-link>
        <Button type="button" :label="t('iam.forgotPassword.resend')" text :disabled="store.loading" @click="send" />
      </div>
    </section>
    <template v-else>
      <h1>{{ t('iam.forgotPassword.title') }}</h1>
      <p class="ss-muted">{{ t('iam.forgotPassword.subtitle') }}</p>
      <AlertBanner v-if="failed" tone="error">{{ t('shared.error') }}</AlertBanner>
      <form novalidate @submit.prevent="send">
        <FormField id="email" :label="t('iam.field.email')" :error="emailError">
          <InputText
            id="email" v-model="email" type="email" autocomplete="username" class="ss-field-full"
            :invalid="!!emailError" :aria-invalid="!!emailError" :aria-describedby="emailError ? 'email-error' : undefined"
          />
        </FormField>
        <Button type="submit" class="full" :label="t('iam.forgotPassword.submit')" :loading="store.loading" />
      </form>
      <p class="switch"><router-link to="/sign-in">{{ t('iam.forgotPassword.back') }}</router-link></p>
    </template>
  </AuthLayout>
</template>

<style scoped>
.full { width: 100%; }
.switch { text-align: center; margin-top: 1.25rem; }
.sent { display: grid; gap: 0.5rem; }
.row { display: flex; gap: 0.5rem; flex-wrap: wrap; }
</style>
