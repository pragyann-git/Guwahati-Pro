import { useMemo, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import { CheckCircle2, Clock, MapPin, Smartphone, Copy, Check } from 'lucide-react'
import qrcode from 'qrcode-generator'
import { SHOP, rupees } from '../data'
import { loadOrders, reportUpiRef, saveOrder, upiLink } from '../orders'

function UpiQr({ link }) {
  const svg = useMemo(() => {
    const qr = qrcode(0, 'M')
    qr.addData(link)
    qr.make()
    return qr.createSvgTag({ cellSize: 5, margin: 2, scalable: true })
  }, [link])
  return <div className="upi-qr" role="img" aria-label="UPI payment QR code" dangerouslySetInnerHTML={{ __html: svg }} />
}

function UpiPay({ order, onReported }) {
  const [ref, setRef] = useState('')
  const [state, setState] = useState({ busy: false, error: '' })
  const [copied, setCopied] = useState(false)
  const link = upiLink(order)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(SHOP.upiId)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked: the ID is visible to copy by hand */
    }
  }

  const submit = async (e) => {
    e.preventDefault()
    setState({ busy: true, error: '' })
    try {
      await reportUpiRef(order.id, ref)
      onReported(ref.replace(/\s/g, ''))
    } catch (err) {
      setState({ busy: false, error: err.message })
    }
  }

  return (
    <section className="upi-box" aria-labelledby="upi-title">
      <h2 id="upi-title">Pay {rupees(order.total)} by UPI</h2>
      <a className="btn btn-gold btn-lg upi-app-btn" href={link}>
        <Smartphone size={18} aria-hidden="true" /> Pay with UPI app
      </a>
      <div className="upi-desktop">
        <UpiQr link={link} />
        <p className="small muted">Scan with GPay, PhonePe, Paytm or any UPI app</p>
      </div>
      <p className="upi-id">
        UPI ID <b>{SHOP.upiId}</b>
        <button type="button" className="link-btn" onClick={copy}>
          {copied ? <Check size={14} aria-hidden="true" /> : <Copy size={14} aria-hidden="true" />} {copied ? 'Copied' : 'Copy'}
        </button>
      </p>
      <form className="upi-ref" onSubmit={submit}>
        <label htmlFor="upi-ref">After paying, enter the 12-digit UPI reference (UTR) from your app</label>
        <div>
          <input id="upi-ref" inputMode="numeric" maxLength={14} value={ref} onChange={(e) => setRef(e.target.value)} placeholder="e.g. 431298765432" />
          <button className="btn btn-dark" disabled={state.busy}>{state.busy ? 'Sending…' : "I've paid"}</button>
        </div>
        {state.error && <p className="field-error" role="alert">{state.error}</p>}
      </form>
    </section>
  )
}

export default function OrderPlaced() {
  const { id } = useParams()
  const { state } = useLocation()
  const initial = state?.order?.id === id ? state.order : loadOrders().find((o) => o.id === id)
  const [order, setOrder] = useState(initial)

  if (!order)
    return (
      <main id="main" className="container">
        <div className="empty page-empty">
          <p className="empty-title">We couldn't find that order</p>
          <p className="muted">Orders are saved on the phone or computer they were placed from.</p>
          <Link to="/shop" className="btn btn-dark">Back to the shop</Link>
        </div>
      </main>
    )

  const upi = order.payment_method === 'upi'
  const awaitingUpi = upi && order.payment_status === 'pending'
  const markReported = (ref) => {
    const next = { ...order, payment_status: 'reported', upi_ref: ref }
    saveOrder(next)
    setOrder(next)
  }

  return (
    <main id="main" className="container order-done">
      <div className="panel order-card">
        <CheckCircle2 size={44} className="order-tick" aria-hidden="true" />
        <p className="eyebrow">Order {order.id}</p>
        <h1>{awaitingUpi ? 'One last step' : 'Thank you! Your order is in.'}</h1>
        <p className="order-lede">
          {awaitingUpi
            ? 'Pay by UPI to confirm your order. We start cutting once the payment reaches us.'
            : upi
              ? `We've got your payment reference ${order.upi_ref}. We'll check it and start on your order.`
              : `We'll cut it fresh and bring it in your slot. Keep ${rupees(order.total)} ready for the rider.`}
        </p>

        {awaitingUpi && SHOP.upiId && <UpiPay order={order} onReported={markReported} />}

        <div className="order-facts">
          <p><Clock size={16} aria-hidden="true" /> {order.slot}</p>
          <p><MapPin size={16} aria-hidden="true" /> {order.address}, {order.area}</p>
        </div>

        <ul className="summary-lines plain">
          {order.items.map((l) => (
            <li key={`${l.id}-${l.weight}`}>
              <span className="summary-name">{l.name}<small>{l.weight} × {l.qty}</small></span>
              <span className="summary-price">{rupees(l.total)}</span>
            </li>
          ))}
        </ul>
        <dl className="totals">
          <div><dt>Delivery</dt><dd>{order.delivery_fee === 0 ? 'Free' : rupees(order.delivery_fee)}</dd></div>
          <div className="grand">
            <dt>{upi ? 'Total (UPI)' : 'To pay in cash'}</dt>
            <dd>{rupees(order.total)}</dd>
          </div>
        </dl>
        <p className="small muted">Questions about your order? Call {SHOP.phone}.</p>
        <Link to="/" className="see-all">Back to home</Link>
      </div>
    </main>
  )
}
