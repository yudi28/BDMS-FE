/** GET /api/v1/regions/{id} — response data (RegionResponse schema) */
export interface RegionResponse {
  id: string
  bankId: string
  bankName: string
  code: string
  name: string
  status: string
  createdAt: string
  updatedAt: string
}

/** POST /api/v1/regions — request (CreateRegionRequest schema) */
export interface CreateRegionRequest {
  bankId: string
  code: string
  name: string
}

/** PUT /api/v1/regions/{id} — request (UpdateRegionRequest schema) */
export interface UpdateRegionRequest {
  name?: string
  status?: string
}
