import { BaseApi } from '../../shared/infrastructure/base-api.js'
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js'
import { toQuery } from '../../shared/domain/model/date-range.js'

// TS09 suppliers, TS10 register purchase, TS11 receive purchase, TS12 purchase history
export class PurchasesApi extends BaseApi {
    constructor() {
        super()
        this.purchasesPath = import.meta.env.VITE_PURCHASES_ENDPOINT_PATH
        this.purchases = new BaseEndpoint(this, this.purchasesPath)
        this.suppliers = new BaseEndpoint(
            this,
            import.meta.env.VITE_SUPPLIERS_ENDPOINT_PATH
        )
    }

    // range = [start, end]
    list(range) {
        return this.purchases.getAll(toQuery(range))
    }

    get(id) {
        return this.purchases.getById(id)
    }

    register(request) {
        return this.purchases.create(request)
    }

    receive(id) {
        return this.http.patch(
            `${this.purchasesPath}/${id}/recepcion`,
            {}
        )
    }

    // Products as the purchase form needs them
    // (resource only: the assembler builds the options)
    productOptions() {
        return this.http.get(
            import.meta.env.VITE_PRODUCTS_ENDPOINT_PATH
        )
    }
}