import { BaseApi } from '../../shared/infrastructure/base-api.js'
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js'

export class CatalogApi extends BaseApi {
  constructor() {
    super()
    this.products = new BaseEndpoint(
        this,
        import.meta.env.VITE_PRODUCTS_ENDPOINT_PATH
    )
    this.sensorsPath = import.meta.env.VITE_SENSORS_ENDPOINT_PATH
  }

  // US05: the product linked to a sensor
  // (its maximum capacity bounds the threshold, R7)
  thresholdTarget(sensorId) {
    return this.products.getAll({ sensorId })
  }

  // US05: PUT /sensores/:id/umbral
  setThreshold(sensorId, minThreshold) {
    return this.http.put(
        `${this.sensorsPath}/${sensorId}/umbral`,
        { umbralMinimo: minThreshold }
    )
  }
}