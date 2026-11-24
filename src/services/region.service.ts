import apiClient from './api-client'
import type { ApiResponse, PagedResponse } from '@/types/api'
import type { RegionResponse, CreateRegionRequest, UpdateRegionRequest } from '@/types/region'

/** GET /api/v1/regions?page&size */
export function getRegions(page = 0, size = 20) {
  return apiClient.get<ApiResponse<PagedResponse<RegionResponse>>>('/api/v1/regions', {
    params: { page, size },
  })
}

/** GET /api/v1/regions/{id} */
export function getRegion(id: string) {
  return apiClient.get<ApiResponse<RegionResponse>>(`/api/v1/regions/${id}`)
}

/** POST /api/v1/regions */
export function createRegion(request: CreateRegionRequest) {
  return apiClient.post<ApiResponse<RegionResponse>>('/api/v1/regions', request)
}

/** PUT /api/v1/regions/{id} */
export function updateRegion(id: string, request: UpdateRegionRequest) {
  return apiClient.put<ApiResponse<RegionResponse>>(`/api/v1/regions/${id}`, request)
}
