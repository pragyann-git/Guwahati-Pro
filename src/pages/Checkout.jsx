import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ArrowLeft, Banknote, Smartphone, ShoppingBag } from 'lucide-react'
import { AREAS, SHOP, rupees } from '../data'
import { useStore } from '../store'
import ProductArt from '../components/ProductArt'
import { loadCustomer, placeOrder, saveCustomer, saveOrder, slotDays } from '../orders'

const PHONE_RE = /^[6-9]\d{9}$/

export default function Checkout() {
  const { lines, subtotal, delivery, total, area, setArea, cart, clearCart, notify } = useStore()
  const navigate = useNavigate()
  const saved = useMemo(loadCustomer, [])
  const days = useMemo(() => slotDays(), [])

  const [form, setForm] = useState({
    name: saved.name ?? '',
    phone: saved.phone ?? '',
    address: saved.address ?? '',
    landmark: saved.landmark ?? '',
    notes: '',
  })
  const [dayKey, setDayKey] = useState(days[0]?.key)
  const day = days.find((d) => d.key === dayKey) ?? days[0]
  const [slotKey, setSlotKey] = useState(day?.slots.find((s) => s.open)?.key)
  const [pay, setPay] = useState('cod')
  const [errors, setErrors] = useState({})
  const [busy, setBusy] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  if (lines.length === 0)
    return (
      <main id="main" className="container">
        <div className="empty page-empty">
          <ProductArt art={{ kind: 'fish', tone: 'hilsa' }} />
          <p className="empty-title">Your cart is empty</p>
          <p className="muted">Add some fish, chicken or mutton first.</p>
          <Link to="/shop" className="btn btn-dark">Browse today's stock</Link>
        </div>
      </main>
    )

  const validate = () => {
    const e = {}
    if (form.name.trim().length < 2) e.name = 'Enter your name'
    if (!PHONE_RE.test(form.phone.replace(/\D/g, '').slice(-10))) e.phone = 'Enter a 10-digit mobile number'
    if (form.address.trim().length < 8) e.address = 'Enter your house or flat number and street'
    const slot = day?.slots.find((s) => s.key === slotKey && s.open)
    if (!slot) e.slot = 'Choose a delivery time'
    setErrors(e)
    if (Object.keys(e).length) {
      document.getElementById(`f-${Object.keys(e)[0]}`)?.focus()
      return null
    }
    return slot
  }

  const submit = async (ev) => {
    ev.preventDefault()
    const slot = validate()
    if (!slot) return
    const customer = { ...form, phone: form.phone.replace(/\D/g, '').slice(-10), area }
    saveCustomer({ name: customer.name, phone: customer.phone, address: customer.address, landmark: customer.landmark })

    setBusy(true)
    try {
      const order = await placeOrder({
        cart,
        customer,
        slot: `${day.name}, ${day.date}, ${slot.label}`,
        payment: pay,
      })
      saveOrder(order)
      clearCart()
      navigate(`/order/${order.id}`, { state: { order } })
    } catch (err) {
      notify(err.message)
    } finally {
      setBusy(false)
    }
  }

  return (
    <main id="main" className="container checkout">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/shop" className="back"><ArrowLeft size={16} aria-hidden="true" /> Keep shopping</Link>
      </nav>
      <h1>Checkout</h1>

      <form className="checkout-grid" onSubmit={submit} noValidate>
        <div className="checkout-main">
          <section className="panel" aria-labelledby="h-details">
            <h2 id="h-details"><span className="step-dot">1</span> Your details</h2>
            <div className="fields">
              <Field id="name" label="Full name" error={errors.name}>
                <input id="f-name" autoComplete="name" value={form.name} onChange={set('name')} />
              </Field>
              <Field id="phone" label="Mobile number" error={errors.phone} hint="We'll call this number if the rider can't find you.">
                <div className="input-prefix">
                  <span>+91</span>
                  <input id="f-phone" type="tel" inputMode="numeric" autoComplete="tel-national" maxLength={14} value={form.phone} onChange={set('phone')} />
                </div>
              </Field>
            </div>
          </section>

          <section className="panel" aria-labelledby="h-address">
            <h2 id="h-address"><span className="step-dot">2</span> Delivery address</h2>
            <div className="fields">
              <Field id="area" label="Area in Guwahati">
                <select id="f-area" value={area} onChange={(e) => setArea(e.target.value)}>
                  {AREAS.map((a) => <option key={a}>{a}</option>)}
                </select>
              </Field>
              <Field id="landmark" label="Landmark (optional)">
                <input id="f-landmark" value={form.landmark} onChange={set('landmark')} placeholder="Near Bhangagarh flyover" />
              </Field>
              <Field id="address" label="House or flat, building and street" error={errors.address} wide>
                <textarea id="f-address" rows={2} autoComplete="street-address" value={form.address} onChange={set('address')} />
              </Field>
            </div>
          </section>

          <section className="panel" aria-labelledby="h-slot">
            <h2 id="h-slot"><span className="step-dot">3</span> Delivery time</h2>
            <div className="day-tabs" role="radiogroup" aria-label="Delivery day">
              {days.map((d) => (
                <button
                  type="button"
                  key={d.key}
                  role="radio"
                  aria-checked={d.key === day.key}
                  className={`pill ${d.key === day.key ? 'on' : ''}`}
                  onClick={() => {
                    setDayKey(d.key)
                    setSlotKey(d.slots.find((s) => s.open)?.key)
                  }}
                >
                  {d.name} <span className="pill-sub">{d.date}</span>
                </button>
              ))}
            </div>
            <div className="slot-grid" role="radiogroup" aria-label="Delivery window" id="f-slot" tabIndex={-1}>
              {day.slots.map((s) => (
                <label key={s.key} className={`slot ${slotKey === s.key ? 'on' : ''} ${s.open ? '' : 'off'}`}>
                  <input type="radio" name="slot" disabled={!s.open} checked={slotKey === s.key} onChange={() => setSlotKey(s.key)} />
                  {s.label}
                  {!s.open && <small>Closed</small>}
                </label>
              ))}
            </div>
            {errors.slot && <p className="field-error">{errors.slot}</p>}
            <Field id="notes" label="Cutting or delivery notes (optional)" wide>
              <input id="f-notes" value={form.notes} onChange={set('notes')} placeholder="Cut the hilsa into steaks, keep the head" />
            </Field>
          </section>

          <section className="panel" aria-labelledby="h-pay">
            <h2 id="h-pay"><span className="step-dot">4</span> Payment</h2>
            <div className="pay-options">
              <label className={`pay ${pay === 'cod' ? 'on' : ''}`}>
                <input type="radio" name="pay" checked={pay === 'cod'} onChange={() => setPay('cod')} />
                <Banknote size={22} aria-hidden="true" />
                <span>
                  <b>Cash on delivery</b>
                  <small>Pay the rider in cash when your order arrives.</small>
                </span>
              </label>
              <label className={`pay ${pay === 'upi' ? 'on' : ''} ${SHOP.upiId ? '' : 'off'}`}>
                <input type="radio" name="pay" disabled={!SHOP.upiId} checked={pay === 'upi'} onChange={() => setPay('upi')} />
                <Smartphone size={22} aria-hidden="true" />
                <span>
                  <b>Pay now by UPI</b>
                  <small>{SHOP.upiId ? 'GPay, PhonePe, Paytm or any UPI app.' : 'Coming soon.'}</small>
                </span>
              </label>
            </div>
          </section>
        </div>

        <aside className="checkout-summary panel" aria-labelledby="h-summary">
          <h2 id="h-summary">Your order</h2>
          <ul className="summary-lines">
            {lines.map((l) => (
              <li key={`${l.id}-${l.grams}`}>
                <span className={`summary-art tint-${l.product.category}`}>
                  <ProductArt image={l.product.image} art={l.product.art} />
                  <b>{l.qty}</b>
                </span>
                <span className="summary-name">
                  {l.product.name}
                  <small>{l.weight.label}</small>
                </span>
                <span className="summary-price">{rupees(l.total)}</span>
              </li>
            ))}
          </ul>
          <dl className="totals">
            <div><dt>Items</dt><dd>{rupees(subtotal)}</dd></div>
            <div><dt>Delivery to {area}</dt><dd>{delivery === 0 ? 'Free' : rupees(delivery)}</dd></div>
            <div className="grand"><dt>To pay</dt><dd>{rupees(total)}</dd></div>
          </dl>
          <button type="submit" className="btn btn-dark btn-lg btn-block" disabled={busy}>
            <ShoppingBag size={18} aria-hidden="true" />
            {busy ? 'Placing your order…' : pay === 'upi' ? `Place order and pay ${rupees(total)}` : `Place order, ${rupees(total)}`}
          </button>
          <p className="small muted summary-note">
            {pay === 'upi'
              ? 'Next you pay by UPI. We confirm your order once the payment arrives.'
              : `We'll call you on the number above if anything changes. Questions? ${SHOP.phone}`}
          </p>
        </aside>
      </form>
    </main>
  )
}

function Field({ id, label, hint, error, wide, children }) {
  return (
    <div className={`field ${wide ? 'wide' : ''} ${error ? 'has-error' : ''}`}>
      <label htmlFor={`f-${id}`}>{label}</label>
      {children}
      {error ? <p className="field-error" role="alert">{error}</p> : hint && <p className="field-hint">{hint}</p>}
    </div>
  )
}
