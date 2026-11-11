import { useMemo, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { SlidersHorizontal, X } from 'lucide-react'
import { CATEGORIES, CUTS, PRODUCTS, discount, rupees } from '../data'
import ProductCard from '../components/ProductCard'
import ProductArt from '../components/ProductArt'

const SORTS = {
  popular: { label: 'Most popular', fn: (a, b) => b.reviews - a.reviews },
  low: { label: 'Price: low to high', fn: (a, b) => a.price - b.price },
  high: { label: 'Price: high to low', fn: (a, b) => b.price - a.price },
  deal: { label: 'Biggest discount', fn: (a, b) => discount(b) - discount(a) },
}
const MAX_PRICE = Math.max(...PRODUCTS.map((p) => p.price))

export default function Shop() {
  const [params, setParams] = useSearchParams()
  const cat = params.get('cat') ?? 'all'
  const q = params.get('q') ?? ''
  const max = Number(params.get('max') ?? MAX_PRICE)
  const [cuts, setCuts] = useState([])
  const [sort, setSort] = useState('popular')
  const [filtersOpen, setFiltersOpen] = useState(false)

  const update = (key, value) => {
    const next = new URLSearchParams(params)
    if (value === null || value === '' || value === 'all') next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const results = useMemo(() => {
    const needle = q.toLowerCase()
    return PRODUCTS.filter(
      (p) =>
        (cat === 'all' || p.category === cat) &&
        p.price <= max &&
        (cuts.length === 0 || cuts.includes(p.cut)) &&
        (!needle || `${p.name} ${p.local} ${p.cut} ${p.category}`.toLowerCase().includes(needle)),
    ).sort(SORTS[sort].fn)
  }, [cat, q, max, cuts, sort])

  const heading = cat === 'all' ? 'All products' : CATEGORIES.find((c) => c.id === cat)?.name
  const clearAll = () => {
    setCuts([])
    setParams(new URLSearchParams(), { replace: true })
  }

  return (
    <main id="main" className="container shop">
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link to="/">Home</Link> <span aria-hidden="true">/</span> <span aria-current="page">{heading}</span>
      </nav>

      <div className="shop-top">
        <h1>{q ? `Results for “${q}”` : heading}</h1>
        <div className="shop-tools">
          <button className="btn btn-outline btn-sm filters-toggle" onClick={() => setFiltersOpen((o) => !o)} aria-expanded={filtersOpen} aria-controls="filters">
            <SlidersHorizontal size={16} aria-hidden="true" /> Filters
          </button>
          <label className="sort">
            <span>Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {Object.entries(SORTS).map(([k, s]) => (
                <option key={k} value={k}>{s.label}</option>
              ))}
            </select>
          </label>
        </div>
      </div>

      <div className="shop-body">
        <aside id="filters" className={`filters ${filtersOpen ? 'open' : ''}`} aria-label="Filters">
          <fieldset>
            <legend>Category</legend>
            <div className="chip-set">
              {[{ id: 'all', name: 'All' }, ...CATEGORIES].map((c) => (
                <label key={c.id} className={`chip ${cat === c.id ? 'on' : ''}`}>
                  <input type="radio" name="cat" checked={cat === c.id} onChange={() => update('cat', c.id)} />
                  {c.name}
                </label>
              ))}
            </div>
          </fieldset>

          <fieldset>
            <legend>Cut</legend>
            {CUTS.map((c) => (
              <label key={c} className="check">
                <input
                  type="checkbox"
                  checked={cuts.includes(c)}
                  onChange={() => setCuts((x) => (x.includes(c) ? x.filter((y) => y !== c) : [...x, c]))}
                />
                {c}
              </label>
            ))}
          </fieldset>

          <fieldset>
            <legend>Price for 500 g</legend>
            <label className="range">
              <span>Up to <b>{rupees(max)}</b></span>
              <input type="range" min="150" max={MAX_PRICE} step="10" value={max} onChange={(e) => update('max', e.target.value == MAX_PRICE ? null : e.target.value)} />
            </label>
          </fieldset>

          <button className="link-btn" onClick={clearAll}>
            <X size={14} aria-hidden="true" /> Clear all filters
          </button>
        </aside>

        <section className="results" aria-live="polite">
          <p className="results-count">
            {results.length} {results.length === 1 ? 'product' : 'products'} found
          </p>
          {results.length === 0 ? (
            <div className="empty">
              <ProductArt art={{ kind: 'fish', tone: 'puthi' }} />
              <p className="empty-title">Nothing matches these filters</p>
              <p className="muted">Try a different cut or a higher price limit, or search for something else.</p>
              <button className="btn btn-dark" onClick={clearAll}>Clear all filters</button>
            </div>
          ) : (
            <div className="grid grid-shop">
              {results.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
