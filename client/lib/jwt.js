// Simple JWT implementation for demo purposes
// In production, use a proper JWT library

export function createToken(payload) {
  const header = { alg: "HS256", typ: "JWT" }
  const encodedHeader = btoa(JSON.stringify(header))
  const encodedPayload = btoa(JSON.stringify(payload))
  const signature = btoa("mock-signature") // In production, use proper signing

  return `${encodedHeader}.${encodedPayload}.${signature}`
}

export function verifyToken(token) {
  try {
    const parts = token.split(".")
    if (parts.length !== 3) return null

    const payload = JSON.parse(atob(parts[1]))
    return payload
  } catch (error) {
    return null
  }
}
