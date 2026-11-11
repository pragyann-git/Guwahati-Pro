// npm run images
// Shrinks every photo in public/products and public/images so the site loads fast
// on mobile data, and builds the phone app icons from public/favicon.svg.
//
// Drop new photos in with the right name (e.g. public/products/hilsa-whole.png from
// an AI tool) and run this: PNG/WebP/JPEG files are resized and saved as .jpg.
import fs from 'node:fs/promises'
import path from 'node:path'
import sharp from 'sharp'

const SETS = [
  { dir: 'public/products', width: 900, quality: 74 },
  { dir: 'public/images', width: 1600, quality: 72 },
]
const kb = (n) => `${Math.round(n / 1024)} KB`

let before = 0
let after = 0
for (const { dir, width, quality } of SETS) {
  for (const name of await fs.readdir(dir)) {
    if (!/\.(jpe?g|png|webp)$/i.test(name)) continue
    const src = path.join(dir, name)
    const out = path.join(dir, name.replace(/\.(jpe?g|png|webp)$/i, '.jpg'))
    const input = await fs.readFile(src)
    const output = await sharp(input)
      .rotate()
      .resize({ width, withoutEnlargement: true })
      .jpeg({ quality, mozjpeg: true, progressive: true })
      .toBuffer()
    // Keep the original if it's already smaller (and already a .jpg).
    const keep = src === out && output.length >= input.length
    if (!keep) await fs.writeFile(out, output)
    if (src !== out) await fs.unlink(src)
    before += input.length
    after += keep ? input.length : output.length
    console.log(`${out}: ${kb(input.length)} → ${kb(keep ? input.length : output.length)}`)
  }
}
console.log(`\nPhotos: ${kb(before)} → ${kb(after)}`)

// App icons for "Add to home screen"
const svg = await fs.readFile('public/icon.svg')
for (const size of [192, 512]) {
  await sharp(svg).resize(size, size).png().toFile(`public/icon-${size}.png`)
}
await sharp(svg).resize(180, 180).png().toFile('public/apple-touch-icon.png')
console.log('Icons: public/icon-192.png, public/icon-512.png, public/apple-touch-icon.png')
