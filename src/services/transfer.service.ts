import apiClient from './api-client'
import type { ApiResponse, PagedResponse } from '@/types/api'
import type { TransferResponse, TransferRequest, WorkflowDecisionRequest } from '@/types/transfer'

export function getTransfers(agentId: string, page = 0, size = 20) {
  return apiClient.get<ApiResponse<PagedResponse<TransferResponse>>>(`/api/v1/agents/${agentId}/transfers`, {
    params: { page, size },
  })
}

export function requestTransfer(agentId: string, request: TransferRequest) {
  return apiClient.post<ApiResponse<TransferResponse>>(`/api/v1/agents/${agentId}/transfers`, request)
}

export function approveTransfer(agentId: string, transferId: string, request: WorkflowDecisionRequest) {
  return apiClient.post<ApiResponse<void>>(`/api/v1/agents/${agentId}/transfers/${transferId}/approve`, request)
}

export function rejectTransfer(agentId: string, transferId: string, request: WorkflowDecisionRequest) {
  return apiClient.post<ApiResponse<void>>(`/api/v1/agents/${agentId}/transfers/${transferId}/reject`, request)
}
