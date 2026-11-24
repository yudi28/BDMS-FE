import apiClient from './api-client'
import type { ApiResponse, PagedResponse } from '@/types/api'
import type { AreaResponse, CreateAreaRequest, UpdateAreaRequest } from '@/types/area'

/** GET /api/v1/areas?page&size */
export function getAreas(page = 0, size = 20) {
  return apiClient.get<ApiResponse<PagedResponse<AreaResponse>>>('/api/v1/areas', {
    params: { page, size },
  })
}

/** GET /api/v1/areas/{id} */
export function getArea(id: string) {
  return apiClient.get<ApiResponse<AreaResponse>>(`/api/v1/areas/${id}`)
}

/** POST /api/v1/areas */
export function createArea(request: CreateAreaRequest) {
  return apiClient.post<ApiResponse<AreaResponse>>('/api/v1/areas', request)
}

/** PUT /api/v1/areas/{id} */
export function updateArea(id: string, request: UpdateAreaRequest) {
  return apiClient.put<ApiResponse<AreaResponse>>(`/api/v1/areas/${id}`, request)
}
