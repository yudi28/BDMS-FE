import { describe, it, expect } from 'vitest'
import { getStatusColor, formatStatus } from '@/utils/status'

describe('getStatusColor', () => {
  it('returns success for ACTIVE', () => {
    expect(getStatusColor('ACTIVE')).toBe('success')
  })

  it('returns warning for DRAFT', () => {
    expect(getStatusColor('DRAFT')).toBe('warning')
  })

  it('returns error for CLOSED', () => {
    expect(getStatusColor('CLOSED')).toBe('error')
  })

  it('returns info for PENDING_ACTIVATION', () => {
    expect(getStatusColor('PENDING_ACTIVATION')).toBe('info')
  })

  it('returns error for TERMINATED', () => {
    expect(getStatusColor('TERMINATED')).toBe('error')
  })

  it('returns error for LOCKED', () => {
    expect(getStatusColor('LOCKED')).toBe('error')
  })

  it('returns secondary for unknown status', () => {
    expect(getStatusColor('UNKNOWN')).toBe('secondary')
  })

  it('returns secondary for null', () => {
    expect(getStatusColor(null)).toBe('secondary')
  })

  it('returns secondary for undefined', () => {
    expect(getStatusColor(undefined)).toBe('secondary')
  })

  it('is case-insensitive', () => {
    expect(getStatusColor('active')).toBe('success')
    expect(getStatusColor('Active')).toBe('success')
  })
})

describe('formatStatus', () => {
  it('formats ACTIVE as Active', () => {
    expect(formatStatus('ACTIVE')).toBe('Active')
  })

  it('formats PENDING_ACTIVATION as Pending Activation', () => {
    expect(formatStatus('PENDING_ACTIVATION')).toBe('Pending Activation')
  })

  it('returns — for null', () => {
    expect(formatStatus(null)).toBe('—')
  })

  it('returns — for undefined', () => {
    expect(formatStatus(undefined)).toBe('—')
  })
})
