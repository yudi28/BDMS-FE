import apiClient from './api-client'
import type { ApiResponse, PagedResponse } from '@/types/api'
import type { AssignmentResponse, AssignmentCreateRequest } from '@/types/assignment'

export function getAssignments(agentId: string, page = 0, size = 20) {
  return apiClient.get<ApiResponse<PagedResponse<AssignmentResponse>>>(`/api/v1/agents/${agentId}/assignments`, {
    params: { page, size },
  })
}

export function createAssignment(agentId: string, request: AssignmentCreateRequest) {
  return apiClient.post<ApiResponse<AssignmentResponse>>(`/api/v1/agents/${agentId}/assignments`, request)
}

export function getAssignment(agentId: string, assignmentId: string) {
  return apiClient.get<ApiResponse<AssignmentResponse>>(`/api/v1/agents/${agentId}/assignments/${assignmentId}`)
}
