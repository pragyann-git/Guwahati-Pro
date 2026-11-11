import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ChevronLeft, ChevronRight, Scissors, Snowflake, Truck } from 'lucide-react'
import { CATEGORIES, PRODUCTS } from '../data'
import ProductArt from '../components/ProductArt'
import ProductCard from '../components/ProductCard'

const SLIDES = [
  {
    title: 'Save 20% with GHY Pro Club',
    body: 'Join the yearly plan for free delivery on every order and 20% off fish, chicken and mutton.',
    cta: 'See Club plans',
    to: '/shop',
    tone: 'club',
    art: [
      { kind: 'fish', tone: 'rohu' },
      { kind: 'drumstick' },
      { kind: 'chop' },
    ],
  },
  {
    title: 'Hilsa season is here',
    body: 'Silver ilish from Fancy Bazar, scaled and cut into steaks or kept whole for bhapa.',
    cta: 'Shop hilsa',
    to: '/product/hilsa-whole',
    tone: 'river',
    art: [{ kind: 'fish', tone: 'hilsa' }, { kind: 'steak', tone: 'rohu' }],
  },
  {
    title: 'Book your Sunday mutton',
    body: 'Order by 9 PM on Saturday and get fresh curry cut mutton at your door by 8 AM on Sunday.',
    cta: 'Pre-book mutton',
    to: '/shop?cat=mutton',
    tone: 'sunday',
    art: [{ kind: 'curry', tone: 'mutton' }, { kind: 'chop' }],
  },
]

// Short names for the "Today's catch" board
const BOARD_NAMES = {
  'chicken-curry-cut': 'Broiler chicken',
  'chicken-breast-boneless': 'Broiler chicken',
  'chicken-drumsticks': 'Broiler chicken',
  'chicken-keema': 'Broiler chicken',
  'desi-chicken': 'Desi chicken',
  'tiger-prawns': 'Tiger prawns',
  'mutton-curry-cut': 'Goat',
  'mutton-keema': 'Goat',
  'mutton-chops': 'Goat',
  'mutton-boneless': 'Goat',
}

const minutes = (t) => {
  const [hm, ap] = t.split(' ')
  const [h, m] = hm.split(':').map(Number)
  return ((h % 12) + (ap === 'PM' ? 12 : 0)) * 60 + m
}

function CatchBoard() {
  const rows = useMemo(() => {
    const groups = new Map()
    for (const p of PRODUCTS) {
      const key = `${p.arrived}|${p.source}`
      if (!groups.has(key)) groups.set(key, { time: p.arrived, source: p.source, items: [] })
      const short = BOARD_NAMES[p.id] ?? p.name.split(/[ ,]/)[0]
      const g = groups.get(key)
      if (!g.items.includes(short)) g.items.push(short)
    }
    return [...groups.values()].sort((a, b) => minutes(a.time) - minutes(b.time))
  }, [])
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'long' })

  return (
    <section className="catch" aria-labelledby="catch-title">
      <div className="catch-head">
        <h2 id="catch-title">Today's catch</h2>
        <p>{today}</p>
      </div>
      <ol className="catch-rows">
        {rows.map((r) => (
          <li key={r.time + r.source}>
            <time>{r.time}</time>
            <span className="catch-what">
              <b>{r.items.join(', ')}</b>
              <span>{r.source}</span>
            </span>
          </li>
        ))}
      </ol>
      <p className="catch-foot">
        <Snowflake size={15} aria-hidden="true" /> Kept between 0 and 4 °C until it reaches you
      </p>
    </section>
  )
}

function Promo() {
  const [i, setI] = useState(0)
  const s = SLIDES[i]
  const go = (d) => setI((i + d + SLIDES.length) % SLIDES.length)
  return (
    <section className={`promo promo-${s.tone}`} aria-roledescription="carousel" aria-label="Offers">
      <div className="promo-copy" key={i}>
        <h1>{s.title}</h1>
        <p>{s.body}</p>
        <Link to={s.to} className="btn btn-dark">
          {s.cta}
        </Link>
      </div>
      <div className={`promo-art n${s.art.length}`} aria-hidden="true" key={`a${i}`}>
        {s.art.map((a, k) => (
          <div key={k} className="promo-art-item">
            <ProductArt art={a} />
          </div>
        ))}
      </div>
      <div className="promo-controls">
        <button className="icon-btn" onClick={() => go(-1)} aria-label="Previous offer">
          <ChevronLeft size={18} />
        </button>
        <div className="dots">
          {SLIDES.map((sl, k) => (
            <button
              key={k}
              className={k === i ? 'dot active' : 'dot'}
              onClick={() => setI(k)}
              aria-label={`Show offer ${k + 1}: ${sl.title}`}
              aria-current={k === i}
            />
          ))}
        </div>
        <button className="icon-btn" onClick={() => go(1)} aria-label="Next offer">
          <ChevronRight size={18} />
        </button>
      </div>
    </section>
  )
}

function Row({ title, to, products }) {
  return (
    <section className="row-section">
      <div className="section-head">
        <h2>{title}</h2>
        <Link to={to} className="see-all">See all</Link>
      </div>
      <div className="grid">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  const best = PRODUCTS.filter((p) => p.bestseller).slice(0, 5)
  const budget = PRODUCTS.filter((p) => p.price < 250).slice(0, 5)

  return (
    <main id="main" className="container">
      <div className="hero">
        <Promo />
        <CatchBoard />
      </div>

      <section className="row-section" aria-labelledby="cat-title">
        <div className="section-head">
          <h2 id="cat-title">What are you cooking today?</h2>
        </div>
        <div className="cats">
          {CATEGORIES.map((c) => {
            const n = PRODUCTS.filter((p) => p.category === c.id).length
            return (
              <Link key={c.id} to={`/shop?cat=${c.id}`} className={`cat tint-${c.id}`}>
                <span className="cat-text">
                  <span className="cat-name">{c.name}</span>
                  <span className="cat-blurb">{c.blurb}</span>
                  <span className="cat-count">{n} items</span>
                </span>
                <ProductArt art={c.art} />
              </Link>
            )
          })}
        </div>
      </section>

      <Row title="Guwahati's favourites" to="/shop" products={best} />
      <Row title="Under ₹250 for 500 g" to="/shop?max=250" products={budget} />

      <section className="promise" aria-label="How we handle your order">
        <div>
          <Scissors size={22} aria-hidden="true" />
          <h3>Cut after you order</h3>
          <p>Nothing is pre-packed. Your fish is cleaned and your meat is cut once your order comes in.</p>
        </div>
        <div>
          <Snowflake size={22} aria-hidden="true" />
          <h3>Cold the whole way</h3>
          <p>Chilled at 0 to 4 °C in our Beltola cutting room and in insulated delivery bags.</p>
        </div>
        <div>
          <Truck size={22} aria-hidden="true" />
          <h3>At your door in 90 minutes</h3>
          <p>From 6 AM to 10 PM across Guwahati, with free delivery on orders over ₹499.</p>
        </div>
      </section>
    </main>
  )
}
