// Razorpay checkout in the browser. The server functions in /api create the
// Razorpay order (with a price it computes itself) and verify the payment signature.
import { SHOP } from './data'

const loadScript = () =>
  new Promise((resolve, reject) => {
    if (window.Razorpay) return resolve()
    const s = document.createElement('script')
    s.src = 'https://checkout.razorpay.com/v1/checkout.js'
    s.onload = resolve
    s.onerror = () => reject(new Error("Couldn't load the payment window. Check your connection."))
    document.body.appendChild(s)
  })

async function post(url, body) {
  const r = await fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const data = await r.json().catch(() => ({}))
  if (!r.ok) throw new Error(data.error || 'Payment service is unavailable right now.')
  return data
}

// Resolves to { paymentId } once paid and verified, or null if the customer closes the window.
export async function payOnline({ cart, order }) {
  if (!SHOP.razorpayKey) throw new Error('Online payments are not set up yet.')
  const [rp] = await Promise.all([post('/api/razorpay-order', { cart, receipt: order.id }), loadScript()])

  const response = await new Promise((resolve, reject) => {
    const checkout = new window.Razorpay({
      key: SHOP.razorpayKey,
      order_id: rp.orderId,
      amount: rp.amount,
      currency: 'INR',
      name: SHOP.name,
      description: `Order ${order.id}`,
      prefill: { name: order.customer.name, contact: `+91${order.customer.phone}` },
      notes: { order: order.id, slot: order.slot, area: order.customer.area },
      theme: { color: '#173b2f' },
      handler: resolve,
      modal: { ondismiss: () => resolve(null) },
    })
    checkout.on('payment.failed', (e) => reject(new Error(e.error?.description || 'Payment failed.')))
    checkout.open()
  })
  if (!response) return null

  await post('/api/razorpay-verify', response)
  return { paymentId: response.razorpay_payment_id }
}
