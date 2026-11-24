export interface AssignmentCreateRequest {
  branchId: string
  effectiveFrom: string
  reason?: string
}

export interface AssignmentResponse {
  id: string
  agentId: string
  branchId: string
  branchCode: string
  branchName: string
  status: string
  effectiveFrom: string
  effectiveTo?: string
  assignmentType: string
  reason?: string
  createdAt: string
  updatedAt: string
}
