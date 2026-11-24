/**
 * Status-to-Vuetify-color mapping.
 * Matches bdms-frontend-spec.json → statusPresentation exactly.
 */
const STATUS_COLOR_MAP: Record<string, string> = {
  DRAFT: 'warning',
  PENDING_ACTIVATION: 'info',
  ACTIVE: 'success',
  SUSPENDED: 'warning',
  CLOSED: 'error',
  SUBMITTED: 'info',
  VERIFICATION: 'info',
  APPROVED: 'success',
  REJECTED: 'error',
  INACTIVE: 'secondary',
  TERMINATED: 'error',
  LOCKED: 'error',
}

/** Get Vuetify color name for a status string */
export function getStatusColor(status: string | null | undefined): string {
  if (!status) return 'secondary'
  return STATUS_COLOR_MAP[status.toUpperCase()] ?? 'secondary'
}

/** Format status for display (replace underscores, title-case) */
export function formatStatus(status: string | null | undefined): string {
  if (!status) return '—'
  return status
    .replace(/_/g, ' ')
    .toLowerCase()
    .replace(/\b\w/g, (c) => c.toUpperCase())
}
