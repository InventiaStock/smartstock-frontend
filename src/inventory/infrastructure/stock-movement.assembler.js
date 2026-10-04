import { BaseAssembler } from '../../shared/infrastructure/base-assembler.js'
import { StockMovement } from '../domain/model/stock-movement.entity.js'

// API resource (Spanish names) <-> StockMovement entity (English names)
export class StockMovementAssembler extends BaseAssembler {
    toEntityFromResource(r) {
        return new StockMovement({
            id: r.id,
            productId: r.productoId,
            productName: r.productoNombre,
            type: r.tipo,
            source: r.origen,
            sourceId: r.origenId,
            quantity: r.cantidad,
            date: r.fecha,
        })
    }

    toResourceFromEntity(e) {
        return {
            id: e.id,
            productoId: e.productId,
            productoNombre: e.productName,
            tipo: e.type,
            origen: e.source,
            origenId: e.sourceId,
            cantidad: e.quantity,
            fecha: e.date,
        }
    }
}
