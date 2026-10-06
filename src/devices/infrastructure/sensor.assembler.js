import { BaseAssembler } from '../../shared/infrastructure/base-assembler.js'
import { LinkableProduct, Sensor } from '../domain/model/sensor.entity.js'

// API resource (Spanish names) <-> Sensor entity (English names)
export class SensorAssembler extends BaseAssembler {
    toEntityFromResource(r) {
        return new Sensor({
            id: r.id,
            code: r.codigo,
            productId: r.productoId,
            productName: r.productoNombre,
            status: r.estado,
            lastReadingAt: r.ultimaLecturaAt,
            weightKg: r.pesoKg,
            units: r.unidades,
        })
    }
    toResourceFromEntity(e) {
        return {
            id: e.id,
            codigo: e.code,
            productoId: e.productId,
            productoNombre: e.productName,
            estado: e.status,
            ultimaLecturaAt: e.lastReadingAt,
            pesoKg: e.weightKg,
            unidades: e.units,
        }
    }
    toLinkable(r) {
        return new LinkableProduct({ id: r.id, name: r.nombre, unitWeight: r.pesoUnitario, hasSensor: r.sensorId !== null })
    }
    toLinkables(response) {
        return response.data.map((r) => this.toLinkable(r))
    }
}