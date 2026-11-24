import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { login as loginApi } from '@/services/auth.service'
import { TOKEN_KEY, REFRESH_KEY } from '@/services/api-client'
import type { LoginRequest, JwtPayload } from '@/types/auth'

export const useAuthStore = defineStore(
  'auth',
  () => {
    const accessToken = ref<string | null>(null)
    const refreshToken = ref<string | null>(null)
    const authenticated = ref(false)
    const currentUser = ref<{ username: string; roles: string[] } | null>(null)

    // Computed
    const userRoles = computed(() => currentUser.value?.roles ?? [])
    const isAdmin = computed(() => userRoles.value.includes('ROLE_ADMIN'))
    const isAuditor = computed(() => userRoles.value.includes('ROLE_AUDITOR'))
    const username = computed(() => currentUser.value?.username ?? '')

    function hasRole(role: string): boolean {
      return userRoles.value.includes(role)
    }

    function hasAnyRole(roles: string[]): boolean {
      return roles.some((r) => userRoles.value.includes(r))
    }

    /** Decode JWT payload (base64url) */
    function decodeJwt(token: string): JwtPayload | null {
      try {
        const parts = token.split('.')
        if (parts.length !== 3) return null
        const payload = parts[1]
        const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'))
        return JSON.parse(decoded)
      } catch {
        return null
      }
    }

    /** Login action */
    async function login(credentials: LoginRequest) {
      const response = await loginApi(credentials)
      const data = response.data.data

      accessToken.value = data.accessToken
      refreshToken.value = data.refreshToken
      authenticated.value = true

      // Persist tokens in sessionStorage for API client interceptor
      sessionStorage.setItem(TOKEN_KEY, data.accessToken)
      sessionStorage.setItem(REFRESH_KEY, data.refreshToken)

      // Decode JWT to extract user info
      const payload = decodeJwt(data.accessToken)
      if (payload) {
        currentUser.value = {
          username: payload.sub,
          roles: payload.roles || [],
        }
      }
    }

    /** Update tokens after refresh */
    function updateTokens(newAccessToken: string, newRefreshToken: string) {
      accessToken.value = newAccessToken
      refreshToken.value = newRefreshToken
      sessionStorage.setItem(TOKEN_KEY, newAccessToken)
      sessionStorage.setItem(REFRESH_KEY, newRefreshToken)

      const payload = decodeJwt(newAccessToken)
      if (payload) {
        currentUser.value = {
          username: payload.sub,
          roles: payload.roles || [],
        }
      }
    }

    /** Logout action */
    function logout() {
      accessToken.value = null
      refreshToken.value = null
      authenticated.value = false
      currentUser.value = null
      sessionStorage.removeItem(TOKEN_KEY)
      sessionStorage.removeItem(REFRESH_KEY)
    }

    /** Initialize auth from sessionStorage on app load */
    function initializeAuth() {
      const storedToken = sessionStorage.getItem(TOKEN_KEY)
      const storedRefresh = sessionStorage.getItem(REFRESH_KEY)

      if (storedToken && storedRefresh) {
        const payload = decodeJwt(storedToken)
        if (payload && payload.exp * 1000 > Date.now()) {
          accessToken.value = storedToken
          refreshToken.value = storedRefresh
          authenticated.value = true
          currentUser.value = {
            username: payload.sub,
            roles: payload.roles || [],
          }
        } else {
          logout()
        }
      }
    }

    return {
      accessToken,
      refreshToken,
      authenticated,
      currentUser,
      userRoles,
      isAdmin,
      isAuditor,
      username,
      hasRole,
      hasAnyRole,
      login,
      updateTokens,
      logout,
      initializeAuth,
    }
  },
  {
    persist: {
      storage: sessionStorage,
      pick: ['accessToken', 'refreshToken', 'authenticated', 'currentUser'],
    },
  },
)
