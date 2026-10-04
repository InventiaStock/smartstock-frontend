import { BaseAssembler } from '../../shared/infrastructure/base-assembler.js'
import { Purchase, PurchaseItem, PurchaseProductOption, Supplier } from '../domain/model/purchase.entity.js'
import { StockMovementAssembler } from './stock-movement.assembler.js'

const movements = new StockMovementAssembler()

// Purchase resource (API, Spanish names):
// { id, proveedorId, proveedorNombre?, fecha, estado, total, restockingNeedId,
//   items: [{ productoId, productoNombre?, cantidad, costoUnitario, subtotal? }], movimientos?: [StockMovement resource] }
// List resource: { compras: [Purchase resource], total }
// Register request: { proveedorId, fecha, restockingNeedId, items: [{ productoId, cantidad, costoUnitario }] }
export class PurchaseAssembler extends BaseAssembler {
    toEntityFromResource(r) {
        return new Purchase({
            id: r.id,
            date: r.fecha,
            status: r.estado,
            total: r.total,
            supplierId: r.proveedorId,
            supplierName: r.proveedorNombre ?? '',
            items: r.items.map((i) =>
                new PurchaseItem({
                    productId: i.productoId,
                    productName: i.productoNombre ?? '',
                    quantity: i.cantidad,
                    unitCost: i.costoUnitario
                })
            ),
            movements: (r.movimientos ?? []).map((m) =>
                movements.toEntityFromResource(m)
            ),
            restockingNeedId: r.restockingNeedId ?? null,
        })
    }

    toResourceFromEntity(e) {
        return {
            id: String(e.id),
            proveedorId: e.supplierId,
            fecha: e.date,
            estado: e.status,
            total: e.total,
            restockingNeedId: e.restockingNeedId,
            items: e.items.map((i) => ({
                productoId: i.productId,
                cantidad: i.quantity,
                costoUnitario: i.unitCost
            })),
        }
    }

    // Register request built from the values of the form
    toRegisterRequest({ supplierId, date, needId, items }) {
        return {
            proveedorId: supplierId,
            fecha: date,
            restockingNeedId: needId,
            items: items.map((i) => ({
                productoId: i.productId,
                cantidad: i.quantity,
                costoUnitario: i.unitCost
            })),
        }
    }

    // The list response is { compras, total }
    toListFromResponse(response) {
        return {
            purchases: response.data.compras.map((r) =>
                this.toEntityFromResource(r)
            ),
            total: response.data.total
        }
    }

    // Product resource of the catalog -> option of the form
    toOption(r) {
        return new PurchaseProductOption({
            id: r.id,
            name: r.nombre,
            purchaseCost: r.costoCompra,
            usualSupplier: r.proveedorHabitual
        })
    }

    toOptions(response) {
        return response.data.map((r) =>
            this.toOption(r)
        )
    }
}

// Supplier resource: { id, nombre, correo, telefono }
export class SupplierAssembler extends BaseAssembler {
    toEntityFromResource(r) {
        return new Supplier({
            id: r.id,
            name: r.nombre,
            email: r.correo,
            phone: r.telefono
        })
    }

    toResourceFromEntity(e) {
        return {
            id: e.id === null ? null : Number(e.id),
            nombre: e.name,
            correo: e.email,
            telefono: e.phone
        }
    }
}