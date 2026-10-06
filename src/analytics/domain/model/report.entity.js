// Totals and stock movements of a period (M18). A Pending purchase does not create an IN movement.
// movements: StockMovement[]   pendingPurchases: string[] (purchase ids)
export class Report {
  constructor({ salesTotal, purchasesTotal, movements, pendingPurchases }) {
    Object.assign(this, { salesTotal, purchasesTotal, movements, pendingPurchases })
  }
}
