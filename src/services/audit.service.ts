import apiClient from './api-client'
import type { ApiResponse, PagedResponse } from '@/types/api'
import type { AuditLog } from '@/types/audit'

/** GET /api/v1/audit-logs?page&size&entityType */
export function getAuditLogs(page = 0, size = 20, entityType?: string) {
  return apiClient.get<ApiResponse<PagedResponse<AuditLog>>>('/api/v1/audit-logs', {
    params: { page, size, ...(entityType ? { entityType } : {}) },
  })
}
