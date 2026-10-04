import { BaseEntity } from '../../../shared/domain/model/base-entity.js'

export class PurchaseItem {
    constructor({ productId, productName, quantity, unitCost }) {
        Object.assign(this, { productId, productName, quantity, unitCost })
    }

    get subtotal() {
        return Math.round(this.quantity * this.unitCost * 100) / 100
    }
}

// A purchase starts PENDING and does not change the stock (R15);
// receiving it creates the IN movements (R16).
// status: 'PENDING' | 'RECEIVED' | 'CANCELLED'
export class Purchase extends BaseEntity {
    constructor({
                    id,
                    date,
                    status,
                    total,
                    supplierId,
                    supplierName,
                    items,
                    movements,
                    restockingNeedId
                }) {
        super(id)

        Object.assign(this, {
            date,
            status,
            total,
            supplierId,
            supplierName,
            items,
            movements,
            restockingNeedId
        })
    }

    get isPending() {
        return this.status === 'PENDING'
    }
}

export class Supplier extends BaseEntity {
    constructor({ id = null, name, email, phone }) {
        super(id)
        Object.assign(this, { name, email, phone })
    }
}

// What the "New purchase" form needs from the catalog (a snapshot)
export class PurchaseProductOption {
    constructor({ id, name, purchaseCost, usualSupplier }) {
        Object.assign(this, {
            id,
            name,
            purchaseCost,
            usualSupplier
        })
    }
}