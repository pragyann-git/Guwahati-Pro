// POST /api/order-upi: the customer reports their UPI reference number after paying.
// It only fills an empty reference on an unpaid UPI order; you confirm it against your bank app in /admin.
import { supabaseServer } from './_supabase.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const db = supabaseServer()
  if (!db) return res.status(503).json({ error: "This isn't set up yet." })

  const id = String(req.body?.id ?? '')
  const ref = String(req.body?.ref ?? '').replace(/\s/g, '')
  if (!/^GHY-\d{6}-[A-Z0-9]{4}$/.test(id)) return res.status(400).json({ error: 'Unknown order.' })
  if (!/^\d{12}$/.test(ref)) return res.status(400).json({ error: 'The UPI reference is the 12-digit number in your payment app.' })

  try {
    const rows = await db(
      `orders?id=eq.${encodeURIComponent(id)}&payment_method=eq.upi&payment_status=eq.pending&upi_ref=is.null`,
      { method: 'PATCH', body: { upi_ref: ref, payment_status: 'reported' }, prefer: 'return=representation' },
    )
    if (!rows?.length) return res.status(409).json({ error: 'This order already has a payment reference.' })
  } catch (e) {
    console.error('upi ref update failed', e)
    return res.status(502).json({ error: "We couldn't save that. Please try again." })
  }
  return res.status(200).json({ ok: true })
}
