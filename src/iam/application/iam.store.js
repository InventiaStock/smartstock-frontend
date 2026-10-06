import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { apiCode } from '../../shared/infrastructure/api-error.js'
import { IamApi } from '../infrastructure/iam-api.js'

const STORAGE_KEY = 'smartstock.session'
const api = new IamApi()

function load() {
  try { return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {} } catch { return {} }
}

// Views and the router guard talk to this store.
// signIn / signUp resolve to 'OK' | 'INVALID_CREDENTIALS' | 'EMAIL_TAKEN' | 'ERROR' (R1 unique email, R3 generic credentials error)
export const useIamStore = defineStore('iam', () => {
  const saved = load()
  const token = ref(saved.token ?? null)
  const email = ref(saved.email ?? '')
  const businessName = ref(saved.businessName ?? '')
  const businessType = ref(saved.businessType ?? 'minimarket') // 'minimarket' | 'bodega'
  const isSignedIn = computed(() => !!token.value)
  const loading = ref(false)

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      token: token.value, email: email.value, businessName: businessName.value, businessType: businessType.value,
    }))
  }
  function startSession(session) {
    token.value = session.token
    email.value = session.email
    businessName.value = session.businessName ?? ''
    businessType.value = session.businessType
    persist()
  }
  function signOut() {
    token.value = null
    email.value = ''
    businessName.value = ''
    localStorage.removeItem(STORAGE_KEY)
  }

  async function run(request) {
    loading.value = true
    try {
      startSession(await request())
      return 'OK'
    } catch (e) {
      const code = apiCode(e)
      return code === 'INVALID_CREDENTIALS' || code === 'EMAIL_TAKEN' ? code : 'ERROR'
    } finally {
      loading.value = false
    }
  }

  const signIn = (emailValue, password) => run(() => api.login(emailValue, password))
  const signUp = (request) => run(() => api.register(request))

  // true when the reset link was sent (it expires in 24 hours, R4)
  async function requestPasswordReset(emailValue) {
    loading.value = true
    try {
      return (await api.forgotPassword(emailValue)).sent
    } catch {
      return false
    } finally {
      loading.value = false
    }
  }

  return { token, email, businessName, businessType, isSignedIn, loading, startSession, signOut, signIn, signUp, requestPasswordReset }
})