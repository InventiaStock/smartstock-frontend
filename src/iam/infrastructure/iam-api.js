import { BaseApi } from '../../shared/infrastructure/base-api.js'
import { AuthAssembler } from './auth.assembler.js'

// TS04 authentication endpoints (resources are described in auth.assembler.js)
export class IamApi extends BaseApi {
  constructor() {
    super()
    this.authPath = import.meta.env.VITE_AUTH_ENDPOINT_PATH
    this.assembler = new AuthAssembler()
  }

  async login(email, password) {
    const response = await this.http.post(`${this.authPath}/login`, { email, password })
    return this.assembler.toSessionFromResource(response.data)
  }

  async register(request) {
    const response = await this.http.post(`${this.authPath}/register`, request)
    return this.assembler.toSessionFromResource(response.data)
  }

  // resolves to { sent, email, expiresInHours }
  async forgotPassword(email) {
    const response = await this.http.post(`${this.authPath}/forgot-password`, { email })
    return response.data
  }
}