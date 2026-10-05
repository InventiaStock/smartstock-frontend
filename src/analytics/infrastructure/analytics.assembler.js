import { StockMovementAssembler } from '../../inventory/infrastructure/stock-movement.assembler.js'
import { ActivityItem, DashboardSummary, StockOverviewItem } from '../domain/model/dashboard-summary.entity.js'
import { Report } from '../domain/model/report.entity.js'

// API resource (Spanish names) -> entities (English names). Analytics is read-only.
//
// GET /dashboard -> {
//   ventasHoy: { total, cantidad }, comprasHoy: { total, cantidad }, alertasStockBajo,
//   actividadReciente: [{ tipo: 'SALE'|'PURCHASE', id, total, fecha }],
//   resumenStock: [{ productoId, nombre, unidades, nivel: 'lowStock'|'healthy', sensor }]
// }
// GET /reportes?desde&hasta -> { ventasTotal, comprasTotal, movimientos: [StockMovement resource], comprasPendientes: [id] }
export class AnalyticsAssembler {
  constructor() {
    this.movements = new StockMovementAssembler()
  }

  toDashboard(r) {
    return new DashboardSummary({
      salesToday: { total: r.ventasHoy.total, count: r.ventasHoy.cantidad },
      purchasesToday: { total: r.comprasHoy.total, count: r.comprasHoy.cantidad },
      lowStockAlerts: r.alertasStockBajo,
      recentActivity: r.actividadReciente.map((a) => new ActivityItem({ type: a.tipo, id: a.id, total: a.total })),
      stockOverview: r.resumenStock.map((s) => new StockOverviewItem({
        productId: s.productoId, name: s.nombre, units: s.unidades, level: s.nivel, sensor: s.sensor,
      })),
    })
  }

  toReport(r) {
    return new Report({
      salesTotal: r.ventasTotal,
      purchasesTotal: r.comprasTotal,
      movements: r.movimientos.map((m) => this.movements.toEntityFromResource(m)),
      pendingPurchases: r.comprasPendientes,
    })
  }
}
