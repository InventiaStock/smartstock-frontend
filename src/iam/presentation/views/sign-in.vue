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

const { t, locale } = useI18n()
const router = useRouter()
const store = useIamStore()

const form = reactive({ email: '', password: '' })
const failed = ref(false)
const submitted = ref(false)

const isSpanish = computed(() => locale.value.startsWith('es'))

const emailValid = computed(() =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
)

const emailError = computed(() =>
    submitted.value && !emailValid.value ? t('iam.error.email') : ''
)

const passwordError = computed(() => {
  if (failed.value) return t('iam.signIn.invalidField')
  return submitted.value && !form.password
      ? t('iam.error.password')
      : ''
})

async function submit() {
  submitted.value = true
  failed.value = false

  if (!emailValid.value || !form.password) return

  const result = await store.signIn(form.email, form.password)

  if (result === 'OK') router.push('/dashboard')
  else failed.value = true
}

function enterDemo(type) {
  store.startDemoSession(type)
  router.push('/dashboard')
}
</script>

<template>
  <AuthLayout>
    <h1>{{ t('iam.signIn.title') }}</h1>
    <p class="ss-muted">{{ t('iam.signIn.subtitle') }}</p>

    <AlertBanner v-if="failed" tone="error">
      {{ t('iam.signIn.invalid') }}
    </AlertBanner>

    <form novalidate @submit.prevent="submit">
      <FormField
          id="email"
          :label="t('iam.field.email')"
          :error="emailError"
      >
        <InputText
            id="email"
            v-model="form.email"
            type="email"
            autocomplete="username"
            class="ss-field-full"
            :invalid="!!emailError"
            :aria-invalid="!!emailError"
            :aria-describedby="emailError ? 'email-error' : undefined"
        />
      </FormField>

      <FormField
          id="password"
          :label="t('iam.field.password')"
          :error="passwordError"
      >
        <InputText
            id="password"
            v-model="form.password"
            type="password"
            autocomplete="current-password"
            class="ss-field-full"
            :invalid="!!passwordError"
            :aria-invalid="!!passwordError"
            :aria-describedby="passwordError ? 'password-error' : undefined"
        />
      </FormField>

      <router-link class="forgot" to="/forgot-password">
        {{ t('iam.signIn.forgot') }}
      </router-link>

      <Button
          type="submit"
          class="full"
          :label="t('iam.signIn.submit')"
          :loading="store.loading"
      />
    </form>

    <div class="demo-access">
      <p class="ss-muted">
        {{
          isSpanish
              ? 'Acceso de demostración temporal. El inicio de sesión real estará disponible en el Sprint 4.'
              : 'Temporary demo access. Real sign-in will be available in Sprint 4.'
        }}
      </p>

      <Button
          type="button"
          class="full"
          :label="isSpanish
          ? 'Entrar como demo — Minimarket'
          : 'Enter demo — Minimarket'"
          @click="enterDemo('minimarket')"
      />

      <Button
          type="button"
          class="full"
          outlined
          :label="isSpanish
          ? 'Entrar como demo — Bodega'
          : 'Enter demo — Bodega'"
          @click="enterDemo('bodega')"
      />
    </div>

    <p class="switch">
      {{ t('iam.signIn.new') }}
      <router-link to="/sign-up">
        {{ t('iam.signIn.create') }}
      </router-link>
    </p>
  </AuthLayout>
</template>

<style scoped>
.forgot {
  display: inline-block;
  margin-bottom: 1rem;
}

.full {
  width: 100%;
}

.demo-access {
  display: grid;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.demo-access p {
  margin: 0;
}

.switch {
  text-align: center;
  margin-top: 1.25rem;
}
</style>