import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

const STORAGE_KEY = 'smartstock.session'

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {} } catch { return {} }
}

export const useIamStore = defineStore('iam', () => {
  const saved = load()
  const token = ref(saved.token ?? null)
  const email = ref(saved.email ?? '')
  const businessType = ref(saved.businessType ?? 'minimarket') // 'minimarket' | 'bodega'
  const isSignedIn = computed(() => !!token.value)

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({ token: token.value, email: email.value, businessType: businessType.value }))
  }
  function startSession(session) {
    token.value = session.token
    email.value = session.email
    businessType.value = session.businessType
    persist()
  }
  function signOut() {
    token.value = null
    email.value = ''
    localStorage.removeItem(STORAGE_KEY)
  }
  return { token, email, businessType, isSignedIn, startSession, signOut }
})
