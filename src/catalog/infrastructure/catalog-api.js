import { BaseApi } from '../../shared/infrastructure/base-api.js'
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js'

export class CatalogApi extends BaseApi {
  constructor() {
    super()
    this.products = new BaseEndpoint(this, import.meta.env.VITE_PRODUCTS_ENDPOINT_PATH)
  }
}
