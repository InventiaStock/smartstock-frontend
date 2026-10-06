import { BaseEntity } from '../../../shared/domain/model/base-entity.js'

export class SaleItem {
  constructor({ productId, productName, quantity, unitPrice }) {
    Object.assign(this, { productId, productName, quantity, unitPrice })
  }

  get subtotal() {
    return Math.round(this.quantity * this.unitPrice * 100) / 100
  }
}

// A completed sale. It never exceeds the registered stock (R13) and creates one OUT movement per item.
// items: SaleItem[]   movements: StockMovement[]
export class Sale extends BaseEntity {
  constructor({ id, date, status, total, items, movements }) {
    super(id)
    Object.assign(this, { date, status, total, items, movements })
  }
}

// What the "New sale" form needs from the catalog (a snapshot, the sale does not depend on the Product entity)
export class SaleProductOption {
  constructor({ id, name, salePrice, stock }) {
    Object.assign(this, { id, name, salePrice, stock })
  }
}