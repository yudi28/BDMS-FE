/** GET /api/v1/branches/{id} — response data (BranchResponse schema) */
export interface BranchResponse {
  id: string
  bankId: string
  bankName: string
  areaId: string
  areaName: string
  code: string
  name: string
  status: string
  address: string
  createdAt: string
  updatedAt: string
}

/** POST /api/v1/branches — request (CreateBranchRequest schema) */
export interface CreateBranchRequest {
  bankId: string
  areaId: string
  code: string
  name: string
  address?: string
}

/** PUT /api/v1/branches/{id} — request (UpdateBranchRequest schema) */
export interface UpdateBranchRequest {
  name?: string
  status?: string
  address?: string
}
