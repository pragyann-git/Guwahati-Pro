import credits from '../photoCredits.json'

// Lists every photo used on the site with its author and licence.
// Creative Commons BY / BY-SA photos must stay credited while they are used.
export default function Credits() {
  const rows = Object.entries(credits)
  return (
    <main id="main" className="container credits">
      <nav className="crumbs" aria-label="Breadcrumb">
        <a href="/">Home</a> <span aria-hidden="true">/</span> <span aria-current="page">Photo credits</span>
      </nav>
      <h1>Photo credits</h1>
      <p>
        These sample photos come from Wikimedia Commons and are used under the licences shown. Replace them with your own
        photos (or AI-generated ones) in <code>public/products/</code> and <code>public/images/</code>, then remove the entry here.
      </p>
      <ul className="credit-list">
        {rows.map(([file, c]) => (
          <li key={file}>
            <img src={file} alt="" loading="lazy" />
            <span>
              <b>{c.title}</b>
              {c.author}, <a href={c.licenseUrl || c.page} target="_blank" rel="noreferrer">{c.license}</a>
              {' · '}
              <a href={c.page} target="_blank" rel="noreferrer">source</a>
            </span>
          </li>
        ))}
      </ul>
    </main>
  )
}
