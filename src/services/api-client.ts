import axios from 'axios'
import type { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import type { ApiResponse } from '@/types/api'
import type { LoginResponse, RefreshTokenRequest } from '@/types/auth'

const TOKEN_KEY = 'bdms_access_token'
const REFRESH_KEY = 'bdms_refresh_token'

let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error: unknown) => void
}> = []

function processQueue(error: unknown, token: string | null = null) {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

/** Centralized Axios API client */
const apiClient: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
})

/** Request interceptor — attach Bearer token */
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = sessionStorage.getItem(TOKEN_KEY)
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error),
)

/** Response interceptor — handle 401 with token refresh */
apiClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error) => {
    const originalRequest = error.config

    // Only attempt refresh for 401 errors and not for auth endpoints
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url?.includes('/auth/login') &&
      !originalRequest.url?.includes('/auth/refresh')
    ) {
      if (isRefreshing) {
        // Queue the request while refreshing
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              resolve(apiClient(originalRequest))
            },
            reject,
          })
        })
      }

      originalRequest._retry = true
      isRefreshing = true

      const refreshToken = sessionStorage.getItem(REFRESH_KEY)
      if (!refreshToken) {
        clearAuthState()
        window.location.href = '/login'
        return Promise.reject(error)
      }

      try {
        const refreshPayload: RefreshTokenRequest = { refreshToken }
        const response = await axios.post<ApiResponse<LoginResponse>>(
          `${apiClient.defaults.baseURL}/api/v1/auth/refresh`,
          refreshPayload,
          { headers: { 'Content-Type': 'application/json' } },
        )

        const { accessToken, refreshToken: newRefreshToken } = response.data.data
        sessionStorage.setItem(TOKEN_KEY, accessToken)
        sessionStorage.setItem(REFRESH_KEY, newRefreshToken)

        processQueue(null, accessToken)

        originalRequest.headers.Authorization = `Bearer ${accessToken}`
        return apiClient(originalRequest)
      } catch (refreshError) {
        processQueue(refreshError, null)
        clearAuthState()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    return Promise.reject(error)
  },
)

function clearAuthState() {
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(REFRESH_KEY)
}

export { TOKEN_KEY, REFRESH_KEY }
export default apiClient
