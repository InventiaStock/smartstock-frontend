// type: 'SALE' | 'PURCHASE'
export class ActivityItem {
  constructor({ type, id, total }) {
    Object.assign(this, { type, id, total })
  }

  // Route of the sale or purchase this activity points to
  get link() {
    return `${this.type === 'SALE' ? '/sales' : '/purchases'}/${this.id}`
  }
}

// level: 'lowStock' | 'healthy'
export class StockOverviewItem {
  constructor({ productId, name, units, level, sensor }) {
    Object.assign(this, { productId, name, units, level, sensor })
  }
}

// Day summary of the business (M17). Analytics only reads what the other contexts already know.
// salesToday / purchasesToday: { total, count }
export class DashboardSummary {
  constructor({ salesToday, purchasesToday, lowStockAlerts, recentActivity, stockOverview }) {
    Object.assign(this, { salesToday, purchasesToday, lowStockAlerts, recentActivity, stockOverview })
  }
}
