/** GET /api/v1/agents/{id} — response data (AgentResponse schema) */
export interface AgentResponse {
  id: string
  agentCode: string
  nikMasked: string
  fullName: string
  email: string
  phone: string
  status: string
  createdAt: string
  updatedAt: string
}

/** POST /api/v1/agents — request (CreateAgentRequest schema) */
export interface CreateAgentRequest {
  agentCode: string
  nik: string
  fullName: string
  email?: string
  phone?: string
}

/** PUT /api/v1/agents/{id} — request (UpdateAgentRequest schema) */
export interface UpdateAgentRequest {
  fullName?: string
  email?: string
  phone?: string
  status?: string
}

export interface LifecycleActionRequest {
  reason?: string
}

export interface RejectRequest {
  reason: string
}

export interface LifecycleHistoryResponse {
  id: string
  agentId: string
  fromStatus: string
  toStatus: string
  reason?: string
  workflowInstanceId?: string
  changedBy: string
  changedAt: string
}
