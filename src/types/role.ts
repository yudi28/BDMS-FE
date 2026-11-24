/** GET /api/v1/roles/{id} — response data (RoleResponse schema) */
export interface RoleResponse {
  id: string
  code: string
  name: string
  description: string
  createdAt: string
}
