// Order helpers: delivery slots, placing orders, UPI payment links and the
// customer's saved details (kept only in their own browser).
import { SHOP, SLOTS, SLOT_CUTOFF_HOURS } from './data'

const hourLabel = (h) => `${((h + 11) % 12) + 1} ${h < 12 ? 'AM' : 'PM'}`
export const slotLabel = (s) => `${hourLabel(s.start)} – ${hourLabel(s.end)}`

// Today's and tomorrow's bookable slots.
export function slotDays(now = new Date()) {
  const days = []
  for (const offset of [0, 1]) {
    const date = new Date(now.getFullYear(), now.getMonth(), now.getDate() + offset)
    const slots = SLOTS.map((s) => {
      const startsAt = new Date(date.getFullYear(), date.getMonth(), date.getDate(), s.start)
      const open = startsAt.getTime() - now.getTime() >= SLOT_CUTOFF_HOURS * 3600 * 1000
      return { ...s, key: `${date.toDateString()}|${s.start}`, label: slotLabel(s), open }
    })
    days.push({
      key: date.toDateString(),
      name: offset === 0 ? 'Today' : 'Tomorrow',
      date: date.toLocaleDateString('en-IN', { weekday: 'short', day: 'numeric', month: 'short' }),
      slots,
    })
  }
  return days.filter((d) => d.slots.some((s) => s.open))
}

async function post(url, body) {
  let r
  try {
    r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  } catch {
    throw new Error("You seem to be offline. Check your connection and try again.")
  }
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(data.error || 'Something went wrong. Please try again.')
  return data
}

export const placeOrder = (payload) => post('/api/order', payload).then((d) => d.order)
export const reportUpiRef = (id, ref) => post('/api/order-upi', { id, ref })

// upi:// link that opens GPay, PhonePe, Paytm etc. with the amount filled in.
export const upiLink = (order) =>
  'upi://pay?' +
  new URLSearchParams({
    pa: SHOP.upiId,
    pn: SHOP.upiName,
    am: Number(order.total).toFixed(2),
    cu: 'INR',
    tn: `Order ${order.id}`,
  })
    .toString()
    .replace(/\+/g, '%20')
    .replace(/%40/g, '@') // some UPI apps expect a literal @ in the UPI ID

const read = (key, fallback) => {
  try {
    return JSON.parse(localStorage.getItem(key)) ?? fallback
  } catch {
    return fallback
  }
}
const write = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable */
  }
}
export const loadCustomer = () => read('ghy.customer', {})
export const saveCustomer = (c) => write('ghy.customer', c)
export const loadOrders = () => read('ghy.orders', [])
export const saveOrder = (o) => write('ghy.orders', [o, ...loadOrders().filter((x) => x.id !== o.id)].slice(0, 20))
