export function validateEmail(email: string): boolean {
  const [local, domain] = email.split('@')
  return !!local && !!domain
}
