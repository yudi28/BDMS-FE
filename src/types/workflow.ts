export interface WorkflowDecisionRequest {
  reason?: string
}

export interface WorkflowTaskResponse {
  id: string
  workflowInstanceId: string
  workflowType: string
  entityType: string
  entityId: string
  taskType: string
  status: string
  assignedRole: string
  assignedUserId?: string
  createdAt: string
  claimedAt?: string
  completedAt?: string
  decisionReason?: string
}
