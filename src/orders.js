// Order helpers: delivery slots, order IDs, the WhatsApp message and the
// customer's saved details (kept only in their own browser).
import { SHOP, SLOTS, SLOT_CUTOFF_HOURS, rupees } from './data'

const pad = (n) => String(n).padStart(2, '0')
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

export function newOrderId(now = new Date()) {
  const rand = Math.random().toString(36).slice(2, 6).toUpperCase()
  return `GHY-${String(now.getFullYear()).slice(2)}${pad(now.getMonth() + 1)}${pad(now.getDate())}-${rand}`
}

export function whatsappMessage(order) {
  const items = order.lines
    .map((l) => `• ${l.name} (${l.weight}) × ${l.qty} = ${rupees(l.total)}`)
    .join('\n')
  const payment = order.paid ? `Paid online (Razorpay ${order.paymentId})` : 'Cash / UPI on delivery'
  return [
    `New order ${order.id}`,
    '',
    items,
    '',
    `Items: ${rupees(order.subtotal)}`,
    `Delivery: ${order.delivery === 0 ? 'Free' : rupees(order.delivery)}`,
    `Total: ${rupees(order.total)}`,
    `Payment: ${payment}`,
    '',
    `Name: ${order.customer.name}`,
    `Phone: +91 ${order.customer.phone}`,
    `Address: ${order.customer.address}${order.customer.landmark ? `, near ${order.customer.landmark}` : ''}, ${order.customer.area}, Guwahati`,
    `Delivery: ${order.slot}`,
    order.customer.notes ? `Notes: ${order.customer.notes}` : '',
  ]
    .filter((l, i, a) => l !== '' || a[i - 1] !== '')
    .join('\n')
    .trim()
}

export const whatsappLink = (order) => `https://wa.me/${SHOP.whatsapp}?text=${encodeURIComponent(whatsappMessage(order))}`

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
export const saveOrder = (o) => write('ghy.orders', [o, ...loadOrders()].slice(0, 20))
