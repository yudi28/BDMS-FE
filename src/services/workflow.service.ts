import apiClient from './api-client'
import type { ApiResponse, PagedResponse } from '@/types/api'
import type { WorkflowTaskResponse, WorkflowDecisionRequest } from '@/types/workflow'

export function getMyTasks(page = 0, size = 20, status?: string) {
  return apiClient.get<ApiResponse<PagedResponse<WorkflowTaskResponse>>>('/api/v1/workflow/tasks/my', {
    params: { page, size, status: status || undefined },
  })
}

export function getTask(taskId: string) {
  return apiClient.get<ApiResponse<WorkflowTaskResponse>>(`/api/v1/workflow/tasks/${taskId}`)
}

export function claimTask(taskId: string) {
  return apiClient.post<ApiResponse<void>>(`/api/v1/workflow/tasks/${taskId}/claim`)
}

export function approveTask(taskId: string, request: WorkflowDecisionRequest) {
  return apiClient.post<ApiResponse<void>>(`/api/v1/workflow/tasks/${taskId}/approve`, request)
}

export function rejectTask(taskId: string, request: WorkflowDecisionRequest) {
  return apiClient.post<ApiResponse<void>>(`/api/v1/workflow/tasks/${taskId}/reject`, request)
}
