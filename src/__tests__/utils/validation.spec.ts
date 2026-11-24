import { describe, it, expect } from 'vitest'
import { required, maxLength, minLength, email } from '@/utils/validation'

describe('required', () => {
  const rule = required('Field')

  it('returns error for empty string', () => {
    expect(rule('')).toBe('Field is required')
  })

  it('returns error for null', () => {
    expect(rule(null)).toBe('Field is required')
  })

  it('returns error for undefined', () => {
    expect(rule(undefined)).toBe('Field is required')
  })

  it('returns true for valid value', () => {
    expect(rule('hello')).toBe(true)
  })
})

describe('maxLength', () => {
  const rule = maxLength('Name', 10)

  it('returns true for value within limit', () => {
    expect(rule('short')).toBe(true)
  })

  it('returns error for value exceeding limit', () => {
    expect(rule('this is too long')).toBe('Name must be at most 10 characters')
  })

  it('returns true for non-string values', () => {
    expect(rule(123)).toBe(true)
  })
})

describe('minLength', () => {
  const rule = minLength('Password', 8)

  it('returns true for value meeting minimum', () => {
    expect(rule('12345678')).toBe(true)
  })

  it('returns error for value below minimum', () => {
    expect(rule('short')).toBe('Password must be at least 8 characters')
  })

  it('returns true for empty string (not enforcing required)', () => {
    expect(rule('')).toBe(true)
  })
})

describe('email', () => {
  const rule = email('Email')

  it('returns true for valid email', () => {
    expect(rule('test@example.com')).toBe(true)
  })

  it('returns error for invalid email', () => {
    expect(rule('not-an-email')).toBe('Email must be a valid email address')
  })

  it('returns true for empty string', () => {
    expect(rule('')).toBe(true)
  })
})
