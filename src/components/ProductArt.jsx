// Product pictures. Each product points at a photo in public/products/.
// If the photo is missing or fails to load, a drawn illustration is shown instead,
// so you can drop in your own (or AI-generated) photos at any time.
import { useState } from 'react'

const FISH = {
  rohu: { top: '#7D8B97', body: '#B6C2CB', belly: '#EEF2F4', fin: '#D7897A' },
  hilsa: { top: '#6E8597', body: '#C3D0DA', belly: '#F4F7F9', fin: '#B9C6D0' },
  magur: { top: '#3F362F', body: '#64584D', belly: '#9C8E80', fin: '#4E443B' },
  pabho: { top: '#CDBE9C', body: '#E7DCC2', belly: '#F8F2E4', fin: '#DCCFB2' },
  puthi: { top: '#B8954C', body: '#DEC78E', belly: '#F6EDD1', fin: '#DD7656' },
}
const STEAK = {
  rohu: { skin: '#7D8B97', flesh: '#F1C3B2', line: '#E3A994' },
  chital: { skin: '#8F978F', flesh: '#F4D7C9', line: '#E8BBA7' },
  borali: { skin: '#66737A', flesh: '#F6E0D2', line: '#E9C3AE' },
}
const MEAT = {
  chicken: { meat: '#EFB79C', skin: '#F7D9C6', bone: '#F6EFE2', shade: '#DE9C80' },
  desi: { meat: '#E3A27F', skin: '#EDC78F', bone: '#F6EFE2', shade: '#CF8962' },
  mutton: { meat: '#B3403E', skin: '#F2E1D8', bone: '#F6EFE2', shade: '#8F2F30' },
  'mutton-boneless': { meat: '#B84542', skin: '#F2E1D8', bone: null, shade: '#932F30' },
}

function Fish({ tone = 'rohu', x = 0, y = 0, s = 1, flip = false, whiskers = false, long = false }) {
  const c = FISH[tone] ?? FISH.rohu
  const id = `f-${tone}-${x}-${y}`
  const body = long
    ? 'M22 80 C50 58 128 56 160 78 C130 100 52 102 22 80 Z'
    : 'M24 80 C52 44 126 42 158 78 C126 116 52 116 24 80 Z'
  return (
    <g transform={`translate(${x} ${y}) scale(${flip ? -s : s} ${s}) ${flip ? 'translate(-180 0)' : ''}`}>
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor={c.top} />
          <stop offset=".45" stopColor={c.body} />
          <stop offset="1" stopColor={c.belly} />
        </linearGradient>
      </defs>
      <path d="M156 78 L186 56 C182 70 182 88 186 102 Z" fill={c.fin} />
      <path d="M86 50 C96 34 116 36 126 52 Z" fill={c.fin} opacity=".9" />
      <path d="M92 104 C100 116 112 116 118 104 Z" fill={c.fin} opacity=".9" />
      <path d={body} fill={`url(#${id})`} />
      <path d="M58 60 C68 72 68 90 58 100" fill="none" stroke={c.top} strokeWidth="2.5" opacity=".55" strokeLinecap="round" />
      <path d="M74 70 Q100 64 140 72" fill="none" stroke="#fff" strokeWidth="2.5" opacity=".45" strokeLinecap="round" />
      <circle cx="42" cy="74" r="5" fill="#fff" />
      <circle cx="42" cy="74" r="2.8" fill="#14232A" />
      {whiskers && (
        <g stroke={c.top} strokeWidth="1.6" fill="none" strokeLinecap="round">
          <path d="M28 82 Q14 90 8 104" />
          <path d="M30 84 Q20 98 20 112" />
          <path d="M28 76 Q14 68 6 58" />
        </g>
      )}
    </g>
  )
}

function Steak({ tone = 'rohu', cx, cy, r = 30 }) {
  const c = STEAK[tone] ?? STEAK.rohu
  return (
    <g>
      <ellipse cx={cx} cy={cy} rx={r} ry={r * 0.82} fill={c.flesh} stroke={c.skin} strokeWidth="5" />
      {[0, 60, 120, 180, 240, 300].map((a) => (
        <path
          key={a}
          d={`M${cx} ${cy} Q${cx + Math.cos((a * Math.PI) / 180) * r * 0.5 + 6} ${cy + Math.sin((a * Math.PI) / 180) * r * 0.4} ${cx + Math.cos((a * Math.PI) / 180) * r * 0.85} ${cy + Math.sin((a * Math.PI) / 180) * r * 0.68}`}
          fill="none"
          stroke={c.line}
          strokeWidth="2"
          strokeLinecap="round"
        />
      ))}
      <circle cx={cx} cy={cy - 2} r={r * 0.14} fill="#F7F1E6" stroke={c.line} strokeWidth="1.5" />
    </g>
  )
}

function Prawn({ x, y, s = 1, rot = 0 }) {
  const segs = [0, 1, 2, 3, 4, 5]
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      {segs.map((i) => {
        const a = (-200 + i * 38) * (Math.PI / 180)
        const r = 34 - i * 2.4
        return <circle key={i} cx={Math.cos(a) * 30} cy={Math.sin(a) * 30} r={r * 0.42} fill={i % 2 ? '#F29A70' : '#F5AC85'} />
      })}
      <path d="M26 20 L44 30 L34 40 L22 30 Z" fill="#E9825B" />
      <path d="M-28 -12 Q-60 -40 -70 -10" fill="none" stroke="#E9825B" strokeWidth="1.6" />
      <path d="M-30 -8 Q-58 -20 -74 4" fill="none" stroke="#E9825B" strokeWidth="1.6" />
      <circle cx="-24" cy="-14" r="2.4" fill="#14232A" />
    </g>
  )
}

function Drumstick({ x, y, rot = 0, s = 1, c = MEAT.chicken }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x="20" y="-6" width="52" height="12" rx="6" fill={c.bone} />
      <circle cx="74" cy="-7" r="8" fill={c.bone} />
      <circle cx="74" cy="7" r="8" fill={c.bone} />
      <ellipse cx="0" cy="0" rx="40" ry="28" fill={c.meat} />
      <ellipse cx="-6" cy="-8" rx="24" ry="10" fill="#fff" opacity=".22" />
      <path d="M-24 14 Q0 24 26 10" fill="none" stroke={c.shade} strokeWidth="2.5" opacity=".6" strokeLinecap="round" />
    </g>
  )
}

function Piece({ x, y, r = 18, rot = 0, c, bone = true, cube = false }) {
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot})`}>
      {cube ? (
        <rect x={-r} y={-r * 0.8} width={r * 2} height={r * 1.6} rx={r * 0.45} fill={c.meat} />
      ) : (
        <path
          d={`M${-r} 0 C${-r} ${-r * 0.9} ${r * 0.2} ${-r * 1.05} ${r} ${-r * 0.3} C${r * 1.25} ${r * 0.5} ${r * 0.2} ${r} ${-r * 0.4} ${r * 0.85} C${-r * 0.9} ${r * 0.7} ${-r} ${r * 0.4} ${-r} 0 Z`}
          fill={c.meat}
        />
      )}
      <path d={`M${-r * 0.7} ${-r * 0.35} Q0 ${-r * 0.75} ${r * 0.6} ${-r * 0.3}`} fill="none" stroke={c.skin} strokeWidth={r * 0.22} strokeLinecap="round" opacity=".9" />
      {bone && c.bone && <ellipse cx={r * 0.25} cy={r * 0.25} rx={r * 0.22} ry={r * 0.17} fill={c.bone} stroke={c.shade} strokeWidth="1" />}
    </g>
  )
}

function Chop({ x, y, rot = 0, s = 1 }) {
  const c = MEAT.mutton
  return (
    <g transform={`translate(${x} ${y}) rotate(${rot}) scale(${s})`}>
      <rect x="18" y="-5" width="58" height="10" rx="5" fill={c.bone} />
      <path d="M-34 -4 C-34 -30 4 -34 22 -14 C34 0 28 22 6 28 C-18 34 -34 18 -34 -4 Z" fill={c.skin} />
      <path d="M-27 -4 C-27 -23 0 -26 15 -12 C24 -1 20 16 4 20 C-14 25 -27 13 -27 -4 Z" fill={c.meat} />
      <path d="M-16 -6 Q-4 -2 6 -10" fill="none" stroke={c.skin} strokeWidth="2.5" strokeLinecap="round" opacity=".7" />
    </g>
  )
}

function Mince({ tone = 'chicken' }) {
  const c = MEAT[tone] ?? MEAT.chicken
  const dots = []
  for (let i = 0; i < 70; i++) {
    const a = (i * 137.5 * Math.PI) / 180
    const rr = Math.sqrt(i / 70)
    dots.push(<circle key={i} cx={100 + Math.cos(a) * rr * 52} cy={88 + Math.sin(a) * rr * 26 - (1 - rr) * 14} r="3.2" fill={i % 3 ? c.shade : c.skin} opacity=".75" />)
  }
  return (
    <g>
      <path d="M44 100 C44 62 76 46 100 46 C124 46 156 62 156 100 C156 112 44 112 44 100 Z" fill={c.meat} />
      {dots}
    </g>
  )
}

function Art({ kind, tone }) {
  switch (kind) {
    case 'fish':
      if (tone === 'puthi')
        return (
          <>
            <Fish tone="puthi" x={18} y={6} s={0.6} />
            <Fish tone="puthi" x={78} y={30} s={0.6} flip />
            <Fish tone="puthi" x={30} y={56} s={0.6} />
          </>
        )
      return <Fish tone={tone} x={10} y={4} s={1} whiskers={tone === 'magur'} long={tone === 'magur'} />
    case 'steak':
      return (
        <>
          <Steak tone={tone} cx={70} cy={92} r={32} />
          <Steak tone={tone} cx={124} cy={84} r={34} />
          <Steak tone={tone} cx={98} cy={60} r={26} />
        </>
      )
    case 'prawn':
      return (
        <>
          <Prawn x={78} y={78} s={0.95} rot={-10} />
          <Prawn x={130} y={86} s={0.8} rot={30} />
        </>
      )
    case 'drumstick':
      return (
        <>
          <Drumstick x={70} y={70} rot={20} s={0.85} />
          <Drumstick x={92} y={98} rot={-12} s={0.85} />
        </>
      )
    case 'breast':
      return (
        <g>
          {[
            [62, 84, -18],
            [124, 80, 14],
          ].map(([x, y, r]) => (
            <g key={x} transform={`translate(${x} ${y}) rotate(${r})`}>
              <path d="M-38 0 C-38 -30 10 -36 38 -14 C50 -4 40 26 6 30 C-24 33 -38 20 -38 0 Z" fill="#F2C2AE" />
              <path d="M-20 -8 Q4 -18 26 -10" fill="none" stroke="#fff" strokeWidth="3" opacity=".45" strokeLinecap="round" />
              <path d="M-22 10 Q2 2 28 8" fill="none" stroke="#E3A48E" strokeWidth="2" opacity=".7" strokeLinecap="round" />
            </g>
          ))}
        </g>
      )
    case 'curry': {
      const c = MEAT[tone] ?? MEAT.chicken
      const cube = tone === 'mutton-boneless'
      const pts = [
        [62, 96, 20, -10], [100, 104, 22, 15], [140, 96, 19, 30],
        [78, 70, 19, 40], [122, 70, 20, -25], [100, 50, 16, 10],
      ]
      return pts.map(([x, y, r, rot], i) => <Piece key={i} x={x} y={y} r={r} rot={rot} c={c} cube={cube} bone={!cube && i % 2 === 0} />)
    }
    case 'mince':
      return <Mince tone={tone} />
    case 'chop':
      return (
        <>
          <Chop x={74} y={74} rot={-14} />
          <Chop x={96} y={102} rot={8} s={0.9} />
        </>
      )
    default:
      return null
  }
}

export default function ProductArt({ art, image, alt = '', className = '', eager = false }) {
  const [failed, setFailed] = useState(null)
  if (image && failed !== image)
    return (
      <img
        className={`product-art is-photo ${className}`}
        src={image}
        alt={alt}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        onError={() => setFailed(image)}
      />
    )
  if (!art) return null
  return (
    <svg className={`product-art ${className}`} viewBox="0 0 200 160" role={alt ? 'img' : undefined} aria-label={alt || undefined} aria-hidden={alt ? undefined : true}>
      <ellipse cx="100" cy="134" rx="74" ry="9" fill="#0F2E3A" opacity=".08" />
      <Art kind={art.kind} tone={art.tone} />
    </svg>
  )
}
