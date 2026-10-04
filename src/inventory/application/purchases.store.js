import { defineStore } from 'pinia'
import { ref } from 'vue'
import { apiError } from '../../shared/infrastructure/api-error.js'
import { PurchaseAssembler, SupplierAssembler } from '../infrastructure/purchase.assembler.js'
import { PurchasesApi } from '../infrastructure/purchases-api.js'
import { Supplier } from '../domain/model/purchase.entity.js'

const api = new PurchasesApi()
const assembler = new PurchaseAssembler()
const supplierAssembler = new SupplierAssembler()

// Views never call the API: they talk to this store.
export const usePurchasesStore = defineStore('purchases', () => {
    const purchases = ref([])
    const total = ref(0)
    const current = ref(null)
    const suppliers = ref([])
    const options = ref([])
    const loading = ref(false)
    const error = ref(null)

    // range = [start, end]
    async function fetchPurchases(range) {
        loading.value = true
        error.value = null

        try {
            const result = assembler.toListFromResponse(
                await api.list(range)
            )

            purchases.value = result.purchases
            total.value = result.total
        } catch (e) {
            error.value = e
        } finally {
            loading.value = false
        }
    }

    async function fetchPurchase(id) {
        loading.value = true
        error.value = null

        try {
            current.value =
                assembler.toEntityFromResource(
                    (await api.get(id)).data
                )
        } catch (e) {
            error.value = e
        } finally {
            loading.value = false
        }
    }

    async function fetchSuppliers() {
        try {
            suppliers.value =
                supplierAssembler.toEntitiesFromResponse(
                    await api.suppliers.getAll()
                )
        } catch (e) {
            error.value = e
        }
    }

    async function fetchOptions() {
        try {
            options.value =
                assembler.toOptions(
                    await api.productOptions()
                )
        } catch (e) {
            error.value = e
        }
    }

    // Returns { ok: true, value } or { ok: false, error: { code, ... } }
    async function run(request) {
        loading.value = true

        try {
            return {
                ok: true,
                value: await request()
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

    // The purchase is never registered by itself:
    // the user always confirms (US32). value = purchase id
    const register = (
        supplierId,
        date,
        needId,
        items
    ) =>
        run(async () =>
            (
                await api.register(
                    assembler.toRegisterRequest({
                        supplierId,
                        date,
                        needId,
                        items
                    })
                )
            ).data.id
        )

    // Receiving adds the stock and resolves the linked alert (R16, R21)
    const receive = (id) =>
        run(async () => {
            await api.receive(id)
        })

    const createSupplier = (
        name,
        email,
        phone
    ) =>
        run(async () =>
            supplierAssembler.toEntityFromResource(
                (
                    await api.suppliers.create(
                        supplierAssembler.toResourceFromEntity(
                            new Supplier({
                                name,
                                email,
                                phone
                            })
                        )
                    )
                ).data
            )
        )

    return {
        purchases,
        total,
        current,
        suppliers,
        options,
        loading,
        error,
        fetchPurchases,
        fetchPurchase,
        fetchSuppliers,
        fetchOptions,
        register,
        receive,
        createSupplier,
    }
})