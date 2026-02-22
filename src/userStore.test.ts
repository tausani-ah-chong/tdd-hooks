import { describe, it, expect, beforeEach } from 'vitest'
import { UserStore } from './userStore'

describe('UserStore', () => {
  let store: UserStore

  beforeEach(() => {
    store = new UserStore()
  })

  it('starts with no users', () => {
    expect(store.findByEmail('anyone@example.com')).toBeUndefined()
  })

  it('saves a user and retrieves them by email', () => {
    store.save({ email: 'alice@example.com', passwordHash: 'abc123' })
    const user = store.findByEmail('alice@example.com')
    expect(user).toBeDefined()
    expect(user!.email).toBe('alice@example.com')
  })

  it('returns undefined for an email that was not saved', () => {
    store.save({ email: 'alice@example.com', passwordHash: 'abc123' })
    expect(store.findByEmail('bob@example.com')).toBeUndefined()
  })
})
