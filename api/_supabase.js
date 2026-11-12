// Server-side helper for talking to Supabase with the service role key.
// Files starting with "_" in api/ are not exposed as endpoints on Vercel.
export function supabaseServer() {
  const url = process.env.SUPABASE_URL
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!url || !key) return null
  return async (path, { method = 'GET', body, prefer } = {}) => {
    const r = await fetch(`${url}/rest/v1/${path}`, {
      method,
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
        ...(prefer ? { Prefer: prefer } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    })
    const text = await r.text()
    const data = text ? JSON.parse(text) : null
    if (!r.ok) throw new Error(data?.message || `Supabase error ${r.status}`)
    return data
  }
}

export const clean = (v, max) => String(v ?? '').trim().slice(0, max)
