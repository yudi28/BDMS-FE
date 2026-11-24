import apiClient from './api-client'
import type { ApiResponse } from '@/types/api'
import type { LoginRequest, LoginResponse, RefreshTokenRequest } from '@/types/auth'

/** POST /api/v1/auth/login */
export function login(request: LoginRequest) {
  return apiClient.post<ApiResponse<LoginResponse>>('/api/v1/auth/login', request)
}

/** POST /api/v1/auth/refresh */
export function refresh(request: RefreshTokenRequest) {
  return apiClient.post<ApiResponse<LoginResponse>>('/api/v1/auth/refresh', request)
}
