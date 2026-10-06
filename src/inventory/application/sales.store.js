import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiError } from '../../shared/infrastructure/api-error.js'
import { SalesApi } from '../infrastructure/sales-api.js'

const api = new SalesApi()

// Views never call the API: they talk to this store.
export const useSalesStore = defineStore('sales', () => {
  const sales = ref([])
  const total = ref(0)
  const current = ref(null)
  const options = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchSales(range) {
    loading.value = true
    error.value = null
    try {
      const result = await api.list(range)
      sales.value = result.sales
      total.value = result.total
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  async function fetchSale(id) {
    loading.value = true
    error.value = null
    current.value = null
    try {
      current.value = await api.get(id)
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  async function fetchOptions() {
    try {
      options.value = await api.productOptions()
    } catch (e) {
      error.value = e
    }
  }

  // items: [{ productId, quantity, unitPrice }]
  // Server errors (INSUFFICIENT_STOCK, NO_SALE_PRICE...) come back inside the result so the view can show M12 / M13
  async function register(items) {
    loading.value = true
    try {
      const { id } = await api.register(items)
      return { ok: true, id }
    } catch (e) {
      return { ok: false, error: apiError(e) }
    } finally {
      loading.value = false
    }
  }

  return { sales, total, current, options, loading, error, fetchSales, fetchSale, fetchOptions, register }
})
