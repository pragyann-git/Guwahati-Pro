// Admin access to Supabase from the browser: email + password sign-in, then
// reading and updating orders. Row-level security (supabase/schema.sql) only
// lets emails listed in the admins table see anything.
const URL_ = import.meta.env.VITE_SUPABASE_URL
const ANON = import.meta.env.VITE_SUPABASE_ANON_KEY
export const adminConfigured = Boolean(URL_ && ANON)

const KEY = 'ghy.admin.session'
const loadSession = () => {
  try {
    return JSON.parse(sessionStorage.getItem(KEY))
  } catch {
    return null
  }
}
const storeSession = (s) => {
  try {
    if (s) sessionStorage.setItem(KEY, JSON.stringify(s))
    else sessionStorage.removeItem(KEY)
  } catch {
    /* storage unavailable: stays signed in until the tab closes */
  }
}
let session = loadSession()

async function auth(grant, body) {
  const r = await fetch(`${URL_}/auth/v1/token?grant_type=${grant}`, {
    method: 'POST',
    headers: { apikey: ANON, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(data.error_description || data.msg || 'Sign-in failed.')
  session = { token: data.access_token, refresh: data.refresh_token, expires: Date.now() + data.expires_in * 1000, email: data.user?.email }
  storeSession(session)
  return session
}

export const currentAdmin = () => session?.email ?? null
export const signIn = (email, password) => auth('password', { email, password })
export const signOut = () => {
  session = null
  storeSession(null)
}

async function token() {
  if (!session) throw new Error('Please sign in.')
  if (Date.now() > session.expires - 60_000) await auth('refresh_token', { refresh_token: session.refresh })
  return session.token
}

async function rest(path, { method = 'GET', body } = {}) {
  const r = await fetch(`${URL_}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: ANON,
      Authorization: `Bearer ${await token()}`,
      'Content-Type': 'application/json',
      Prefer: 'return=representation',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  const data = await r.json().catch(() => null)
  if (r.status === 401) {
    signOut()
    throw new Error('Your session expired. Please sign in again.')
  }
  if (!r.ok) throw new Error(data?.message || 'Could not reach the database.')
  return data
}

export async function isAdmin() {
  const rows = await rest(`admins?select=email&email=eq.${encodeURIComponent(currentAdmin())}`)
  return rows.length > 0
}
export const listOrders = () => rest('orders?select=*&order=created_at.desc&limit=300')
export const updateOrder = (id, patch) =>
  rest(`orders?id=eq.${encodeURIComponent(id)}`, { method: 'PATCH', body: patch }).then((rows) => rows[0])
