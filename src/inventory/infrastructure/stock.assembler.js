import { Comparison, ComparisonRow } from '../domain/model/comparison.entity.js'
import { ProductSensorDetail, ProductSensorInfo, SensorReading } from '../domain/model/sensor-reading.entity.js'

// API resource (Spanish names) -> entities (English names). Read-only.
//
// GET /inventario/comparacion -> {
//   items: [{ productoId, productoNombre, stockRegistrado, pesoKg|null, unidadesFisicas|null, diferenciaPct|null, resultado }],
//   discrepancias, alertaId|null
// }
// GET /productos/:id/detalle -> {
//   sensor: { id, codigo, estado, pesoKg, unidades, ultimaLecturaAt } | null,
//   lecturas: [{ id, fecha, pesoKg, unidades }]   (plus producto, not used here: the catalog has it)
// }
export class StockAssembler {
  toComparison(r) {
    return new Comparison({
      rows: r.items.map((i) => new ComparisonRow({
        productId: i.productoId, productName: i.productoNombre, registeredStock: i.stockRegistrado,
        weightKg: i.pesoKg, physicalUnits: i.unidadesFisicas, differencePct: i.diferenciaPct, result: i.resultado,
      })),
      discrepancies: r.discrepancias,
      alertId: r.alertaId,
    })
  }

  toProductSensorDetail(r) {
    return new ProductSensorDetail({
      sensor: r.sensor
        ? new ProductSensorInfo({
            sensorId: r.sensor.id, code: r.sensor.codigo, status: r.sensor.estado, weightKg: r.sensor.pesoKg,
            units: r.sensor.unidades, lastReadingAt: r.sensor.ultimaLecturaAt,
          })
        : null,
      readings: r.lecturas.map((l) => new SensorReading({ id: l.id, date: l.fecha, weightKg: l.pesoKg, units: l.unidades })),
    })
  }
}
