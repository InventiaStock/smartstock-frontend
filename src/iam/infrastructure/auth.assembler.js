import { UserSession } from '../domain/model/user-session.entity.js'

// Auth resource shapes of the Fake API (English names, the only context whose API already speaks English):
//   POST /auth/login            body { email, password }
//                               -> 200 session | 401 { code: 'INVALID_CREDENTIALS' }  (R3: never says which field failed)
//   POST /auth/register         body { businessName, email, password, businessType: 'minimarket' | 'bodega' }
//                               -> 201 session | 400 { code: 'INCOMPLETE' } | 409 { code: 'EMAIL_TAKEN' }  (R1)
//   POST /auth/forgot-password  body { email } -> 200 { sent: true, email, expiresInHours: 24 }  (R4, same answer if the email is unknown)
//   session = { token, email, businessName, businessType }
export class AuthAssembler {
  toSessionFromResource(r) {
    return new UserSession({ token: r.token, email: r.email, businessName: r.businessName, businessType: r.businessType })
  }
}