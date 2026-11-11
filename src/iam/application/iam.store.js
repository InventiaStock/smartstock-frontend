import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { apiCode } from '../../shared/infrastructure/api-error.js'
import { IamApi } from '../infrastructure/iam-api.js'

const STORAGE_KEY = 'smartstock.session'
const api = new IamApi()

function load() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) ?? {}
  } catch {
    return {}
  }
}

export const useIamStore = defineStore('iam', () => {
  const saved = load()

  const token = ref(saved.token ?? null)
  const email = ref(saved.email ?? '')
  const businessName = ref(saved.businessName ?? '')
  const businessType = ref(saved.businessType ?? 'minimarket')
  const isDemo = ref(saved.isDemo === true)
  const isSignedIn = computed(() => !!token.value || isDemo.value)
  const loading = ref(false)

  function persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      token: token.value,
      email: email.value,
      businessName: businessName.value,
      businessType: businessType.value,
      isDemo: isDemo.value,
    }))
  }

  function startSession(session) {
    isDemo.value = false
    token.value = session.token
    email.value = session.email
    businessName.value = session.businessName ?? ''
    businessType.value = session.businessType
    persist()
  }

  // Acceso temporal para Sprint 3: API abierta, sin autenticación.
  function startDemoSession(type = 'minimarket') {
    token.value = null
    isDemo.value = true
    email.value = 'demo@example.com'
    businessName.value = 'SmartStock Demo'
    businessType.value = type === 'bodega' ? 'bodega' : 'minimarket'
    persist()
  }

  function signOut() {
    token.value = null
    isDemo.value = false
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
      return code === 'INVALID_CREDENTIALS' || code === 'EMAIL_TAKEN'
          ? code
          : 'ERROR'
    } finally {
      loading.value = false
    }
  }

  const signIn = (emailValue, password) =>
      run(() => api.login(emailValue, password))

  const signUp = (request) =>
      run(() => api.register(request))

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

  return {
    token,
    email,
    businessName,
    businessType,
    isDemo,
    isSignedIn,
    loading,
    startSession,
    startDemoSession,
    signOut,
    signIn,
    signUp,
    requestPasswordReset,
  }
})