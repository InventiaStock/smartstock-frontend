import { BaseEntity } from '../../../shared/domain/model/base-entity.js'

// A stock change. The registered stock only moves through StockMovements (rule R17).
// type: 'IN' | 'OUT'   source: 'SALE' | 'PURCHASE' | 'ADJUSTMENT'
export class StockMovement extends BaseEntity {
    constructor({ id, productId, productName, type, source, sourceId, quantity, date }) {
        super(id)
        Object.assign(this, { productId, productName, type, source, sourceId, quantity, date })
    }

    // +10 for IN, -3 for OUT
    get signedQuantity() {
        return this.type === 'IN' ? this.quantity : -this.quantity
    }
}