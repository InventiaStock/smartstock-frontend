import { BaseEntity } from '../../../shared/domain/model/base-entity.js'

export class Alert extends BaseEntity {
  constructor({
    id, type, productId, productName, referenceStock, source, status,
    minutesSinceReading, restockingNeedId = null,
    registeredStock = null, physicalStock = null,
    differencePct = null, currentStock = null,
    minThreshold = null, resolvedAt = null,
  }) {
    super(id)
    Object.assign(this, {
      type, productId, productName, referenceStock, source, status,
      minutesSinceReading, restockingNeedId,
      registeredStock, physicalStock, differencePct,
      currentStock, minThreshold, resolvedAt,
    })
  }

  get isLowStock() {
    return this.type === 'LOW_STOCK'
  }

  get isActive() {
    return this.status === 'ACTIVE'
  }
}

export class RestockingNeed extends BaseEntity {
  constructor({ id, productId, alertId, status, purchaseId = null }) {
    super(id)
    Object.assign(this, { productId, alertId, status, purchaseId })
  }
}

export class NotificationChannel extends BaseEntity {
  constructor({ id, channel, destination, active }) {
    super(id)
    Object.assign(this, { channel, destination, active })
  }
}