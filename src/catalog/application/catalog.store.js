import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { apiError } from '../../shared/infrastructure/api-error.js'
import { CatalogApi } from '../infrastructure/catalog-api.js'
import { ProductAssembler } from '../infrastructure/product.assembler.js'

const api = new CatalogApi()
const assembler = new ProductAssembler()

// Views never call the API: they talk to this store.
export const useCatalogStore = defineStore('catalog', () => {
  const products = ref([])
  const current = ref(null)

  // US05: product whose minimum threshold is being edited (found through its sensor)
  const target = ref(null)

  const loading = ref(false)
  const error = ref(null)

  // Known categories, used as suggestions in the product form
  const categories = computed(() => [
    ...new Set([
      'Grocery',
      'Dairy',
      'Beverages',
      'Cleaning',
      ...products.value.map((p) => p.category)
    ])
  ])

  async function fetchProducts() {
    loading.value = true
    error.value = null

    try {
      products.value =
          assembler.toEntitiesFromResponse(
              await api.products.getAll()
          )
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  async function fetchProduct(id) {
    loading.value = true
    error.value = null
    current.value = null

    try {
      current.value =
          assembler.toEntityFromResource(
              (await api.products.getById(id)).data
          )
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  async function fetchThresholdTarget(sensorId) {
    loading.value = true
    error.value = null
    target.value = null

    try {
      const list =
          assembler.toEntitiesFromResponse(
              await api.thresholdTarget(sensorId)
          )

      target.value = list[0] ?? null
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  // Returns { ok: true, product } or { ok: false, error: { code, ... } }
  async function save(request) {
    loading.value = true

    try {
      return {
        ok: true,
        product:
            assembler.toEntityFromResource(
                (await request()).data
            )
      }
    } catch (e) {
      return {
        ok: false,
        error: apiError(e)
      }
    } finally {
      loading.value = false
    }
  }

  // US13: the product is added to the catalog and can be linked to a sensor afterwards (R5, R7)
  const create = (product) =>
      save(() =>
          api.products.create(
              assembler.toResourceFromEntity(product)
          )
      )

  // US14: editing never changes past sales, purchases or readings
  const update = (id, product) =>
      save(() =>
          api.products.update(
              id,
              assembler.toResourceFromEntity(product)
          )
      )

  // US05 · R7: the Fake API rejects a threshold above the maximum capacity
  const saveThreshold = (sensorId, minThreshold) =>
      save(() =>
          api.setThreshold(sensorId, minThreshold)
      )

  return {
    products,
    current,
    target,
    loading,
    error,
    categories,
    fetchProducts,
    fetchProduct,
    fetchThresholdTarget,
    create,
    update,
    saveThreshold
  }
})