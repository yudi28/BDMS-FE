import apiClient from './api-client'
import type { ApiResponse, PagedResponse } from '@/types/api'
import type { RoleResponse } from '@/types/role'

/** GET /api/v1/roles?page&size */
export function getRoles(page = 0, size = 20) {
  return apiClient.get<ApiResponse<PagedResponse<RoleResponse>>>('/api/v1/roles', {
    params: { page, size },
  })
}

/** GET /api/v1/roles/{id} */
export function getRole(id: string) {
  return apiClient.get<ApiResponse<RoleResponse>>(`/api/v1/roles/${id}`)
}
