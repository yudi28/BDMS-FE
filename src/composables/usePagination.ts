import { ref, computed } from 'vue'

const PAGE_SIZE_OPTIONS = [20, 50, 100]

/**
 * Composable for server-side pagination state management.
 * Handles zero-based API ↔ 1-based UI conversion.
 */
export function usePagination(defaultSize = 20) {
  /** Zero-based page for API calls */
  const page = ref(0)
  /** Items per page */
  const size = ref(defaultSize)
  /** Total items from server */
  const totalElements = ref(0)
  /** Total pages from server */
  const totalPages = ref(0)

  /** 1-based page for UI display */
  const displayPage = computed(() => page.value + 1)

  /** Page size options */
  const pageSizeOptions = PAGE_SIZE_OPTIONS

  /** Items per page options for Vuetify data table */
  const itemsPerPageOptions = PAGE_SIZE_OPTIONS.map((s) => ({ value: s, title: `${s}` }))

  /** Update pagination from API response */
  function updateFromResponse(response: {
    page: number
    size: number
    totalElements: number
    totalPages: number
  }) {
    page.value = response.page
    size.value = response.size
    totalElements.value = response.totalElements
    totalPages.value = response.totalPages
  }

  /** Handle page change from UI (receives 1-based page) */
  function onPageChange(newPage: number) {
    page.value = newPage - 1
  }

  /** Handle items-per-page change */
  function onSizeChange(newSize: number) {
    size.value = newSize
    page.value = 0
  }

  /** Reset to first page */
  function resetPage() {
    page.value = 0
  }

  return {
    page,
    size,
    totalElements,
    totalPages,
    displayPage,
    pageSizeOptions,
    itemsPerPageOptions,
    updateFromResponse,
    onPageChange,
    onSizeChange,
    resetPage,
  }
}
