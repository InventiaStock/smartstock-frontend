import { BaseAssembler } from '../../shared/infrastructure/base-assembler.js'
import { Product } from '../domain/model/product.entity.js'

// API resource (Spanish names) <-> Product entity (English names)
export class ProductAssembler extends BaseAssembler {
  toEntityFromResource(r) {
    return new Product({
      id: r.id, name: r.nombre, sku: r.sku, category: r.categoria, unitWeight: r.pesoUnitario,
      salePrice: r.precioVenta, purchaseCost: r.costoCompra, usualSupplier: r.proveedorHabitual,
      registeredStock: r.stockRegistrado, minThreshold: r.umbralMinimo, maxCapacity: r.capacidadMaxima, sensorId: r.sensorId,
    })
  }
  toResourceFromEntity(e) {
    return {
      id: e.id, nombre: e.name, sku: e.sku, categoria: e.category, pesoUnitario: e.unitWeight,
      precioVenta: e.salePrice, costoCompra: e.purchaseCost, proveedorHabitual: e.usualSupplier,
      stockRegistrado: e.registeredStock, umbralMinimo: e.minThreshold, capacidadMaxima: e.maxCapacity, sensorId: e.sensorId,
    }
  }
}
