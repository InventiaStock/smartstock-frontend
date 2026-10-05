import { defineStore } from 'pinia'
import { ref } from 'vue'
import { StockApi } from '../infrastructure/stock-api.js'
import { StockAssembler } from '../infrastructure/stock.assembler.js'

const api = new StockApi()
const assembler = new StockAssembler()

// Views never call the API: they talk to this store.
export const useStockStore = defineStore('stock', () => {
  const comparison = ref(null)
  const sensorDetail = ref(null)
  const loading = ref(false)
  const error = ref(null)

  async function fetchComparison() {
    loading.value = true
    error.value = null
    try {
      comparison.value = assembler.toComparison((await api.comparison()).data)
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  async function fetchSensorDetail(productId) {
    loading.value = true
    error.value = null
    sensorDetail.value = null
    try {
      sensorDetail.value = assembler.toProductSensorDetail((await api.productSensorDetail(productId)).data)
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  return { comparison, sensorDetail, loading, error, fetchComparison, fetchSensorDetail }
})
