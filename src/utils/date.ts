import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'

dayjs.extend(relativeTime)

/** Format ISO date-time to display string */
export function formatDateTime(value: string | null | undefined): string {
  if (!value) return '—'
  return dayjs(value).format('DD MMM YYYY HH:mm')
}

/** Format ISO date-time to date only */
export function formatDate(value: string | null | undefined): string {
  if (!value) return '—'
  return dayjs(value).format('DD MMM YYYY')
}

/** Format ISO date-time to relative time (e.g. "2 hours ago") */
export function formatRelative(value: string | null | undefined): string {
  if (!value) return '—'
  return dayjs(value).fromNow()
}
