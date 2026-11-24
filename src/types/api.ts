/** Generic API response envelope — matches backend ApiResponse<T> */
export interface ApiResponse<T> {
  success: boolean
  data: T
  message: string | null
  errorCode: string | null
  timestamp: string
  traceId: string
}

/** Paginated response — matches backend PagedResponse<T> */
export interface PagedResponse<T> {
  content: T[]
  page: number
  size: number
  totalElements: number
  totalPages: number
  last: boolean
}

/** Standard pagination request params (zero-based) */
export interface PaginationParams {
  page: number
  size: number
}
