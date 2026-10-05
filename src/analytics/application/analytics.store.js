import { defineStore } from 'pinia'
import { ref } from 'vue'
import { AnalyticsApi } from '../infrastructure/analytics-api.js'
import { AnalyticsAssembler } from '../infrastructure/analytics.assembler.js'

const api = new AnalyticsApi()
const assembler = new AnalyticsAssembler()

// Views never call the API: they talk to this store.
export const useAnalyticsStore = defineStore('analytics', () => {
  const dashboard = ref(null)
  const report = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchDashboard() {
    loading.value = true
    error.value = null
    try {
      dashboard.value = assembler.toDashboard((await api.dashboard()).data)
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  // range = [start, end]
  async function fetchReport(range) {
    loading.value = true
    error.value = null
    try {
      report.value = assembler.toReport((await api.report(range)).data)
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { dashboard, report, loading, error, fetchDashboard, fetchReport }
})
