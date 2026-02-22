import { describe, it, expect } from 'vitest'
import { hashPassword } from './hasher'

describe('hashPassword', () => {
  it('returns a string different from the original password', () => {
    const hash = hashPassword('secret123')
    expect(hash).not.toBe('secret123')
  })

  it('produces the same hash for the same password', () => {
    expect(hashPassword('secret123')).toBe(hashPassword('secret123'))
  })

  it('produces different hashes for different passwords', () => {
    expect(hashPassword('abc')).not.toBe(hashPassword('xyz'))
  })
})
