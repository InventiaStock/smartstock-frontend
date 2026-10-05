import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { apiError } from '../../shared/infrastructure/api-error.js'
import { DevicesApi } from '../infrastructure/devices-api.js'
import { SensorAssembler } from '../infrastructure/sensor.assembler.js'

const api = new DevicesApi()
const assembler = new SensorAssembler()

// Views never call the API: they talk to this store.
export const useDevicesStore = defineStore('devices', () => {
    const sensors = ref([])
    const products = ref([])
    const loading = ref(false)
    const error = ref(null)

    // M31 counters
    const online = computed(() => sensors.value.filter((s) => s.status === 'online').length)
    const disconnected = computed(() => sensors.value.filter((s) => s.status === 'disconnected').length)
    const available = computed(() => sensors.value.filter((s) => s.status === 'available').length)

    async function fetchSensors() {
        loading.value = true
        error.value = null
        try {
            sensors.value = assembler.toEntitiesFromResponse(await api.sensors.getAll())
        } catch (e) {
            error.value = e
        } finally {
            loading.value = false
        }
    }

    async function fetchLinkProducts() {
        try {
            products.value = assembler.toLinkables(await api.linkableProducts())
        } catch (e) {
            error.value = e
        }
    }

    // R9: one sensor, one product. Returns { ok: true } or { ok: false, error: { code, ... } }
    async function link(sensorId, productId) {
        loading.value = true
        try {
            await api.link(sensorId, productId)
            return { ok: true }
        } catch (e) {
            return { ok: false, error: apiError(e) }
        } finally {
            loading.value = false
        }
    }

    return {
        sensors,
        products,
        loading,
        error,
        online,
        disconnected,
        available,
        fetchSensors,
        fetchLinkProducts,
        link
    }
})