import axios from 'axios'
import { iamInterceptor } from '../../iam/infrastructure/iam.interceptor.js'

// One Axios instance for the whole app. The base URL lives only in .env.*
export class BaseApi {
  constructor() {
    this.http = axios.create({ baseURL: import.meta.env.VITE_API_BASE_URL })
    this.http.interceptors.request.use(iamInterceptor)
  }
}
