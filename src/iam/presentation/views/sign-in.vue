<script setup>
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import AuthLayout from '../../../shared/presentation/components/auth-layout.vue'
import { useIamStore } from '../../application/iam.store.js'

const { t } = useI18n()
const router = useRouter()
const iam = useIamStore()

// TEMPORARY: lets the team test both menus until the IAM step is done.
function enterAs(businessType) {
  iam.startSession({ token: 'dev-token', email: `${businessType}@dev.local`, businessType })
  router.push('/dashboard')
}
</script>

<template>
  <auth-layout>
    <h1>{{ t('iam.signIn.title') }}</h1>
    <p>US02 · M20, M21</p>
    <section class="dev-box" aria-labelledby="dev-title">
      <h2 id="dev-title">{{ t('iam.devSignIn.title') }}</h2>
      <p>{{ t('iam.devSignIn.text') }}</p>
      <div class="dev-actions">
        <Button :label="t('iam.devSignIn.minimarket')" @click="enterAs('minimarket')" />
        <Button :label="t('iam.devSignIn.bodega')" severity="secondary" @click="enterAs('bodega')" />
      </div>
    </section>
  </auth-layout>
</template>

<style scoped>
.dev-box { margin-top: 1.5rem; padding: 1rem; border: 1px dashed var(--p-content-border-color); border-radius: 0.75rem; }
.dev-box h2 { font-size: 1rem; margin: 0 0 0.25rem; }
.dev-actions { display: flex; flex-wrap: wrap; gap: 0.5rem; margin-top: 0.75rem; }
</style>
