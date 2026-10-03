<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import Button from 'primevue/button'
import Avatar from 'primevue/avatar'
import LanguageSwitcher from './language-switcher.vue'
import { menuFor } from '../../config/menu.js'
import { useIamStore } from '../../../iam/application/iam.store.js'

const { t } = useI18n()
const router = useRouter()
const iam = useIamStore()
const open = ref(false)
const items = computed(() => menuFor(iam.businessType))

function signOut() {
  iam.signOut()
  router.push({ name: 'sign-in' })
}
</script>

<template>
  <div class="shell">
    <a class="skip" href="#main">{{ t('shared.skipToContent') }}</a>
    <aside class="sidebar" :class="{ open }">
      <strong class="logo">SmartStock</strong>
      <nav :aria-label="t('shared.menu.dashboard')">
        <router-link v-for="item in items" :key="item.key" :to="item.path" class="link" @click="open = false">
          <i :class="['pi', item.icon]" aria-hidden="true" />
          <span>{{ t(`shared.menu.${item.key}`) }}</span>
        </router-link>
      </nav>
      <div class="bottom">
        <router-link to="/settings" class="link" @click="open = false">
          <i class="pi pi-cog" aria-hidden="true" /><span>{{ t('shared.menu.settings') }}</span>
        </router-link>
        <button type="button" class="link" @click="signOut">
          <i class="pi pi-sign-out" aria-hidden="true" /><span>{{ t('shared.menu.signOut') }}</span>
        </button>
      </div>
    </aside>
    <div class="content">
      <header class="topbar">
        <Button class="burger" icon="pi pi-bars" text :aria-label="t('shared.menuToggle')" :aria-expanded="open" @click="open = !open" />
        <div class="spacer" />
        <language-switcher />
        <router-link to="/alerts" class="bell" :aria-label="t('shared.notifications')"><i class="pi pi-bell" aria-hidden="true" /></router-link>
        <div class="user">
          <Avatar :label="iam.email.slice(0, 2).toUpperCase()" shape="circle" />
          <div><strong>{{ iam.email }}</strong><small>{{ iam.businessType }}</small></div>
        </div>
      </header>
      <main id="main" class="main"><router-view /></main>
      <footer class="footer">{{ t('shared.footer') }}</footer>
    </div>
  </div>
</template>

<style scoped>
.shell { min-height: 100%; display: grid; grid-template-columns: 230px 1fr; }
.skip { position: absolute; left: -999px; } .skip:focus { left: 0.5rem; top: 0.5rem; z-index: 10; background: var(--p-surface-0); padding: 0.5rem; }
.sidebar { background: var(--p-primary-900); color: var(--p-surface-0); padding: 1.25rem 1rem; display: flex; flex-direction: column; gap: 1.5rem; }
.logo { font-size: 1.2rem; padding: 0 0.5rem; }
nav { display: grid; gap: 0.25rem; }
.link { display: flex; gap: 0.75rem; align-items: center; padding: 0.6rem 0.75rem; border-radius: 0.6rem; color: var(--p-surface-200); text-decoration: none; background: transparent; border: 0; font: inherit; cursor: pointer; width: 100%; text-align: left; }
.link:hover { background: var(--p-primary-800); }
.link.router-link-active { background: var(--p-primary-color); color: var(--p-primary-contrast-color); }
.bottom { margin-top: auto; display: grid; gap: 0.25rem; border-top: 1px solid var(--p-primary-700); padding-top: 1rem; }
.content { display: flex; flex-direction: column; min-width: 0; }
.topbar { display: flex; align-items: center; gap: 1rem; padding: 0.75rem 1.5rem; background: var(--p-surface-0); border-bottom: 1px solid var(--p-content-border-color); }
.spacer { flex: 1; }
.bell { color: var(--p-primary-color); padding: 0.5rem; border-radius: 50%; }
.user { display: flex; gap: 0.6rem; align-items: center; } .user small { display: block; color: var(--p-text-muted-color); }
.main { flex: 1; padding: 1.5rem; }
.footer { padding: 1rem 1.5rem; color: var(--p-text-muted-color); font-size: 0.8rem; }
.burger { display: none; }
@media (max-width: 768px) {
  .shell { grid-template-columns: 1fr; }
  .sidebar { position: fixed; inset: 0 auto 0 0; width: 230px; transform: translateX(-100%); transition: transform 0.2s; z-index: 20; }
  .sidebar.open { transform: none; }
  .burger { display: inline-flex; }
  .user div { display: none; }
}
</style>
