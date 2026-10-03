import { BaseEntity } from '../../../shared/domain/model/base-entity.js'

export class Product extends BaseEntity {
  constructor({ id, name, sku, category, unitWeight, salePrice, purchaseCost, usualSupplier, registeredStock, minThreshold, maxCapacity, sensorId }) {
    super(id)
    Object.assign(this, { name, sku, category, unitWeight, salePrice, purchaseCost, usualSupplier, registeredStock, minThreshold, maxCapacity, sensorId })
  }
  // 'lowStock' | 'healthy'
  get stockLevel() {
    return this.registeredStock <= this.minThreshold ? 'lowStock' : 'healthy'
  }
}
