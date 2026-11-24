import { ref } from 'vue'
import type { AxiosError } from 'axios'
import type { ApiResponse } from '@/types/api'

export interface ApiError {
  message: string
  errorCode: string | null
  traceId: string | null
  status: number | null
}

/**
 * Composable for extracting and managing API error state.
 * Parses the backend ApiResponse envelope for errorCode, message, traceId.
 */
export function useApiError() {
  const error = ref<ApiError | null>(null)

  function clearError() {
    error.value = null
  }

  function handleError(err: unknown) {
    const axiosError = err as AxiosError<ApiResponse<unknown>>

    if (axiosError.response?.data) {
      const data = axiosError.response.data
      error.value = {
        message: data.message || getDefaultMessage(axiosError.response.status),
        errorCode: data.errorCode || null,
        traceId: data.traceId || null,
        status: axiosError.response.status,
      }
    } else if (axiosError.message) {
      error.value = {
        message: axiosError.message === 'Network Error'
          ? 'Unable to connect to the server. Please check your connection.'
          : axiosError.message,
        errorCode: null,
        traceId: null,
        status: null,
      }
    } else {
      error.value = {
        message: 'An unexpected error occurred.',
        errorCode: null,
        traceId: null,
        status: null,
      }
    }
  }

  return { error, clearError, handleError }
}

function getDefaultMessage(status: number): string {
  switch (status) {
    case 400: return 'Invalid request. Please check your input.'
    case 401: return 'Authentication required. Please log in.'
    case 403: return 'You do not have permission to perform this action.'
    case 404: return 'The requested resource was not found.'
    case 409: return 'A conflict occurred. The resource may already exist.'
    case 500: return 'An internal server error occurred. Please try again later.'
    default: return 'An unexpected error occurred.'
  }
}
