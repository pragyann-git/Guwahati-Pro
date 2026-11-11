// Vercel serverless function: creates a Razorpay order for the cart.
// The amount is recomputed here from the catalogue, never taken from the browser.
// Needs RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET set in the hosting dashboard.
import { priceCart } from '../src/pricing.js'

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { RAZORPAY_KEY_ID: id, RAZORPAY_KEY_SECRET: secret } = process.env
  if (!id || !secret) return res.status(503).json({ error: 'Online payments are not set up yet.' })

  const { cart, receipt } = req.body ?? {}
  const { total, lines } = priceCart(cart)
  if (lines.length === 0 || total <= 0) return res.status(400).json({ error: 'Your cart is empty.' })

  const amount = Math.round(total * 100) // paise
  const r = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Basic ' + Buffer.from(`${id}:${secret}`).toString('base64'),
    },
    body: JSON.stringify({ amount, currency: 'INR', receipt: String(receipt ?? '').slice(0, 40) }),
  })
  const data = await r.json()
  if (!r.ok) return res.status(502).json({ error: data?.error?.description || 'Could not start the payment.' })
  return res.status(200).json({ orderId: data.id, amount })
}
