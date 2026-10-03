import { defineStore } from 'pinia'
import { ref } from 'vue'
import { CatalogApi } from '../infrastructure/catalog-api.js'
import { ProductAssembler } from '../infrastructure/product.assembler.js'

const api = new CatalogApi()
const assembler = new ProductAssembler()

// Views never call the API: they talk to this store.
export const useCatalogStore = defineStore('catalog', () => {
  const products = ref([])
  const loading = ref(false)
  const error = ref(null)

  async function fetchProducts() {
    loading.value = true
    error.value = null
    try {
      products.value = assembler.toEntitiesFromResponse(await api.products.getAll())
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }
  return { products, loading, error, fetchProducts }
})
