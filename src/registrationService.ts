import { UserStore } from './userStore'
import { validateEmail } from './validator'
import { hashPassword } from './hasher'

export class RegistrationService {
  constructor(private store: UserStore) {}

  register(email: string, password: string): void {
    if (!validateEmail(email)) throw new Error('Invalid email')
    if (this.store.findByEmail(email)) throw new Error('Email already registered')
    this.store.save({ email, passwordHash: hashPassword(password) })
  }
}
