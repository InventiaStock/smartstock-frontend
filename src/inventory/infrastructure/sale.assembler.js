import { BaseAssembler } from '../../shared/infrastructure/base-assembler.js'
import { Sale, SaleItem, SaleProductOption } from '../domain/model/sale.entity.js'
import { StockMovementAssembler } from './stock-movement.assembler.js'

// API resource (Spanish names) <-> Sale entity (English names)
//   GET  /ventas?desde&hasta -> { ventas: SaleResource[], total }
//   GET  /ventas/:id         -> SaleResource (with productoNombre/subtotal in the items and movimientos)
//   POST /ventas             body RegisterSaleRequest -> 201 { id }
//   errors: 400 NO_ITEMS | INVALID_QUANTITY, 404 PRODUCT_NOT_FOUND, 422 INSUFFICIENT_STOCK { productoNombre, available } | NO_SALE_PRICE { productoNombre }
//   SaleResource = { id: 'R-001', fecha: 'yyyy-MM-dd', estado: 'COMPLETED', total,
//                    items: [{ productoId, productoNombre?, cantidad, precioUnitario, subtotal? }], movimientos?: StockMovementResource[] }
//   RegisterSaleRequest = { items: [{ productoId, cantidad, precioUnitario }] }
//   SaleProductOptionResource (from GET /productos) = { id, nombre, precioVenta: number | null, stockRegistrado }
export class SaleAssembler extends BaseAssembler {
  constructor() {
    super()
    this.movements = new StockMovementAssembler()
  }

  toEntityFromResource(r) {
    return new Sale({
      id: r.id, date: r.fecha, status: r.estado, total: r.total,
      items: r.items.map((i) => new SaleItem({ productId: i.productoId, productName: i.productoNombre ?? '', quantity: i.cantidad, unitPrice: i.precioUnitario })),
      movements: (r.movimientos ?? []).map((m) => this.movements.toEntityFromResource(m)),
    })
  }

  toResourceFromEntity(e) {
    return {
      id: String(e.id), fecha: e.date, estado: e.status, total: e.total,
      items: e.items.map((i) => ({ productoId: i.productId, cantidad: i.quantity, precioUnitario: i.unitPrice })),
    }
  }

  // items: [{ productId, quantity, unitPrice }] -> RegisterSaleRequest
  toRegisterRequest(items) {
    return { items: items.map((i) => ({ productoId: i.productId, cantidad: i.quantity, precioUnitario: i.unitPrice })) }
  }

  toOption(r) {
    return new SaleProductOption({ id: r.id, name: r.nombre, salePrice: r.precioVenta, stock: r.stockRegistrado })
  }
}