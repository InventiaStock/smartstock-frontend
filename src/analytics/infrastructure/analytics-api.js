import { toQuery } from '../../shared/domain/model/date-range.js'
import { BaseApi } from '../../shared/infrastructure/base-api.js'
import { BaseEndpoint } from '../../shared/infrastructure/base-endpoint.js'

// US15 dashboard, US25 reports of purchases and stock movements
export class AnalyticsApi extends BaseApi {
  constructor() {
    super()
    this.dashboardEndpoint = new BaseEndpoint(this, import.meta.env.VITE_DASHBOARD_ENDPOINT_PATH)
    this.reportsEndpoint = new BaseEndpoint(this, import.meta.env.VITE_REPORTS_ENDPOINT_PATH)
  }

  dashboard() {
    return this.dashboardEndpoint.getAll()
  }

  // range = [start, end]
  report(range) {
    return this.reportsEndpoint.getAll(toQuery(range))
  }
}
