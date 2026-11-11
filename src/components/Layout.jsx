import { useEffect, useRef, useState } from 'react'
import { Link, useLocation, useNavigate, useSearchParams } from 'react-router-dom'
import { MapPin, Search, ShoppingBag, ChevronDown, X, Minus, Plus, Trash2, Truck, Clock, Phone, ArrowRight } from 'lucide-react'
import { useStore } from '../store'
import { AREAS, CATEGORIES, FREE_DELIVERY_OVER, SCENES, SHOP, rupees } from '../data'
import ProductArt from './ProductArt'

export function Logo({ light = false }) {
  return (
    <Link to="/" className={`logo ${light ? 'logo-light' : ''}`} aria-label="GHY Pro home">
      <svg viewBox="0 0 64 64" aria-hidden="true">
        <circle cx="32" cy="32" r="31" fill="none" stroke="currentColor" strokeWidth="2" />
        <path d="M13 33c7-9 20-11 29-2l8-5-2 7 2 7-8-5c-9 9-22 7-29-2z" fill="currentColor" />
        <circle cx="22" cy="31.5" r="2.2" fill="var(--logo-eye)" />
      </svg>
      <span className="logo-word">GHY Pro</span>
    </Link>
  )
}

const NAV = [
  { to: '/', label: 'Home', end: true },
  { to: '/shop?cat=fish', label: 'Fish' },
  { to: '/shop?cat=chicken', label: 'Chicken' },
  { to: '/shop?cat=mutton', label: 'Mutton' },
  { to: '/shop', label: 'Shop all' },
]

export function Header() {
  const { area, setArea, count, setCartOpen } = useStore()
  const [params] = useSearchParams()
  const [q, setQ] = useState(params.get('q') ?? '')
  const navigate = useNavigate()
  const { pathname, search } = useLocation()

  useEffect(() => {
    setQ(params.get('q') ?? '')
  }, [params])

  const submit = (e) => {
    e.preventDefault()
    navigate(q.trim() ? `/shop?q=${encodeURIComponent(q.trim())}` : '/shop')
  }
  const here = pathname + search
  const isActive = (n) => (n.end ? pathname === '/' : n.to === '/shop' ? here === '/shop' : here.startsWith(n.to))

  return (
    <header className="site-header">
      <div className="container header-row">
        <Logo />

        <nav className="header-nav" aria-label="Main">
          {NAV.map((n) => (
            <Link key={n.to} to={n.to} className={`nav-link ${isActive(n) ? 'active' : ''}`} aria-current={isActive(n) ? 'page' : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>

        <div className="header-tools">
          <form className="search" role="search" onSubmit={submit}>
            <Search size={17} aria-hidden="true" />
            <input
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search rohu, keema…"
              aria-label="Search fish, chicken and mutton"
            />
          </form>

          <label className="location">
            <MapPin size={17} aria-hidden="true" />
            <span className="location-value">
              {area} <ChevronDown size={14} aria-hidden="true" />
            </span>
            <select value={area} onChange={(e) => setArea(e.target.value)} aria-label="Delivery area in Guwahati">
              {AREAS.map((a) => (
                <option key={a}>{a}</option>
              ))}
            </select>
          </label>

          <button className="cart-btn" onClick={() => setCartOpen(true)} aria-label={`Open cart, ${count} items`}>
            <ShoppingBag size={19} aria-hidden="true" />
            <span className="cart-label">Cart</span>
            {count > 0 && <span className="cart-count" aria-hidden="true">{count}</span>}
          </button>
        </div>
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
  const { lines, subtotal, delivery, total, setQty, cartOpen, setCartOpen, area } = useStore()
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
            <Link to="/checkout" className="btn btn-dark btn-block btn-lg" onClick={() => setCartOpen(false)}>
              Checkout, {rupees(total)}
            </Link>
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
      <div className="container footer-cta">
        <div className="footer-cta-copy">
          <h2>Taste the Brahmaputra, cut fresh for your kitchen.</h2>
          <p>Order before 8 PM and we'll bring tomorrow morning's catch to your door by 8 AM.</p>
          <Link to="/shop" className="btn btn-gold">
            Start your order <ArrowRight size={17} aria-hidden="true" />
          </Link>
        </div>
        <div className="footer-cta-art">
          <ProductArt image={SCENES.cta} art={{ kind: 'fish', tone: 'hilsa' }} alt="" />
        </div>
      </div>
      <div className="container footer-grid">
        <div>
          <Logo light />
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
          <p className="footer-line"><Phone size={16} aria-hidden="true" /> {SHOP.phone}</p>
        </div>
      </div>
      <div className="container footer-base">
        <span>© {new Date().getFullYear()} GHY Pro, Guwahati</span>
        <Link to="/credits">Photo credits</Link>
      </div>
    </footer>
  )
}
