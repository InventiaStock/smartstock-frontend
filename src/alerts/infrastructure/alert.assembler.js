import { BaseAssembler } from '../../shared/infrastructure/base-assembler.js'
import { Alert, NotificationChannel, RestockingNeed } from '../domain/model/alert.entity.js'

export class AlertAssembler extends BaseAssembler {
  toEntityFromResource(r) {
    return new Alert({
      id: r.id,
      type: r.tipo,
      productId: r.productoId,
      productName: r.productoNombre,
      referenceStock: r.stockReferencia,
      source: r.fuente,
      status: r.estado,
      minutesSinceReading: r.minutosDesdeLectura,
      restockingNeedId: r.necesidadId ?? null,
      registeredStock: r.stockRegistrado ?? null,
      physicalStock: r.stockFisico ?? null,
      differencePct: r.diferenciaPct ?? null,
      currentStock: r.stockActual,
      minThreshold: r.umbralMinimo,
      resolvedAt: r.resueltaEn,
    })
  }

  toResourceFromEntity(e) {
    return {
      id: Number(e.id),
      tipo: e.type,
      productoId: e.productId,
      productoNombre: e.productName,
      stockReferencia: e.referenceStock,
      fuente: e.source,
      estado: e.status,
      minutosDesdeLectura: e.minutesSinceReading,
      necesidadId: e.restockingNeedId,
      stockActual: e.currentStock,
      umbralMinimo: e.minThreshold,
      resueltaEn: e.resolvedAt,
    }
  }
}

export class RestockingNeedAssembler extends BaseAssembler {
  toEntityFromResource(r) {
    return new RestockingNeed({
      id: r.id,
      productId: r.productoId,
      alertId: r.alertaId,
      status: r.estado,
      purchaseId: r.compraId,
    })
  }

  toResourceFromEntity(e) {
    return {
      id: Number(e.id),
      productoId: e.productId,
      alertaId: e.alertId,
      estado: e.status,
      compraId: e.purchaseId,
    }
  }
}

export class NotificationChannelAssembler extends BaseAssembler {
  toEntityFromResource(r) {
    return new NotificationChannel({
      id: r.id,
      channel: r.canal,
      destination: r.destino,
      active: r.activo,
    })
  }

  toResourceFromEntity(e) {
    return {
      id: Number(e.id),
      canal: e.channel,
      destino: e.destination,
      activo: e.active,
    }
  }
}