// Cart pricing shared by the browser and the payment server (api/), so the
// amount charged is always recomputed from the catalogue, never trusted from the browser.
import { DELIVERY_FEE, FREE_DELIVERY_OVER, WEIGHTS, byId } from './data.js'

export function priceCart(items) {
  const lines = []
  for (const item of Array.isArray(items) ? items : []) {
    const product = byId(item?.id)
    const weight = WEIGHTS.find((w) => w.grams === item?.grams)
    const qty = Math.floor(Number(item?.qty))
    if (!product || !weight || !(qty > 0) || qty > 50) continue
    const unit = product.price * weight.factor
    lines.push({ id: product.id, grams: weight.grams, qty, product, weight, unit, total: unit * qty })
  }
  const subtotal = lines.reduce((s, l) => s + l.total, 0)
  const delivery = subtotal === 0 || subtotal >= FREE_DELIVERY_OVER ? 0 : DELIVERY_FEE
  return { lines, subtotal, delivery, total: subtotal + delivery }
}
