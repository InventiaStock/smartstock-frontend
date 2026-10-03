// Adds the token to every request
export function iamInterceptor(config) {
  try {
    const session = JSON.parse(localStorage.getItem('smartstock.session'))
    if (session?.token) config.headers.Authorization = `Bearer ${session.token}`
  } catch { /* no session */ }
  return config
}
