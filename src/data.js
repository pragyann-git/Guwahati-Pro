// Sample catalogue. Prices are per the listed base weight (500 g unless noted).
// Replace with your own products, prices and photos (see `image` in README).

// ── Shop settings: change these to your real details ──────────────
export const SHOP = {
  name: 'GHY Pro',
  // WhatsApp number that receives orders: country code + number, digits only.
  whatsapp: '919401807049',
  phone: '+91 94018 07049',
  // Online payments turn on when VITE_RAZORPAY_KEY_ID is set (see README).
  razorpayKey: import.meta.env?.VITE_RAZORPAY_KEY_ID ?? '',
}

// Delivery windows customers can choose at checkout (24-hour clock).
export const SLOTS = [
  { start: 7, end: 9 },
  { start: 9, end: 11 },
  { start: 11, end: 13 },
  { start: 16, end: 18 },
  { start: 18, end: 20 },
  { start: 20, end: 22 },
]
// A slot can be booked until this many hours before it starts.
export const SLOT_CUTOFF_HOURS = 2

export const AREAS = [
  'Zoo Road',
  'Ganeshguri',
  'Dispur',
  'Beltola',
  'Six Mile',
  'Chandmari',
  'Paltan Bazaar',
  'Uzan Bazar',
  'Maligaon',
  'Jalukbari',
  'Bhangagarh',
  'Khanapara',
]

export const CATEGORIES = [
  {
    id: 'fish',
    name: 'Fish',
    blurb: 'River fish from Uzan Bazar and Fancy Bazar, cleaned your way',
    art: { kind: 'fish', tone: 'rohu' },
  },
  {
    id: 'chicken',
    name: 'Chicken',
    blurb: 'Broiler and desi chicken, cut fresh after you order',
    art: { kind: 'drumstick' },
  },
  {
    id: 'mutton',
    name: 'Mutton',
    blurb: 'Young goat from Assam farms, curry cut, keema and chops',
    art: { kind: 'chop' },
  },
]

export const CUTS = ['Curry cut', 'Steaks', 'Whole cleaned', 'Boneless', 'Mince', 'Chops']

// Every product's photo lives at public/products/<id>.jpg. Replace any file to
// change the picture; if a file is missing the drawn illustration is used.
const withPhoto = (p) => ({ image: `/products/${p.id}.jpg`, ...p })

// Lifestyle photos used around the home page (public/images/).
export const SCENES = {
  hero: '/images/hero-fish-curry.jpg',
  heroSide: '/images/hero-side.jpg',
  market: '/images/uzan-bazar-market.jpg',
  kitchen: '/images/home-kitchen.jpg',
  cta: '/images/cta-plate.jpg',
}

export const PRODUCTS = [
  // ── Fish ───────────────────────────────────────────
  {
    id: 'rohu-curry-cut',
    name: 'Rohu curry cut',
    local: 'Rou maas',
    category: 'fish',
    cut: 'Curry cut',
    price: 190,
    mrp: 220,
    rating: 4.7,
    reviews: 1840,
    art: { kind: 'steak', tone: 'rohu' },
    source: 'Uzan Bazar ghat',
    arrived: '5:10 AM',
    bestseller: true,
    description:
      'Fresh rohu from the Brahmaputra catchment, scaled, gutted and cut into curry pieces with the head kept separate. Firm, sweet flesh that holds together in a mustard or tenga curry. Cut only after you order, never frozen.',
  },
  {
    id: 'hilsa-whole',
    name: 'Hilsa, whole cleaned',
    local: 'Ilish maas',
    category: 'fish',
    cut: 'Whole cleaned',
    price: 650,
    mrp: 750,
    rating: 4.8,
    reviews: 962,
    art: { kind: 'fish', tone: 'hilsa' },
    source: 'Fancy Bazar wholesale',
    arrived: '5:40 AM',
    bestseller: true,
    description:
      'Silver hilsa around 500 g, scaled and cleaned with the roe kept if present. Rich, oily and fragrant: ideal for bhapa, smoked in banana leaf, or a light jhol. Tell us at checkout if you want it cut into steaks.',
  },
  {
    id: 'magur-live-cut',
    name: 'Magur, cut after you order',
    local: 'Magur maas',
    category: 'fish',
    cut: 'Curry cut',
    price: 420,
    mrp: 460,
    rating: 4.6,
    reviews: 410,
    art: { kind: 'fish', tone: 'magur' },
    source: 'Local pond, Sonapur',
    arrived: '6:05 AM',
    description:
      'Walking catfish kept live in our tanks and cleaned only when your order comes in. Soft, light flesh that is often cooked for recovery meals with bottle gourd or in a thin jhol.',
  },
  {
    id: 'chital-steaks',
    name: 'Chital steaks',
    local: 'Chital maas',
    category: 'fish',
    cut: 'Steaks',
    price: 380,
    mrp: 430,
    rating: 4.5,
    reviews: 288,
    art: { kind: 'steak', tone: 'chital' },
    source: 'Uzan Bazar ghat',
    arrived: '5:10 AM',
    description:
      'Thick steaks of chital (clown knifefish), cut from the belly side. Great for frying with turmeric and salt or for a rich curry with tomato and potato.',
  },
  {
    id: 'pabho-whole',
    name: 'Pabho, whole cleaned',
    local: 'Pabho maas',
    category: 'fish',
    cut: 'Whole cleaned',
    price: 480,
    mrp: 520,
    rating: 4.6,
    reviews: 205,
    art: { kind: 'fish', tone: 'pabho' },
    source: 'Fancy Bazar wholesale',
    arrived: '5:40 AM',
    description:
      'Butter catfish, small and delicate with very few bones. Cleaned whole: cook it with outenga (elephant apple) or mustard greens.',
  },
  {
    id: 'borali-steaks',
    name: 'Borali steaks',
    local: 'Borali maas',
    category: 'fish',
    cut: 'Steaks',
    price: 360,
    mrp: 399,
    rating: 4.4,
    reviews: 174,
    art: { kind: 'steak', tone: 'borali' },
    source: 'Uzan Bazar ghat',
    arrived: '5:10 AM',
    description:
      'Boal (wallago) steaks with firm, boneless-feeling flesh. A favourite for spicy curries and dry preparations.',
  },
  {
    id: 'tiger-prawns',
    name: 'Tiger prawns, deveined',
    local: 'Isa maas',
    category: 'fish',
    cut: 'Whole cleaned',
    price: 540,
    mrp: 620,
    rating: 4.7,
    reviews: 731,
    art: { kind: 'prawn' },
    source: 'Kolkata cold chain',
    arrived: '6:30 AM',
    bestseller: true,
    description:
      'Large prawns, 20 to 25 pieces per kg, shelled with the tail on and deveined. Kept between 0 and 4 °C from the truck to your door.',
  },
  {
    id: 'puthi-small-fish',
    name: 'Puthi, small fish',
    local: 'Puthi maas',
    category: 'fish',
    cut: 'Whole cleaned',
    price: 160,
    mrp: 180,
    rating: 4.3,
    reviews: 156,
    art: { kind: 'fish', tone: 'puthi' },
    source: 'Local pond, Sonapur',
    arrived: '6:05 AM',
    description:
      'Small puthi, cleaned and ready to fry crisp or cook with sour tomato. Cooked bones and all.',
  },

  // ── Chicken ────────────────────────────────────────
  {
    id: 'chicken-curry-cut',
    name: 'Chicken curry cut, with skin',
    local: 'Kukura mangxo',
    category: 'chicken',
    cut: 'Curry cut',
    price: 140,
    mrp: 165,
    rating: 4.6,
    reviews: 3120,
    art: { kind: 'curry', tone: 'chicken' },
    source: 'GHY Pro cutting room, Beltola',
    arrived: '6:00 AM',
    bestseller: true,
    description:
      'Bone-in pieces from a whole broiler, 14 to 16 pieces per kg, with the skin left on for a richer gravy. Cut the morning it is delivered.',
  },
  {
    id: 'chicken-breast-boneless',
    name: 'Chicken breast, boneless',
    local: 'Kukura mangxo',
    category: 'chicken',
    cut: 'Boneless',
    price: 210,
    mrp: 240,
    rating: 4.7,
    reviews: 1508,
    art: { kind: 'breast' },
    source: 'GHY Pro cutting room, Beltola',
    arrived: '6:00 AM',
    description:
      'Skinless breast fillets, trimmed of fat. Lean and quick to cook: grill, stir-fry or cube for tikka.',
  },
  {
    id: 'chicken-drumsticks',
    name: 'Chicken drumsticks',
    local: 'Kukura mangxo',
    category: 'chicken',
    cut: 'Curry cut',
    price: 190,
    mrp: 210,
    rating: 4.5,
    reviews: 842,
    art: { kind: 'drumstick' },
    source: 'GHY Pro cutting room, Beltola',
    arrived: '6:00 AM',
    description:
      'Six to eight skinless drumsticks per 500 g, scored so marinades soak in. Good for roasting, tandoori and frying.',
  },
  {
    id: 'desi-chicken',
    name: 'Desi chicken curry cut',
    local: 'Deshi kukura',
    category: 'chicken',
    cut: 'Curry cut',
    price: 320,
    mrp: 360,
    rating: 4.8,
    reviews: 690,
    art: { kind: 'curry', tone: 'desi' },
    source: 'Free-range farms, Kamrup',
    arrived: '6:20 AM',
    bestseller: true,
    description:
      'Free-range country chicken with firmer, more flavourful meat. Takes longer to cook: try it slow-cooked with black sesame or in a pressure-cooked curry.',
  },
  {
    id: 'chicken-keema',
    name: 'Chicken keema',
    local: 'Kukura keema',
    category: 'chicken',
    cut: 'Mince',
    price: 200,
    mrp: 225,
    rating: 4.4,
    reviews: 377,
    art: { kind: 'mince', tone: 'chicken' },
    source: 'GHY Pro cutting room, Beltola',
    arrived: '6:00 AM',
    description:
      'Minced from leg and breast meat after you order. For momos, keema paratha and cutlets.',
  },

  // ── Mutton ─────────────────────────────────────────
  {
    id: 'mutton-curry-cut',
    name: 'Mutton curry cut',
    local: 'Chagoli mangxo',
    category: 'mutton',
    cut: 'Curry cut',
    price: 420,
    mrp: 480,
    rating: 4.7,
    reviews: 2210,
    art: { kind: 'curry', tone: 'mutton' },
    source: 'Goat farms, Nalbari',
    arrived: '5:30 AM',
    bestseller: true,
    description:
      'Bone-in pieces of young goat from the shoulder, leg and ribs, cut into even curry pieces. Tender in about 35 minutes in a pressure cooker.',
  },
  {
    id: 'mutton-keema',
    name: 'Mutton keema',
    local: 'Chagoli keema',
    category: 'mutton',
    cut: 'Mince',
    price: 440,
    mrp: 490,
    rating: 4.5,
    reviews: 612,
    art: { kind: 'mince', tone: 'mutton' },
    source: 'Goat farms, Nalbari',
    arrived: '5:30 AM',
    description:
      'Lean leg meat, double minced with a little fat for flavour. For kebabs, keema matar and stuffed pitha.',
  },
  {
    id: 'mutton-chops',
    name: 'Mutton chops',
    local: 'Chagoli mangxo',
    category: 'mutton',
    cut: 'Chops',
    price: 460,
    mrp: 520,
    rating: 4.6,
    reviews: 318,
    art: { kind: 'chop' },
    source: 'Goat farms, Nalbari',
    arrived: '5:30 AM',
    description:
      'Rib chops cut about 2 cm thick with the bone in. Marinate overnight and grill, or slow-cook in a rich gravy.',
  },
  {
    id: 'mutton-boneless',
    name: 'Mutton boneless',
    local: 'Chagoli mangxo',
    category: 'mutton',
    cut: 'Boneless',
    price: 560,
    mrp: 620,
    rating: 4.6,
    reviews: 274,
    art: { kind: 'curry', tone: 'mutton-boneless' },
    source: 'Goat farms, Nalbari',
    arrived: '5:30 AM',
    description:
      'Boneless cubes from the leg, trimmed of sinew. For biryani, seekh and quick dry fries.',
  },
].map(withPhoto)

export const WEIGHTS = [
  { grams: 250, label: '250 g', factor: 0.5 },
  { grams: 500, label: '500 g', factor: 1 },
  { grams: 1000, label: '1 kg', factor: 2 },
]

export const DELIVERY_FEE = 39
export const FREE_DELIVERY_OVER = 499

export const discount = (p) => Math.round(((p.mrp - p.price) / p.mrp) * 100)
export const rupees = (n) => '₹' + Math.round(n).toLocaleString('en-IN')
export const byId = (id) => PRODUCTS.find((p) => p.id === id)
export const firstSentence = (s) => s.split(/(?<=\.)\s/)[0]
