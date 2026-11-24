import apiClient from './api-client'
import type { ApiResponse, PagedResponse } from '@/types/api'
import type { BranchResponse, CreateBranchRequest, UpdateBranchRequest } from '@/types/branch'

/** GET /api/v1/branches?page&size */
export function getBranches(page = 0, size = 20) {
  return apiClient.get<ApiResponse<PagedResponse<BranchResponse>>>('/api/v1/branches', {
    params: { page, size },
  })
}

/** GET /api/v1/branches/{id} */
export function getBranch(id: string) {
  return apiClient.get<ApiResponse<BranchResponse>>(`/api/v1/branches/${id}`)
}

/** POST /api/v1/branches */
export function createBranch(request: CreateBranchRequest) {
  return apiClient.post<ApiResponse<BranchResponse>>('/api/v1/branches', request)
}

/** PUT /api/v1/branches/{id} */
export function updateBranch(id: string, request: UpdateBranchRequest) {
  return apiClient.put<ApiResponse<BranchResponse>>(`/api/v1/branches/${id}`, request)
}
