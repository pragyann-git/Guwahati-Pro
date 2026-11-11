import { Link } from 'react-router-dom'
import { Plus, Clock } from 'lucide-react'
import { useStore } from '../store'
import { discount, rupees } from '../data'
import ProductArt from './ProductArt'
import { QtyStepper } from './Layout'

export default function ProductCard({ product: p }) {
  const { add, qtyOf, setQty } = useStore()
  const qty = qtyOf(p.id, 500)
  const off = discount(p)

  return (
    <article className="card">
      <Link to={`/product/${p.id}`} className={`card-art tint-${p.category}`} aria-label={p.name}>
        {off >= 10 && <span className="badge-off">{off}% off</span>}
        <ProductArt art={p.art} image={p.image} />
      </Link>
      <div className="card-body">
        <h3 className="card-title">
          <Link to={`/product/${p.id}`}>{p.name}</Link>
        </h3>
        <p className="card-meta">
          500 g, {p.cut.toLowerCase()}
        </p>
        <p className="card-fresh">
          <Clock size={13} aria-hidden="true" /> In stock since {p.arrived}
        </p>
        <div className="card-foot">
          <span className="price">
            {rupees(p.price)}
            <s>{rupees(p.mrp)}</s>
          </span>
          {qty === 0 ? (
            <button className="add-btn" onClick={() => add(p.id, 500)} aria-label={`Add ${p.name} to cart`}>
              <Plus size={18} />
            </button>
          ) : (
            <QtyStepper size="sm" value={qty} label={p.name} onChange={(n) => setQty(p.id, 500, n)} />
          )}
        </div>
      </div>
    </article>
  )
}
