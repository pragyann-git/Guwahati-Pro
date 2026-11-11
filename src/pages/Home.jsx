import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Plus, Check, Snowflake, Scissors, Truck, Smartphone } from 'lucide-react'
import { CATEGORIES, PRODUCTS, SCENES, firstSentence, rupees } from '../data'
import { useStore } from '../store'
import ProductArt from '../components/ProductArt'
import ProductCard from '../components/ProductCard'

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

const TOTAL_RATINGS = PRODUCTS.reduce((n, p) => n + p.reviews, 0)

function Squiggle() {
  return (
    <svg className="squiggle" viewBox="0 0 120 28" aria-hidden="true">
      <path d="M2 20 C 22 4, 38 30, 58 14 S 92 2, 118 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function Hero() {
  const thumbs = ['hilsa-whole', 'chicken-curry-cut', 'mutton-curry-cut', 'tiger-prawns', 'rohu-curry-cut'].map((id) => PRODUCTS.find((p) => p.id === id))
  return (
    <section className="hero container">
      <div className="hero-copy">
        <p className="eyebrow">
          <span className="eyebrow-line" aria-hidden="true" /> Fresh from Guwahati's ghats and farms
        </p>
        <h1>Fresh fish &amp; meat, cut to order</h1>
        <p className="hero-lede">
          Rohu from Uzan Bazar, hilsa from Fancy Bazar and young goat from Nalbari, cleaned and cut only after you order, then
          delivered cold in 90 minutes.
        </p>
        <div className="hero-actions">
          <Link to="/shop" className="btn btn-dark">
            Order now <ArrowRight size={17} aria-hidden="true" />
          </Link>
          <Squiggle />
        </div>
      </div>

      <div className="hero-media">
        <div className="hero-blob">
          <ProductArt image={SCENES.hero} art={{ kind: 'fish', tone: 'rohu' }} alt="Bowl of Assamese fish curry" eager />
        </div>
        <div className="hero-bubble">
          <ProductArt image={SCENES.heroSide} art={{ kind: 'steak', tone: 'rohu' }} alt="" eager />
        </div>
        <div className="hero-proof">
          <div className="proof-faces" aria-hidden="true">
            {thumbs.map((p) => (
              <span key={p.id}>
                <ProductArt image={p.image} art={p.art} />
              </span>
            ))}
          </div>
          <p>
            <b>{(Math.floor(TOTAL_RATINGS / 1000) * 1000).toLocaleString('en-IN')}+</b>
            <span>ratings from Guwahati kitchens</span>
          </p>
        </div>
      </div>
    </section>
  )
}

function Intro() {
  return (
    <section className="intro container" aria-labelledby="intro-title">
      <h2 id="intro-title" className="display-center">From the ghat to your kitchen by breakfast</h2>
      <p className="intro-sub">
        We buy at the morning auctions, cut in our Beltola cutting room and keep everything between 0 and 4 °C until it reaches you.
      </p>
      <figure className="wide-photo">
        <ProductArt image={SCENES.market} art={{ kind: 'fish', tone: 'puthi' }} alt="Fish laid out at the Uzan Bazar market in Guwahati" />
        <figcaption>Uzan Bazar ghat, 5:10 AM</figcaption>
      </figure>
    </section>
  )
}

const FILTERS = [
  { id: 'all', label: 'All', test: () => true },
  ...CATEGORIES.map((c) => ({ id: c.id, label: c.name, test: (p) => p.category === c.id })),
  { id: 'budget', label: 'Under ₹250', test: (p) => p.price < 250 },
]

function Explore() {
  const { add, qtyOf } = useStore()
  const [filter, setFilter] = useState('all')
  const list = useMemo(() => {
    const f = FILTERS.find((x) => x.id === filter)
    return PRODUCTS.filter(f.test).sort((a, b) => b.reviews - a.reviews).slice(0, 5)
  }, [filter])
  const [activeId, setActiveId] = useState(list[0].id)
  const active = list.find((p) => p.id === activeId) ?? list[0]
  const browseTo = filter === 'all' ? '/shop' : filter === 'budget' ? '/shop?max=250' : `/shop?cat=${filter}`

  return (
    <section className="explore container" aria-labelledby="explore-title">
      <div className="explore-head">
        <h2 id="explore-title">Explore today's catch</h2>
        <div className="explore-aside">
          <p>Choose from river fish, broiler and desi chicken, and young goat. Prices follow this morning's market rate.</p>
          <Link to={browseTo} className="btn btn-dark btn-sm">
            Browse all <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </div>

      <div className="pill-row" role="tablist" aria-label="Filter today's catch">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            role="tab"
            aria-selected={filter === f.id}
            className={`pill ${filter === f.id ? 'on' : ''}`}
            onClick={() => {
              setFilter(f.id)
              const first = PRODUCTS.filter(f.test).sort((a, b) => b.reviews - a.reviews)[0]
              if (first) setActiveId(first.id)
            }}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="menu-panel">
        <div className="menu-list">
          <p className="menu-kicker">{FILTERS.find((f) => f.id === filter).label === 'All' ? 'Most ordered today' : FILTERS.find((f) => f.id === filter).label}</p>
          <ul>
            {list.map((p) => {
              const inCart = qtyOf(p.id, 500) > 0
              return (
                <li
                  key={p.id}
                  className={p.id === active.id ? 'on' : ''}
                  onMouseEnter={() => setActiveId(p.id)}
                  onFocus={() => setActiveId(p.id)}
                >
                  <div className="menu-row">
                    <Link to={`/product/${p.id}`} className="menu-name">{p.name}</Link>
                    <span className="menu-dots" aria-hidden="true" />
                    <span className="menu-price">{rupees(p.price)}</span>
                  </div>
                  <div className="menu-sub">
                    <p>{firstSentence(p.description)}</p>
                    <button
                      className={`menu-add ${inCart ? 'added' : ''}`}
                      onClick={() => add(p.id, 500)}
                      aria-label={`Add 500 g of ${p.name} to cart`}
                    >
                      {inCart ? <Check size={16} /> : <Plus size={16} />}
                    </button>
                  </div>
                </li>
              )
            })}
          </ul>
        </div>
        <div className="menu-photo">
          <ProductArt key={active.id} image={active.image} art={active.art} alt={active.name} />
          <span className="menu-photo-tag">500 g · {active.cut.toLowerCase()} · since {active.arrived}</span>
        </div>
      </div>
    </section>
  )
}

function Favourites() {
  const best = PRODUCTS.filter((p) => p.bestseller).slice(0, 4)
  return (
    <section className="favourites container" aria-labelledby="fav-title">
      <div className="section-head">
        <h2 id="fav-title">Most loved this week</h2>
        <Link to="/shop" className="see-all">
          See all <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <div className="grid grid-4">
        {best.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}

function CatchBanner() {
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
    <section className="banner" aria-labelledby="catch-title">
      <ProductArt image={SCENES.kitchen} art={null} alt="" className="banner-bg" />
      <div className="container banner-inner">
        <p className="banner-quote">
          Serving Guwahati's kitchens <em>since 5 AM.</em>
        </p>
        <div className="catch">
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
        </div>
      </div>
    </section>
  )
}

const STEPS = [
  { icon: Smartphone, title: 'Pick your cut', body: 'Choose the fish or meat, the weight and how you want it cut: curry pieces, steaks, boneless or keema.' },
  { icon: Scissors, title: 'We cut it fresh', body: "Nothing is pre-packed. Your order is cleaned and cut in our Beltola cutting room once it comes in." },
  { icon: Truck, title: 'Cold to your door', body: 'Insulated bags keep it between 0 and 4 °C. Delivery in about 90 minutes, free over ₹499.' },
]

function HowItWorks() {
  return (
    <section className="how container" id="how" aria-labelledby="how-title">
      <h2 id="how-title" className="display-center">How it works</h2>
      <ol className="steps">
        {STEPS.map((s, i) => (
          <li key={s.title}>
            <span className="step-num" aria-hidden="true">0{i + 1}</span>
            <s.icon size={22} aria-hidden="true" className="step-icon" />
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </li>
        ))}
      </ol>
    </section>
  )
}

function Budget() {
  const budget = PRODUCTS.filter((p) => p.price < 250).slice(0, 4)
  return (
    <section className="favourites container" aria-labelledby="budget-title">
      <div className="section-head">
        <h2 id="budget-title">Under ₹250 for 500 g</h2>
        <Link to="/shop?max=250" className="see-all">
          See all <ArrowRight size={16} aria-hidden="true" />
        </Link>
      </div>
      <div className="grid grid-4">
        {budget.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  return (
    <main id="main" className="home">
      <Hero />
      <Intro />
      <Explore />
      <Favourites />
      <CatchBanner />
      <HowItWorks />
      <Budget />
    </main>
  )
}
