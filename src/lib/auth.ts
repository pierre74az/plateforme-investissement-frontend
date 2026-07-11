import axios from 'axios'

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'
export const API_BASE = process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:3001'

export const api = axios.create({ baseURL: API_URL, withCredentials: true })

// ─── Intercepteur requête — injecte le Bearer token ──────────────────────────
api.interceptors.request.use((config) => {
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('token')
    if (token) config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// ─── Intercepteur réponse — refresh automatique sur 401 ──────────────────────
// Si l'access token (15 min) est expiré, on tente silencieusement un refresh
// via le cookie HttpOnly, puis on rejoue la requête originale.
let isRefreshing = false
let refreshQueue: Array<(token: string) => void> = []

api.interceptors.response.use(
  res => res,
  async err => {
    const original = err.config
    if (err.response?.status === 401 && !original._retry) {
      if (isRefreshing) {
        // Une requête de refresh est déjà en cours — mettre en file d'attente
        return new Promise(resolve => {
          refreshQueue.push((token: string) => {
            original.headers['Authorization'] = `Bearer ${token}`
            resolve(api(original))
          })
        })
      }
      original._retry = true
      isRefreshing = true
      try {
        const { data } = await axios.post(
          `${API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        )
        const newToken = data.accessToken
        localStorage.setItem('token', newToken)
        // Rejouer les requêtes en attente
        refreshQueue.forEach(cb => cb(newToken))
        refreshQueue = []
        original.headers['Authorization'] = `Bearer ${newToken}`
        return api(original)
      } catch {
        // Refresh échoué → déconnecter l'utilisateur
        clearAuth()
        if (typeof window !== 'undefined') window.location.href = '/auth/login'
        return Promise.reject(err)
      } finally {
        isRefreshing = false
      }
    }
    return Promise.reject(err)
  }
)

export const saveAuth = (token: string, user: any) => {
  localStorage.setItem('token', token)
  localStorage.setItem('user', JSON.stringify(user))
}

export const clearAuth = () => {
  localStorage.removeItem('token')
  localStorage.removeItem('user')
}

export const getUser = () => {
  if (typeof window === 'undefined') return null
  const u = localStorage.getItem('user')
  return u ? JSON.parse(u) : null
}

export const getToken = () => {
  if (typeof window === 'undefined') return null
  return localStorage.getItem('token')
}
