import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { byId, WEIGHTS, DELIVERY_FEE, FREE_DELIVERY_OVER } from './data'

const StoreContext = createContext(null)

const load = (key, fallback) => {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}
const save = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* storage unavailable: keep working in memory */
  }
}

export function StoreProvider({ children }) {
  const [cart, setCart] = useState(() => load('ghy.cart', []))
  const [favourites, setFavourites] = useState(() => load('ghy.favs', []))
  const [area, setArea] = useState(() => load('ghy.area', 'Zoo Road'))
  const [cartOpen, setCartOpen] = useState(false)
  const [toast, setToast] = useState(null)
  const toastTimer = useRef()

  useEffect(() => save('ghy.cart', cart), [cart])
  useEffect(() => save('ghy.favs', favourites), [favourites])
  useEffect(() => save('ghy.area', area), [area])

  const notify = useCallback((message) => {
    clearTimeout(toastTimer.current)
    setToast({ message, key: Date.now() })
    toastTimer.current = setTimeout(() => setToast(null), 3500)
  }, [])

  const add = useCallback(
    (id, grams = 500, qty = 1) => {
      setCart((c) => {
        const i = c.findIndex((l) => l.id === id && l.grams === grams)
        if (i === -1) return [...c, { id, grams, qty }]
        const next = [...c]
        next[i] = { ...next[i], qty: next[i].qty + qty }
        return next
      })
      notify(`Added ${byId(id).name} to your cart`)
    },
    [notify],
  )

  const setQty = useCallback((id, grams, qty) => {
    setCart((c) =>
      qty <= 0
        ? c.filter((l) => !(l.id === id && l.grams === grams))
        : c.map((l) => (l.id === id && l.grams === grams ? { ...l, qty } : l)),
    )
  }, [])

  const qtyOf = useCallback(
    (id, grams = 500) => cart.find((l) => l.id === id && l.grams === grams)?.qty ?? 0,
    [cart],
  )

  const toggleFavourite = useCallback((id) => {
    setFavourites((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]))
  }, [])

  const lines = useMemo(
    () =>
      cart
        .map((l) => {
          const product = byId(l.id)
          if (!product) return null
          const w = WEIGHTS.find((w) => w.grams === l.grams) ?? WEIGHTS[1]
          return { ...l, product, weight: w, unit: product.price * w.factor, total: product.price * w.factor * l.qty }
        })
        .filter(Boolean),
    [cart],
  )

  const subtotal = lines.reduce((s, l) => s + l.total, 0)
  const count = lines.reduce((s, l) => s + l.qty, 0)
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE

  const value = {
    lines, count, subtotal, delivery, total: subtotal + delivery,
    add, setQty, qtyOf,
    favourites, toggleFavourite,
    area, setArea,
    cartOpen, setCartOpen,
    toast, notify,
  }
  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export const useStore = () => useContext(StoreContext)
