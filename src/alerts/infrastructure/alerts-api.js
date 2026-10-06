import { BaseApi } from '../../shared/infrastructure/base-api.js'
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js'

export class AlertsApi extends BaseApi {
  constructor() {
    super()
    this.channelsPath = import.meta.env.VITE_NOTIFICATION_CHANNELS_ENDPOINT_PATH
    this.notificationsPath = import.meta.env.VITE_NOTIFICATIONS_ENDPOINT_PATH
    this.alerts = new BaseEndpoint(this, import.meta.env.VITE_ALERTS_ENDPOINT_PATH)
    this.channels = new BaseEndpoint(this, this.channelsPath)
  }

  saveChannels(channels) {
    return this.http.put(
      this.channelsPath,
      channels.map((c) => ({ id: c.id, activo: c.active }))
    )
  }

  notifyLowStock(productId) {
    return this.http.post(
      `${this.notificationsPath}/stock-bajo`,
      { productoId: productId }
    )
  }
}