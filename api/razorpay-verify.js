// Vercel serverless function: checks Razorpay's payment signature so a payment
// can't be faked from the browser. Needs RAZORPAY_KEY_SECRET.
import crypto from 'node:crypto'

export default function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const secret = process.env.RAZORPAY_KEY_SECRET
  if (!secret) return res.status(503).json({ error: 'Online payments are not set up yet.' })

  const { razorpay_order_id: orderId, razorpay_payment_id: paymentId, razorpay_signature: signature } = req.body ?? {}
  if (!orderId || !paymentId || typeof signature !== 'string') return res.status(400).json({ error: 'Missing payment details.' })

  const expected = crypto.createHmac('sha256', secret).update(`${orderId}|${paymentId}`).digest('hex')
  const ok =
    signature.length === expected.length && crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  if (!ok) return res.status(400).json({ error: "We couldn't verify this payment. Please contact us before paying again." })
  return res.status(200).json({ ok: true, paymentId })
}
