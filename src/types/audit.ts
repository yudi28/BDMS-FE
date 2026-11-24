/** GET /api/v1/audit-logs — item in paged response (AuditLog schema) */
export interface AuditLog {
  id: string
  userId: string
  username: string
  action: string
  entityType: string
  entityId: string
  oldValue: string | null
  newValue: string | null
  ipAddress: string
  traceId: string
  createdAt: string
}
