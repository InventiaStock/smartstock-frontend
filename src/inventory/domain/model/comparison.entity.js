// result: 'MATCH' | 'DISCREPANCY' | 'REGISTERED_ONLY'
// One product compared: registered stock vs the weight of its online sensor (R18). The sensor never changes the stock.
export class ComparisonRow {
  constructor({ productId, productName, registeredStock, weightKg, physicalUnits, differencePct, result }) {
    Object.assign(this, { productId, productName, registeredStock, weightKg, physicalUnits, differencePct, result })
  }

  // Tag shown in the table: match | discrepancy | registeredOnly
  get statusKey() {
    return this.result === 'MATCH' ? 'match' : this.result === 'DISCREPANCY' ? 'discrepancy' : 'registeredOnly'
  }
}

// rows: ComparisonRow[]   alertId: id of the active DISCREPANCY alert or null
export class Comparison {
  constructor({ rows, discrepancies, alertId }) {
    Object.assign(this, { rows, discrepancies, alertId })
  }
}
