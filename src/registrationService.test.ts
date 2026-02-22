import { describe, it, expect, beforeEach } from 'vitest'
import { RegistrationService } from './registrationService'
import { UserStore } from './userStore'

describe('RegistrationService', () => {
  let store: UserStore
  let service: RegistrationService

  beforeEach(() => {
    store = new UserStore()
    service = new RegistrationService(store)
  })

  it('registers a valid user and saves them to the store', () => {
    service.register('alice@example.com', 'password123')
    expect(store.findByEmail('alice@example.com')).toBeDefined()
  })

  it('stores a hashed password, not the plain-text password', () => {
    service.register('alice@example.com', 'password123')
    const user = store.findByEmail('alice@example.com')!
    expect(user.passwordHash).not.toBe('password123')
    expect(user.passwordHash.length).toBeGreaterThan(0)
  })

  it('throws an error when the email is invalid', () => {
    expect(() => service.register('not-an-email', 'password123')).toThrow('Invalid email')
  })

  it('throws an error when the email is already registered', () => {
    service.register('alice@example.com', 'password123')
    expect(() => service.register('alice@example.com', 'other')).toThrow('Email already registered')
  })
})
