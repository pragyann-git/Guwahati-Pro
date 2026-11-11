import { Link, useLocation, useParams } from 'react-router-dom'
import { CheckCircle2, MessageCircle, Clock, MapPin } from 'lucide-react'
import { SHOP, rupees } from '../data'
import { loadOrders, whatsappLink } from '../orders'

export default function OrderPlaced() {
  const { id } = useParams()
  const { state } = useLocation()
  const order = state?.order?.id === id ? state.order : loadOrders().find((o) => o.id === id)

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

  return (
    <main id="main" className="container order-done">
      <div className="panel order-card">
        <CheckCircle2 size={44} className="order-tick" aria-hidden="true" />
        <p className="eyebrow">Order {order.id}</p>
        <h1>{order.paid ? 'Paid. Your order is in.' : 'Almost done!'}</h1>
        <p className="order-lede">
          {order.paid
            ? "We've received your payment. Our team will confirm on WhatsApp shortly."
            : 'Send the order on WhatsApp so we can confirm it. If WhatsApp didn’t open, tap the button below.'}
        </p>

        <a className="btn btn-gold btn-lg" href={whatsappLink(order)} target="_blank" rel="noreferrer">
          <MessageCircle size={18} aria-hidden="true" /> {order.paid ? 'Message us on WhatsApp' : 'Send order on WhatsApp'}
        </a>

        <div className="order-facts">
          <p><Clock size={16} aria-hidden="true" /> {order.slot}</p>
          <p><MapPin size={16} aria-hidden="true" /> {order.customer.address}, {order.customer.area}</p>
        </div>

        <ul className="summary-lines plain">
          {order.lines.map((l) => (
            <li key={`${l.id}-${l.weight}`}>
              <span className="summary-name">{l.name}<small>{l.weight} × {l.qty}</small></span>
              <span className="summary-price">{rupees(l.total)}</span>
            </li>
          ))}
        </ul>
        <dl className="totals">
          <div><dt>Delivery</dt><dd>{order.delivery === 0 ? 'Free' : rupees(order.delivery)}</dd></div>
          <div className="grand"><dt>{order.paid ? 'Paid' : 'To pay on delivery'}</dt><dd>{rupees(order.total)}</dd></div>
        </dl>
        <p className="small muted">Questions? Call {SHOP.phone}.</p>
        <Link to="/" className="see-all">Back to home</Link>
      </div>
    </main>
  )
}
