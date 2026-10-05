export class SensorReading {
  constructor({ id, date, weightKg, units }) {
    Object.assign(this, { id, date, weightKg, units })
  }
}

// Sensor block of the product details (M28). status: 'online' | 'disconnected'
export class ProductSensorInfo {
  constructor({ sensorId, code, status, weightKg, units, lastReadingAt }) {
    Object.assign(this, { sensorId, code, status, weightKg, units, lastReadingAt })
  }

  get minutesSinceReading() {
    return this.lastReadingAt ? Math.max(0, Math.round((Date.now() - Date.parse(this.lastReadingAt)) / 60000)) : null
  }
}

// sensor: ProductSensorInfo | null   readings: SensorReading[]
export class ProductSensorDetail {
  constructor({ sensor, readings }) {
    Object.assign(this, { sensor, readings })
  }
}
