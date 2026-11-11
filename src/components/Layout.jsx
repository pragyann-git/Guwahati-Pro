import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useNavigate, useSearchParams } from 'react-router-dom'
import { MapPin, Search, ShoppingBag, ChevronDown, X, Minus, Plus, Trash2, Truck, Clock, Phone } from 'lucide-react'
import { useStore } from '../store'
import { AREAS, CATEGORIES, FREE_DELIVERY_OVER, rupees } from '../data'
import ProductArt from './ProductArt'

export function Logo() {
  return (
    <Link to="/" className="logo" aria-label="GHY Pro home">
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <rect width="64" height="64" rx="18" fill="currentColor" />
        <path d="M11 33c7-10 22-12 32-2l9-6-2 8 2 8-9-6c-10 10-25 8-32-2z" fill="#7FD1C7" />
        <circle cx="21" cy="31" r="2.4" fill="#0F2E3A" />
      </svg>
      <span className="logo-word">
        GHY<b>Pro</b>
      </span>
      <span className="logo-sub">Guwahati Pro</span>
    </Link>
  )
}

export function Header() {
  const { area, setArea, count, setCartOpen } = useStore()
  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  const navigate = useNavigate()

  useEffect(() => setQ(params.get('q') ?? ''), [params])

  const submit = (e) => {
    e.preventDefault()
    navigate(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : '/shop')
  }

  return (
    <header className="site-header">
      <div className="container header-row">
        <Logo />
        <label className="location">
          <MapPin size={18} aria-hidden="true" />
          <span className="location-text">
            <small>Delivering to</small>
            <span className="location-value">
              {area}<span className="city">, Guwahati</span> <ChevronDown size={14} aria-hidden="true" />
            </span>
          </span>
          <select value={area} onChange={(e) => setArea(e.target.value)} aria-label="Delivery area">
            {AREAS.map((a) => (
              <option key={a}>{a}</option>
            ))}
          </select>
        </label>

        <form className="search" role="search" onSubmit={submit}>
          <Search size={18} aria-hidden="true" />
          <input
            type="search"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search rohu, chicken breast, mutton keema…"
            aria-label="Search fish, chicken and mutton"
          />
          <button type="submit" className="btn btn-dark btn-sm">Search</button>
        </form>

        <nav className="header-nav" aria-label="Main">
          {CATEGORIES.map((c) => (
            <NavLink key={c.id} to={`/shop?cat=${c.id}`} className="nav-link">
              {c.name}
            </NavLink>
          ))}
        </nav>

        <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${count} items`}>
          <ShoppingBag size={20} aria-hidden="true" />
          <span>Cart</span>
          {count > 0 && <span className="cart-count" aria-hidden="true">{count}</span>}
        </button>
      </div>
    </header>
  )
}

export function QtyStepper({ value, onChange, label, size = 'md' }) {
  return (
    <div className={`stepper stepper-${size}`} role="group" aria-label={`Quantity of ${label}`}>
      <button type="button" onClick={() => onChange(value - 1)} aria-label={`Remove one ${label}`}>
        <Minus size={16} />
      </button>
      <output aria-live="polite">{String(value).padStart(2, '0')}</output>
      <button type="button" className="stepper-plus" onClick={() => onChange(value + 1)} aria-label={`Add one ${label}`}>
        <Plus size={16} />
      </button>
    </div>
  )
}

export function CartDrawer() {
  const { lines, subtotal, delivery, total, setQty, cartOpen, setCartOpen, area, notify } = useStore()
  const panel = useRef()

  useEffect(() => {
    if (!cartOpen) return
    const prev = document.activeElement
    panel.current?.focus()
    const onKey = (e) => e.key === 'Escape' && setCartOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
      prev?.focus?.()
    }
  }, [cartOpen, setCartOpen])

  const remaining = FREE_DELIVERY_OVER - subtotal

  return (
    <div className={`drawer-root ${cartOpen ? 'open' : ''}`} aria-hidden={!cartOpen}>
      <div className="scrim" onClick={() => setCartOpen(false)} />
      <aside className="drawer" role="dialog" aria-modal="true" aria-labelledby="cart-title" tabIndex={-1} ref={panel} inert={!cartOpen}>
        <div className="drawer-head">
          <h2 id="cart-title">Your cart</h2>
          <button className="icon-btn" onClick={() => setCartOpen(false)} aria-label="Close cart">
            <X size={20} />
          </button>
        </div>

        {lines.length === 0 ? (
          <div className="drawer-empty">
            <ProductArt art={{ kind: 'fish', tone: 'hilsa' }} />
            <p className="empty-title">Your cart is empty</p>
            <p className="muted">Add fish, chicken or mutton and we'll cut it fresh for you.</p>
            <Link to="/shop" className="btn btn-dark" onClick={() => setCartOpen(false)}>
              Browse today's stock
            </Link>
          </div>
        ) : (
          <>
            <div className="drawer-eta">
              <Truck size={18} aria-hidden="true" />
              <span>
                Delivery to <b>{area}</b> in about 90 minutes
              </span>
            </div>
            {remaining > 0 && (
              <p className="free-note">
                Add {rupees(remaining)} more for free delivery
                <span className="free-bar" aria-hidden="true">
                  <span style={{ transform: `scaleX(${Math.min(subtotal / FREE_DELIVERY_OVER, 1)})` }} />
                </span>
              </p>
            )}
            <ul className="drawer-lines">
              {lines.map((l) => (
                <li key={`${l.id}-${l.grams}`} className="line">
                  <div className={`line-art tint-${l.product.category}`}>
                    <ProductArt art={l.product.art} image={l.product.image} />
                  </div>
                  <div className="line-info">
                    <Link to={`/product/${l.id}`} onClick={() => setCartOpen(false)} className="line-name">
                      {l.product.name}
                    </Link>
                    <span className="muted small">
                      {l.weight.label}, {l.product.cut.toLowerCase()}
                    </span>
                    <span className="price-sm">{rupees(l.total)}</span>
                  </div>
                  <div className="line-actions">
                    <QtyStepper size="sm" value={l.qty} label={l.product.name} onChange={(n) => setQty(l.id, l.grams, n)} />
                    <button className="link-btn small" onClick={() => setQty(l.id, l.grams, 0)}>
                      <Trash2 size={14} aria-hidden="true" /> Remove
                    </button>
                  </div>
                </li>
              ))}
            </ul>
            <dl className="totals">
              <div><dt>Items</dt><dd>{rupees(subtotal)}</dd></div>
              <div><dt>Delivery</dt><dd>{delivery === 0 ? 'Free' : rupees(delivery)}</dd></div>
              <div className="grand"><dt>To pay</dt><dd>{rupees(total)}</dd></div>
            </dl>
            <button
              className="btn btn-dark btn-block btn-lg"
              onClick={() => notify("Checkout isn't connected yet. Add a payment provider to start taking orders.")}
            >
              Checkout, {rupees(total)}
            </button>
          </>
        )}
      </aside>
    </div>
  )
}

export function Toast() {
  const { toast } = useStore()
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toast && (
        <div className="toast" key={toast.key}>
          {toast.message}
        </div>
      )}
    </div>
  )
}

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container footer-grid">
        <div>
          <Logo />
          <p className="footer-about">
            Fresh fish, chicken and mutton from Guwahati's markets and Assam's farms. Cleaned and cut after you order, kept cold all the way to your door.
          </p>
        </div>
        <div>
          <h3>Shop</h3>
          <ul>
            {CATEGORIES.map((c) => (
              <li key={c.id}><Link to={`/shop?cat=${c.id}`}>{c.name}</Link></li>
            ))}
            <li><Link to="/shop">All products</Link></li>
          </ul>
        </div>
        <div>
          <h3>We deliver to</h3>
          <p className="muted">{AREAS.join(', ')} and nearby areas in Guwahati.</p>
        </div>
        <div>
          <h3>Hours</h3>
          <p className="footer-line"><Clock size={16} aria-hidden="true" /> 6 AM to 10 PM, every day</p>
          <p className="footer-line"><Phone size={16} aria-hidden="true" /> +91 00000 00000</p>
        </div>
      </div>
      <div className="container footer-base">© {new Date().getFullYear()} GHY Pro, Guwahati</div>
    </footer>
  )
}
