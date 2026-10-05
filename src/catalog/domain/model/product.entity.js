import { BaseEntity } from '../../../shared/domain/model/base-entity.js'

// sensorStatus: 'online' | 'disconnected' | 'none'
export class Product extends BaseEntity {
  constructor({
                id, name, sku, category, unitWeight, salePrice, purchaseCost, usualSupplier, registeredStock,
                minThreshold, maxCapacity, sensorId, sensorStatus = 'none', sensorUnits = null,
              }) {
    super(id)
    Object.assign(this, {
      name, sku, category, unitWeight, salePrice, purchaseCost, usualSupplier, registeredStock,
      minThreshold, maxCapacity, sensorId, sensorStatus, sensorUnits,
    })
  }

  // The level uses the online sensor when available; otherwise the registered stock (R18, M27)
  get referenceStock() {
    return this.sensorStatus === 'online' && this.sensorUnits !== null
        ? this.sensorUnits
        : this.registeredStock
  }

  // 'lowStock' | 'healthy'
  get stockLevel() {
    return this.referenceStock <= this.minThreshold ? 'lowStock' : 'healthy'
  }

  // A product without a sale price cannot be sold (R14)
  get isSellable() {
    return !!this.salePrice && this.salePrice > 0
  }
}