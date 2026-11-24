/** GET /api/v1/areas/{id} — response data (AreaResponse schema) */
export interface AreaResponse {
  id: string
  regionId: string
  regionName: string
  code: string
  name: string
  status: string
  createdAt: string
  updatedAt: string
}

/** POST /api/v1/areas — request (CreateAreaRequest schema) */
export interface CreateAreaRequest {
  regionId: string
  code: string
  name: string
}

/** PUT /api/v1/areas/{id} — request (UpdateAreaRequest schema) */
export interface UpdateAreaRequest {
  name?: string
  status?: string
}
