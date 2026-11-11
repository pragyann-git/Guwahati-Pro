import { useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Heart, Star, Truck, Info, Clock, ShoppingBag, ArrowLeft } from 'lucide-react'
import { CATEGORIES, PRODUCTS, WEIGHTS, byId, discount, rupees } from '../data'
import { useStore } from '../store'
import ProductArt from '../components/ProductArt'
import ProductCard from '../components/ProductCard'
import { QtyStepper } from '../components/Layout'

export default function Product() {
  const { id } = useParams()
  const p = byId(id)
  const { add, favourites, toggleFavourite } = useStore()
  const [grams, setGrams] = useState(500)
  const [qty, setQty] = useState(1)
  const [more, setMore] = useState(false)

  if (!p)
    return (
      <main id="main" className="container empty page-empty">
        <p className="empty-title">We couldn't find that product</p>
        <p className="muted">It may be sold out for today or no longer on our list.</p>
        <Link to="/shop" className="btn btn-dark">Browse all products</Link>
      </main>
    )

  const w = WEIGHTS.find((x) => x.grams === grams)
  const fav = favourites.includes(p.id)
  const cat = CATEGORIES.find((c) => c.id === p.category)
  const related = PRODUCTS.filter((x) => x.category === p.category && x.id !== p.id).slice(0, 4)

  return (
    <main id="main" className="container">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/shop" className="back"><ArrowLeft size={16} aria-hidden="true" /> Back to shop</Link>
        <span aria-hidden="true">/</span>
        <Link to={`/shop?cat=${p.category}`}>{cat.name}</Link>
        <span aria-hidden="true">/</span>
        <span aria-current="page">{p.name}</span>
      </nav>

      <div className="pdp">
        <div className={`pdp-media tint-${p.category}`}>
          {discount(p) >= 10 && <span className="badge-off">{discount(p)}% off</span>}
          <ProductArt art={p.art} image={p.image} alt={p.name} />
          <QtyStepper value={qty} label={p.name} onChange={(n) => setQty(Math.max(1, n))} />
        </div>

        <div className="pdp-info">
          <div className="pdp-title">
            <div>
              <h1>{p.name}, {w.label}</h1>
              <p className="muted">{p.local}</p>
            </div>
            <button
              className={`fav ${fav ? 'on' : ''}`}
              onClick={() => toggleFavourite(p.id)}
              aria-pressed={fav}
              aria-label={fav ? 'Remove from favourites' : 'Save to favourites'}
            >
              <Heart size={20} fill={fav ? 'currentColor' : 'none'} />
            </button>
          </div>

          <p className="pdp-delivery">
            <Truck size={16} aria-hidden="true" /> Delivered in about 90 minutes
          </p>

          <div className="pdp-price">
            <span className="price-lg">{rupees(p.price * w.factor)}</span>
            <s>{rupees(p.mrp * w.factor)}</s>
            <span className="badge-pill">{discount(p)}% off</span>
            <span className="rating">
              <Star size={18} fill="currentColor" aria-hidden="true" />
              <b>{p.rating}</b>
              <span className="muted">({p.reviews.toLocaleString('en-IN')} ratings)</span>
            </span>
          </div>

          <fieldset className="weights">
            <legend>Weight</legend>
            <div className="chip-set">
              {WEIGHTS.map((x) => (
                <label key={x.grams} className={`chip chip-lg ${grams === x.grams ? 'on' : ''}`}>
                  <input type="radio" name="weight" checked={grams === x.grams} onChange={() => setGrams(x.grams)} />
                  <span>{x.label}</span>
                  <small>{rupees(p.price * x.factor)}</small>
                </label>
              ))}
            </div>
          </fieldset>

          <dl className="facts">
            <div><dt>Cut</dt><dd>{p.cut}</dd></div>
            <div><dt>Sourced from</dt><dd>{p.source}</dd></div>
            <div><dt>In stock since</dt><dd><Clock size={14} aria-hidden="true" /> {p.arrived} today</dd></div>
          </dl>

          <p className="notice">
            <Info size={18} aria-hidden="true" />
            Fish and meat prices follow the morning market rate. Today's price stays the same until midnight.
          </p>

          <div className="pdp-desc">
            <h2>About this product</h2>
            <p className={more ? '' : 'clamp'}>{p.description}</p>
            <button className="link-btn" onClick={() => setMore((m) => !m)} aria-expanded={more}>
              {more ? 'Show less' : 'Read more'}
            </button>
          </div>

          <button className="btn btn-dark btn-lg btn-block" onClick={() => add(p.id, grams, qty)}>
            <ShoppingBag size={18} aria-hidden="true" /> Add {qty} to cart, {rupees(p.price * w.factor * qty)}
          </button>
        </div>
      </div>

      {related.length > 0 && (
        <section className="row-section">
          <div className="section-head">
            <h2>More {cat.name.toLowerCase()}</h2>
            <Link to={`/shop?cat=${p.category}`} className="see-all">See all</Link>
          </div>
          <div className="grid grid-4">
            {related.map((x) => (
              <ProductCard key={x.id} product={x} />
            ))}
          </div>
        </section>
      )}
    </main>
  )
}
