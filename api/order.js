// POST /api/order: saves a new order in Supabase.
// Prices are recomputed here from src/data.js, so the browser can't change them.
import { priceCart } from '../src/pricing.js'
import { AREAS } from '../src/data.js'
import { clean, supabaseServer } from './_supabase.js'

const newId = () => {
  const d = new Date(Date.now() + 5.5 * 3600 * 1000) // India time for the date part
  const ymd = d.toISOString().slice(2, 10).replace(/-/g, '')
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `GHY-${ymd}-${rand}`
}

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const db = supabaseServer()
  if (!db) return res.status(503).json({ error: "Ordering isn't set up yet. Please call us to order." })

  const b = req.body ?? {}
  const c = b.customer ?? {}
  const phone = String(c.phone ?? '').replace(/\D/g, '').slice(-10)
  const errors = []
  if (clean(c.name, 80).length < 2) errors.push('name')
  if (!/^[6-9]\d{9}$/.test(phone)) errors.push('phone')
  if (clean(c.address, 300).length < 8) errors.push('address')
  if (!AREAS.includes(c.area)) errors.push('area')
  if (clean(b.slot, 80).length < 5) errors.push('slot')
  if (!['cod', 'upi'].includes(b.payment)) errors.push('payment')
  if (errors.length) return res.status(400).json({ error: 'Please check your details.', fields: errors })

  const priced = priceCart(b.cart)
  if (priced.lines.length === 0) return res.status(400).json({ error: 'Your cart is empty.' })

  const order = {
    id: newId(),
    payment_method: b.payment,
    customer_name: clean(c.name, 80),
    phone,
    area: c.area,
    address: clean(c.address, 300),
    landmark: clean(c.landmark, 120) || null,
    notes: clean(c.notes, 300) || null,
    slot: clean(b.slot, 80),
    items: priced.lines.map((l) => ({ id: l.id, name: l.product.name, weight: l.weight.label, qty: l.qty, total: l.total })),
    subtotal: priced.subtotal,
    delivery_fee: priced.delivery,
    total: priced.total,
  }

  try {
    await db('orders', { method: 'POST', body: order, prefer: 'return=minimal' })
  } catch (e) {
    console.error('order insert failed', e)
    return res.status(502).json({ error: "We couldn't save your order. Please try again or call us." })
  }
  return res.status(200).json({ order: { ...order, created_at: new Date().toISOString(), status: 'new', payment_status: 'pending' } })
}
