import { useCallback, useEffect, useMemo, useState } from 'react'
import { LogOut, RefreshCw, Phone } from 'lucide-react'
import { rupees } from '../data'
import { adminConfigured, currentAdmin, isAdmin, listOrders, signIn, signOut, updateOrder } from '../admin'

const STATUSES = [
  { id: 'new', label: 'New' },
  { id: 'confirmed', label: 'Confirmed' },
  { id: 'out_for_delivery', label: 'Out for delivery' },
  { id: 'delivered', label: 'Delivered' },
  { id: 'cancelled', label: 'Cancelled' },
]
const statusLabel = (s) => STATUSES.find((x) => x.id === s)?.label ?? s
const TABS = [
  { id: 'active', label: 'Active', test: (o) => ['new', 'confirmed', 'out_for_delivery'].includes(o.status) },
  { id: 'delivered', label: 'Delivered', test: (o) => o.status === 'delivered' },
  { id: 'cancelled', label: 'Cancelled', test: (o) => o.status === 'cancelled' },
  { id: 'all', label: 'All', test: () => true },
]
const PAY_LABELS = {
  cod: { pending: 'Cash on delivery', reported: 'Cash on delivery', paid: 'Cash received' },
  upi: { pending: 'UPI not paid', reported: 'UPI reported', paid: 'UPI paid' },
}
const payLabel = (o) => ({ cls: `pay-${o.payment_status}`, text: PAY_LABELS[o.payment_method]?.[o.payment_status] ?? o.payment_status })
const when = (iso) => new Date(iso).toLocaleString('en-IN', { day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' })

function Login({ onDone }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const submit = async (e) => {
    e.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signIn(email.trim(), password)
      if (!(await isAdmin())) {
        signOut()
        throw new Error("This account isn't on the admin list.")
      }
      onDone()
    } catch (err) {
      setError(err.message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <form className="panel admin-login" onSubmit={submit}>
      <h1>Shop admin</h1>
      <div className="field">
        <label htmlFor="a-email">Email</label>
        <input id="a-email" type="email" autoComplete="username" value={email} onChange={(e) => setEmail(e.target.value)} required />
      </div>
      <div className="field">
        <label htmlFor="a-pass">Password</label>
        <input id="a-pass" type="password" autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      </div>
      {error && <p className="field-error" role="alert">{error}</p>}
      <button className="btn btn-dark" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
    </form>
  )
}

function OrderCard({ o, onChange }) {
  const [busy, setBusy] = useState(false)
  const pay = payLabel(o)
  const save = async (patch) => {
    setBusy(true)
    try {
      onChange(await updateOrder(o.id, patch))
    } catch (e) {
      alert(e.message)
    } finally {
      setBusy(false)
    }
  }
  return (
    <article className="panel order-row">
      <div>
        <h3>
          {o.customer_name} <span className={`tag ${o.status}`}>{statusLabel(o.status)}</span>
          <span className={`tag ${pay.cls}`}>{pay.text}</span>
        </h3>
        <div className="meta">
          <span>{o.id} · placed {when(o.created_at)}</span>
          <a href={`tel:+91${o.phone}`}><Phone size={13} aria-hidden="true" /> +91 {o.phone}</a>
          <span>{o.address}{o.landmark ? `, near ${o.landmark}` : ''}, {o.area}</span>
          <span><b>Slot:</b> {o.slot}</span>
          {o.notes && <span><b>Notes:</b> {o.notes}</span>}
          {o.upi_ref && <span><b>UPI ref:</b> {o.upi_ref}</span>}
        </div>
      </div>
      <ul className="order-items">
        {o.items.map((l) => (
          <li key={`${l.id}-${l.weight}`}><span>{l.name}, {l.weight} × {l.qty}</span><span>{rupees(l.total)}</span></li>
        ))}
        <li><span>Delivery</span><span>{o.delivery_fee == 0 ? 'Free' : rupees(o.delivery_fee)}</span></li>
        <li className="tot"><span>Total</span><span>{rupees(o.total)}</span></li>
      </ul>
      <div className="order-actions">
        <label className="small muted" htmlFor={`st-${o.id}`}>Status</label>
        <select id={`st-${o.id}`} value={o.status} disabled={busy} onChange={(e) => save({ status: e.target.value })}>
          {STATUSES.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
        </select>
        {o.payment_status !== 'paid' && (
          <button className="btn btn-outline btn-sm" disabled={busy} onClick={() => save({ payment_status: 'paid' })}>
            {o.payment_method === 'cod' ? 'Cash received' : 'UPI received'}
          </button>
        )}
      </div>
    </article>
  )
}

export default function Admin() {
  const [signedIn, setSignedIn] = useState(Boolean(currentAdmin()))
  const [orders, setOrders] = useState(null)
  const [error, setError] = useState('')
  const [tab, setTab] = useState('active')

  const load = useCallback(async () => {
    try {
      setOrders(await listOrders())
      setError('')
    } catch (e) {
      setError(e.message)
      if (!currentAdmin()) setSignedIn(false)
    }
  }, [])

  useEffect(() => {
    if (!signedIn) return
    load()
    const t = setInterval(load, 60_000)
    return () => clearInterval(t)
  }, [signedIn, load])

  const counts = useMemo(() => Object.fromEntries(TABS.map((t) => [t.id, (orders ?? []).filter(t.test).length])), [orders])
  const shown = (orders ?? []).filter(TABS.find((t) => t.id === tab).test)

  if (!adminConfigured)
    return (
      <main id="main" className="container admin">
        <div className="panel admin-login">
          <h1>Shop admin</h1>
          <p className="muted">The order database isn't connected yet. Follow “Setting up orders” in the README, then reload this page.</p>
        </div>
      </main>
    )

  if (!signedIn)
    return (
      <main id="main" className="container admin">
        <Login onDone={() => setSignedIn(true)} />
      </main>
    )

  return (
    <main id="main" className="container admin">
      <div className="admin-top">
        <h1>Orders</h1>
        <div className="admin-tools">
          <span className="small muted">{currentAdmin()}</span>
          <button className="btn btn-outline btn-sm" onClick={load}><RefreshCw size={15} aria-hidden="true" /> Refresh</button>
          <button className="btn btn-outline btn-sm" onClick={() => { signOut(); setSignedIn(false) }}>
            <LogOut size={15} aria-hidden="true" /> Sign out
          </button>
        </div>
      </div>
      <div className="admin-tabs" role="tablist">
        {TABS.map((t) => (
          <button key={t.id} role="tab" aria-selected={tab === t.id} className={`pill ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>
            {t.label}<b>{counts[t.id]}</b>
          </button>
        ))}
      </div>
      {error && <p className="notice" role="alert">{error}</p>}
      {orders === null ? (
        <p className="muted">Loading orders…</p>
      ) : shown.length === 0 ? (
        <div className="empty"><p className="empty-title">No orders here</p></div>
      ) : (
        <div className="admin-list">
          {shown.map((o) => (
            <OrderCard key={o.id} o={o} onChange={(n) => setOrders((all) => all.map((x) => (x.id === n.id ? n : x)))} />
          ))}
        </div>
      )}
    </main>
  )
}
