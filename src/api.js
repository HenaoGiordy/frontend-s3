const API_BASE = 'https://tvdhpxkwq3.execute-api.us-east-2.amazonaws.com/Prod'

async function request(method, body) {
  const res = await fetch(`${API_BASE}/user`, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })

  const data = await res.json().catch(() => null)

  if (!res.ok) {
    const error = new Error(data?.message || `Error ${res.status}`)
    error.status = res.status
    throw error
  }

  return data
}

export function createUser({ email, name }) {
  return request('POST', name ? { email, name } : { email })
}

export function updateUser({ id, ...fields }) {
  return request('PUT', { id, ...fields })
}
