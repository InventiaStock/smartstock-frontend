// The signed-in user. The business type ('minimarket' | 'bodega') decides which menu and screens are enabled (US01).
export class UserSession {
  constructor({ token, email, businessName, businessType }) {
    Object.assign(this, { token, email, businessName, businessType })
  }
}