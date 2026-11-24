import type { WorkflowDecisionRequest } from './workflow'

export interface TransferRequest {
  destinationBranchId: string
  effectiveFrom: string
  reason: string
}

export interface TransferResponse {
  id: string
  agentId: string
  sourceBranchId: string
  sourceBranchCode: string
  destinationBranchId: string
  destinationBranchCode: string
  effectiveFrom: string
  reason: string
  status: string
  requestedBy: string
  requestedAt: string
  completedAt?: string
}

// Re-export WorkflowDecisionRequest since transfers use it for decisions
export type { WorkflowDecisionRequest }
