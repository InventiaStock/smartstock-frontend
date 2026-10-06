import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { useIamStore } from '../../iam/application/iam.store.js'
import { apiError } from '../../shared/infrastructure/api-error.js'
import {
  AlertAssembler,
  NotificationChannelAssembler,
} from '../infrastructure/alert.assembler.js'
import { AlertsApi } from '../infrastructure/alerts-api.js'

const api = new AlertsApi()
const alertAssembler = new AlertAssembler()
const channelAssembler = new NotificationChannelAssembler()

export const useAlertsStore = defineStore('alerts', () => {
  const iam = useIamStore()
  const alerts = ref([])
  const channels = ref([])
  const loading = ref(false)
  const error = ref(null)
  const dismissed = ref([])

  const visible = computed(() =>
    iam.businessType === 'bodega'
      ? alerts.value.filter((a) => a.isLowStock)
      : alerts.value
  )

  const active = computed(() =>
    visible.value.filter((a) => a.isActive)
  )

  const activeLowStock = computed(() =>
    active.value.filter((a) => a.isLowStock)
  )

  const resolved = computed(() =>
    visible.value.filter(
      (a) => !a.isActive && !dismissed.value.includes(Number(a.id))
    )
  )

  async function fetchAlerts() {
    loading.value = true
    error.value = null
    try {
      alerts.value = alertAssembler.toEntitiesFromResponse(
        await api.alerts.getAll()
      )
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  function dismiss(id) {
    dismissed.value = [...dismissed.value, Number(id)]
  }

  async function fetchChannels() {
    loading.value = true
    error.value = null
    try {
      channels.value = channelAssembler.toEntitiesFromResponse(
        await api.channels.getAll()
      )
    } catch (e) {
      error.value = e
    } finally {
      loading.value = false
    }
  }

  async function saveChannels(changes) {
    loading.value = true
    try {
      channels.value = channelAssembler.toEntitiesFromResponse(
        await api.saveChannels(changes)
      )
      return { ok: true }
    } catch (e) {
      return { ok: false, error: apiError(e) }
    } finally {
      loading.value = false
    }
  }

  return {
    alerts,
    channels,
    loading,
    error,
    active,
    activeLowStock,
    resolved,
    fetchAlerts,
    dismiss,
    fetchChannels,
    saveChannels,
  }
})