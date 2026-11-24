import apiClient from './api-client'
import type { ApiResponse, PagedResponse } from '@/types/api'
import type { UserResponse, CreateUserRequest, UpdateUserRequest } from '@/types/user'

/** GET /api/v1/users?page&size */
export function getUsers(page = 0, size = 20) {
  return apiClient.get<ApiResponse<PagedResponse<UserResponse>>>('/api/v1/users', {
    params: { page, size },
  })
}

/** GET /api/v1/users/{id} */
export function getUser(id: string) {
  return apiClient.get<ApiResponse<UserResponse>>(`/api/v1/users/${id}`)
}

/** POST /api/v1/users */
export function createUser(request: CreateUserRequest) {
  return apiClient.post<ApiResponse<UserResponse>>('/api/v1/users', request)
}

/** PUT /api/v1/users/{id} */
export function updateUser(id: string, request: UpdateUserRequest) {
  return apiClient.put<ApiResponse<UserResponse>>(`/api/v1/users/${id}`, request)
}
