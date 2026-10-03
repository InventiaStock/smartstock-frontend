import { useIamStore } from '../application/iam.store.js'

export function authenticationGuard(to) {
  const iam = useIamStore()
  if (to.meta.requiresAuth && !iam.isSignedIn) return { name: 'sign-in' }
  if (to.meta.businessTypes && !to.meta.businessTypes.includes(iam.businessType)) return '/dashboard'
  if (to.meta.public && iam.isSignedIn && to.name === 'sign-in') return '/dashboard'
  return true
}
