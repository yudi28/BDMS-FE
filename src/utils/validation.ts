/**
 * Reusable Vuetify form validation rules.
 * Constraints mirror backend OpenAPI maxLength/minLength/required.
 */

type ValidationRule = (value: unknown) => true | string

export function required(label: string): ValidationRule {
  return (v: unknown) => {
    if (v === null || v === undefined || v === '') return `${label} is required`
    return true
  }
}

export function maxLength(label: string, max: number): ValidationRule {
  return (v: unknown) => {
    if (typeof v === 'string' && v.length > max) return `${label} must be at most ${max} characters`
    return true
  }
}

export function minLength(label: string, min: number): ValidationRule {
  return (v: unknown) => {
    if (typeof v === 'string' && v.length > 0 && v.length < min) return `${label} must be at least ${min} characters`
    return true
  }
}

export function email(label: string): ValidationRule {
  return (v: unknown) => {
    if (typeof v === 'string' && v.length > 0 && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v)) {
      return `${label} must be a valid email address`
    }
    return true
  }
}

export function minMax(label: string, min: number, max: number): ValidationRule[] {
  return [minLength(label, min), maxLength(label, max)]
}

/** Password rules matching backend: min 8, max 100 */
export const passwordRules = (isRequired = true): ValidationRule[] => {
  const rules: ValidationRule[] = []
  if (isRequired) rules.push(required('Password'))
  rules.push(minLength('Password', 8))
  rules.push(maxLength('Password', 100))
  return rules
}
