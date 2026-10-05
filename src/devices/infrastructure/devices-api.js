import { BaseApi } from '../../shared/infrastructure/base-api.js'
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js'

// TS01 readings (sent by the device), TS05 sensor status, US04 link, US06 sensor list
export class DevicesApi extends BaseApi {
    constructor() {
        super()
        this.sensorsPath = import.meta.env.VITE_SENSORS_ENDPOINT_PATH
        this.sensors = new BaseEndpoint(this, this.sensorsPath)
    }

    link(sensorId, productId) {
        return this.http.post(`${this.sensorsPath}/vincular`, { sensorId, productoId: productId })
    }

    // Products as the Devices context needs them (resource only: the assembler builds the snapshot)
    linkableProducts() {
        return this.http.get(import.meta.env.VITE_PRODUCTS_ENDPOINT_PATH)
    }
}