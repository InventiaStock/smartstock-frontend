import { BaseEntity } from '../../../shared/domain/model/base-entity.js'

// IoT weight sensor. status: 'online' | 'disconnected' | 'available'
// Online = it sent a reading in the last 5 minutes (R11); available = not linked to a product (R9).
export class Sensor extends BaseEntity {
    constructor({ id, code, productId, productName, status, lastReadingAt, weightKg, units }) {
        super(id)
        Object.assign(this, { code, productId, productName, status, lastReadingAt, weightKg, units })
    }

    get isAvailable() {
        return this.productId === null
    }

    get minutesSinceReading() {
        return this.lastReadingAt ? Math.max(0, Math.round((Date.now() - Date.parse(this.lastReadingAt)) / 60000)) : null
    }
}

// Product data needed to link a sensor (a snapshot: Devices does not depend on the catalog entity)
export class LinkableProduct {
    constructor({ id, name, unitWeight, hasSensor }) {
        Object.assign(this, { id, name, unitWeight, hasSensor })
    }
}