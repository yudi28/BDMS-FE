import apiClient from './api-client'
import type { ApiResponse, PagedResponse } from '@/types/api'
import type { BankResponse, CreateBankRequest, UpdateBankRequest } from '@/types/bank'

/** GET /api/v1/banks?page&size */
export function getBanks(page = 0, size = 20) {
  return apiClient.get<ApiResponse<PagedResponse<BankResponse>>>('/api/v1/banks', {
    params: { page, size },
  })
}

/** GET /api/v1/banks/{id} */
export function getBank(id: string) {
  return apiClient.get<ApiResponse<BankResponse>>(`/api/v1/banks/${id}`)
}

/** POST /api/v1/banks */
export function createBank(request: CreateBankRequest) {
  return apiClient.post<ApiResponse<BankResponse>>('/api/v1/banks', request)
}

/** PUT /api/v1/banks/{id} */
export function updateBank(id: string, request: UpdateBankRequest) {
  return apiClient.put<ApiResponse<BankResponse>>(`/api/v1/banks/${id}`, request)
}
