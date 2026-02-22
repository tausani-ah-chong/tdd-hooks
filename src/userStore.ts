export interface User {
  email: string
  passwordHash: string
}

export class UserStore {
  private users: User[] = []

  save(user: User): void {
    this.users.push(user)
  }

  findByEmail(email: string): User | undefined {
    return this.users.find(u => u.email === email)
  }
}
