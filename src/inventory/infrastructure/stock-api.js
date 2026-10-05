import { BaseApi } from '../../shared/infrastructure/base-api.js'
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js'

// TS02 stock query, TS06 inventory comparison
export class StockApi extends BaseApi {
  constructor() {
    super()
    this.productsPath = import.meta.env.VITE_PRODUCTS_ENDPOINT_PATH
    this.comparisonEndpoint = new BaseEndpoint(this, import.meta.env.VITE_COMPARISON_ENDPOINT_PATH)
  }

  comparison() {
    return this.comparisonEndpoint.getAll()
  }

  // M28: GET /productos/:id/detalle
  productSensorDetail(productId) {
    return this.http.get(`${this.productsPath}/${productId}/detalle`)
  }
}
