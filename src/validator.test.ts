import { describe, it, expect } from 'vitest'
import { validateEmail } from './validator'

describe('validateEmail', () => {
  it('returns true for a valid email', () => {
    expect(validateEmail('user@example.com')).toBe(true)
  })

  it('returns false when there is no @ symbol', () => {
    expect(validateEmail('userexample.com')).toBe(false)
  })

  it('returns false when there is no domain after @', () => {
    expect(validateEmail('user@')).toBe(false)
  })
})
