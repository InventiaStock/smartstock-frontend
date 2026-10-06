import { toQuery } from '../../shared/domain/model/date-range.js'
import { BaseApi } from '../../shared/infrastructure/base-api.js'
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js'
import { SaleAssembler } from './sale.assembler.js'

// TS07 register sale, TS08 sales history and detail
export class SalesApi extends BaseApi {
  constructor() {
    super()
    this.sales = new BaseEndpoint(this, import.meta.env.VITE_SALES_ENDPOINT_PATH)
    this.assembler = new SaleAssembler()
  }

  // range = [start, end]; resolves to { sales: Sale[], total }
  async list(range) {
    const { data } = await this.sales.getAll(toQuery(range))
    return { sales: data.ventas.map((r) => this.assembler.toEntityFromResource(r)), total: data.total }
  }

  async get(id) {
    const { data } = await this.sales.getById(id)
    return this.assembler.toEntityFromResource(data)
  }

  // items: [{ productId, quantity, unitPrice }]; resolves to { id }
  async register(items) {
    const { data } = await this.sales.create(this.assembler.toRegisterRequest(items))
    return data
  }

  async productOptions() {
    const { data } = await this.http.get(import.meta.env.VITE_PRODUCTS_ENDPOINT_PATH)
    return data.map((r) => this.assembler.toOption(r))
  }
}