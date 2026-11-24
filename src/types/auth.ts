/** POST /api/v1/auth/login — request */
export interface LoginRequest {
  username: string
  password: string
}

/** POST /api/v1/auth/login — response data */
export interface LoginResponse {
  accessToken: string
  refreshToken: string
  tokenType: string
  expiresIn: number
}

/** POST /api/v1/auth/refresh — request */
export interface RefreshTokenRequest {
  refreshToken: string
}

/** Decoded JWT payload for RBAC (extracted client-side) */
export interface JwtPayload {
  sub: string
  roles: string[]
  exp: number
  iat: number
  [key: string]: unknown
}
