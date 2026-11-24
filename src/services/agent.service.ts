import apiClient from './api-client'
import type { ApiResponse, PagedResponse } from '@/types/api'
import type { AgentResponse, CreateAgentRequest, UpdateAgentRequest, LifecycleActionRequest, RejectRequest, LifecycleHistoryResponse } from '@/types/agent'

/** GET /api/v1/agents?page&size */
export function getAgents(page = 0, size = 20) {
  return apiClient.get<ApiResponse<PagedResponse<AgentResponse>>>('/api/v1/agents', {
    params: { page, size },
  })
}

/** GET /api/v1/agents/{id} */
export function getAgent(id: string) {
  return apiClient.get<ApiResponse<AgentResponse>>(`/api/v1/agents/${id}`)
}

/** POST /api/v1/agents */
export function createAgent(request: CreateAgentRequest) {
  return apiClient.post<ApiResponse<AgentResponse>>('/api/v1/agents', request)
}

/** PUT /api/v1/agents/{id} */
export function updateAgent(id: string, request: UpdateAgentRequest) {
  return apiClient.put<ApiResponse<AgentResponse>>(`/api/v1/agents/${id}`, request)
}

export function submitAgent(id: string, request: LifecycleActionRequest) {
  return apiClient.post<ApiResponse<void>>(`/api/v1/agents/${id}/submit`, request)
}

export function verifyAgent(id: string, request: LifecycleActionRequest) {
  return apiClient.post<ApiResponse<void>>(`/api/v1/agents/${id}/verify`, request)
}

export function approveAgent(id: string, request: LifecycleActionRequest) {
  return apiClient.post<ApiResponse<void>>(`/api/v1/agents/${id}/approve`, request)
}

export function rejectAgent(id: string, request: RejectRequest) {
  return apiClient.post<ApiResponse<void>>(`/api/v1/agents/${id}/reject`, request)
}

export function activateAgent(id: string, request: LifecycleActionRequest) {
  return apiClient.post<ApiResponse<void>>(`/api/v1/agents/${id}/activate`, request)
}

export function deactivateAgent(id: string, request: RejectRequest) {
  return apiClient.post<ApiResponse<void>>(`/api/v1/agents/${id}/deactivate`, request)
}

export function getLifecycleHistory(id: string, page = 0, size = 20) {
  return apiClient.get<ApiResponse<PagedResponse<LifecycleHistoryResponse>>>(`/api/v1/agents/${id}/lifecycle-history`, {
    params: { page, size },
  })
}
