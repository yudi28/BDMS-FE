/** GET /api/v1/users/{id} — response data (UserResponse schema) */
export interface UserResponse {
  id: string
  username: string
  email: string
  status: string
  roles: string[]
  createdAt: string
  updatedAt: string
}

/** POST /api/v1/users — request (CreateUserRequest schema) */
export interface CreateUserRequest {
  username: string
  email: string
  password: string
  roleIds?: string[]
}

/** PUT /api/v1/users/{id} — request (UpdateUserRequest schema) */
export interface UpdateUserRequest {
  email?: string
  password?: string
  status?: string
  roleIds?: string[]
}
