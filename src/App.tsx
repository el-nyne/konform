import { FormEvent, useEffect, useMemo, useState } from 'react'

type Period = 'monthly' | 'yearly'
type Mode = 'login' | 'register'
type DashboardPage = 'dashboard' | 'salaries' | 'documents' | 'audit' | 'reporting'

type User = { id: string; email: string; name: string }
type DashboardData = { kpis: { label: string; value: string; sub: string }[]; alerts: { title: string; status: string }[] }

const API_URL = import.meta.env.VITE_API_URL ?? '/api'

const pricing = [
  { name: 'Starter', desc: "Pour structurer rapidement la conformite d'une petite equipe industrielle.", monthly: '99€', yearly: '79€', cta: 'Choisir Starter', primary: false },
  { name: 'Pro', desc: 'Le meilleur equilibre pour une PME qui prepare serieusement ses audits.', monthly: '199€', yearly: '159€', cta: 'Choisir Pro', primary: true },
  { name: 'Business', desc: 'Pour les structures multi-sites qui veulent industrialiser leur conformite.', monthly: '399€', yearly: '319€', cta: 'Choisir Business', primary: false },
]

const faqs = [
  { q: 'Quelles certifications sont couvertes ?', a: 'MASE et differents cadres ISO avec suivi operationnel.' },
  { q: 'Faut-il etre expert QSE ?', a: "Non. L'interface est concue pour rester simple et actionnable." },
  { q: 'Comment les donnees sont securisees ?', a: 'Acces JWT, mots de passe hashes bcrypt, et segregation par utilisateur.' },
]

const sidebarItems: { id: DashboardPage; label: string }[] = [
  { id: 'dashboard', label: 'Tableau de bord' },
  { id: 'salaries', label: 'Salariés & habilitations' },
  { id: 'documents', label: 'Documents' },
  { id: 'audit', label: 'Préparation audit' },
  { id: 'reporting', label: 'Reporting' },
]

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [period, setPeriod] = useState<Period>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [mode, setMode] = useState<Mode>('login')
  const [activePage, setActivePage] = useState<DashboardPage>('dashboard')

  const [token, setToken] = useState<string | null>(() => localStorage.getItem('konform_token'))
  const [user, setUser] = useState<User | null>(null)
  const [dashboard, setDashboard] = useState<DashboardData | null>(null)

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('.fade-in'))
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible')
          observer.unobserve(entry.target)
        }
      })
    }, { threshold: 0.14, rootMargin: '0px 0px -48px 0px' })
    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [token])

  useEffect(() => {
    if (!token) {
      setUser(null)
      setDashboard(null)
      return
    }

    const load = async () => {
      try {
        const [meRes, dataRes] = await Promise.all([
          fetch(`${API_URL}/me`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${API_URL}/dashboard`, { headers: { Authorization: `Bearer ${token}` } }),
        ])

        if (!meRes.ok || !dataRes.ok) throw new Error('Session invalide')
        const meJson = (await meRes.json()) as { user: User }
        const dashboardJson = (await dataRes.json()) as DashboardData

        setUser(meJson.user)
        setDashboard(dashboardJson)
      } catch {
        localStorage.removeItem('konform_token')
        setToken(null)
        setMsg('Session expirée, reconnectez-vous.')
      }
    }

    load()
  }, [token])

  const periodLabel = useMemo(() => (period === 'yearly' ? '/mois, facture annuellement' : '/mois'), [period])

  const submitAuth = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setLoading(true)
    setMsg('')

    try {
      const endpoint = mode === 'login' ? 'login' : 'register'
      const payload = mode === 'login' ? { email, password } : { name, email, password }
      const res = await fetch(`${API_URL}/auth/${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error ?? 'Erreur')

      localStorage.setItem('konform_token', json.token)
      setToken(json.token)
      setPassword('')
    } catch (err) {
      setMsg(err instanceof Error ? err.message : 'Erreur inconnue')
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    localStorage.removeItem('konform_token')
    setToken(null)
    setUser(null)
    setDashboard(null)
  }

  if (user && dashboard) {
    return (
      <div className="app-shell">
        <aside className="dash-sidebar glass">
          <a className="logo" href="#"><span className="logo-mark">K</span><span>onform</span></a>
          <div className="profile-box">
            <strong>{user.name}</strong>
            <span>{user.email}</span>
          </div>
          <nav className="side-nav-list">
            {sidebarItems.map((item) => (
              <button key={item.id} className={`side-nav-btn ${activePage === item.id ? 'active' : ''}`} onClick={() => setActivePage(item.id)}>
                {item.label}
              </button>
            ))}
          </nav>
          <button className="btn btn-secondary" onClick={logout}>Déconnexion</button>
        </aside>

        <main className="dash-main">
          <header className="dash-header glass">
            <div>
              <h3>{sidebarItems.find((item) => item.id === activePage)?.label}</h3>
              <p>Vue personnelle de conformité</p>
            </div>
          </header>

          {activePage === 'dashboard' && (
            <section className="dash-content">
              <div className="kpi-grid">
                {dashboard.kpis.map((kpi) => (
                  <article key={kpi.label} className="kpi-card glass">
                    <span>{kpi.label}</span>
                    <strong>{kpi.value}</strong>
                    <p>{kpi.sub}</p>
                  </article>
                ))}
              </div>

              <article className="table-card glass">
                <div className="table-headline">
                  <h4>Alertes prioritaires</h4>
                </div>
                <table>
                  <thead>
                    <tr><th>Action</th><th>Statut</th></tr>
                  </thead>
                  <tbody>
                    {dashboard.alerts.map((alert) => (
                      <tr key={alert.title}>
                        <td>{alert.title}</td>
                        <td><span className="status urgent">{alert.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </article>
            </section>
          )}

          {activePage !== 'dashboard' && (
            <section className="dash-content">
              <article className="glass table-card">
                <h4>{sidebarItems.find((item) => item.id === activePage)?.label}</h4>
                <p style={{ marginTop: 8 }}>Section conservée dans la structure: navigation latérale, header, et espace contenu prêt à brancher les données détaillées.</p>
              </article>
            </section>
          )}
        </main>
      </div>
    )
  }

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`}>
        <div className="container nav">
          <a className="logo" href="#top"><span className="logo-mark">K</span><span>onform</span></a>
          <nav className="nav-links"><a className="nav-link" href="#produit">Produit</a><a className="nav-link" href="#tarifs">Tarifs</a><a className="nav-link" href="#faq">FAQ</a></nav>
          <div className="nav-actions"><a className="btn btn-primary" href="#auth">Connexion</a></div>
        </div>
      </header>

      <main id="top">
        <section className="section hero" id="produit">
          <div className="container hero-grid">
            <div className="hero-copy fade-in">
              <div className="hero-badge"><span className="pulse-dot" />Certifications MASE & ISO - Nouvelle approche</div>
              <h1>La conformite, enfin sous controle.</h1>
              <p className="hero-subtitle">Inscrivez-vous puis connectez-vous directement ici.</p>
            </div>
            <div id="auth" className="mini-dashboard glass hover-glow fade-in fade-delay-2 auth-card">
              <div className="mini-top"><h3>{mode === 'login' ? 'Connexion' : 'Inscription'}</h3></div>
              <form onSubmit={submitAuth} className="auth-form">
                {mode === 'register' && <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Nom" required />}
                <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required />
                <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Mot de passe" minLength={6} required />
                {msg && <p className="auth-msg">{msg}</p>}
                <button disabled={loading} className="btn btn-primary" type="submit">{loading ? 'Chargement...' : mode === 'login' ? 'Se connecter' : 'Créer mon compte'}</button>
              </form>
              <button className="auth-switch" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>{mode === 'login' ? "Pas encore de compte ? S'inscrire" : 'Déjà un compte ? Se connecter'}</button>
            </div>
          </div>
        </section>

        <section className="section" id="tarifs">
          <div className="container">
            <div className="pricing-head fade-in">
              <div><div className="section-label">Tarifs</div><h2>Transparent. Sans surprise.</h2></div>
              <div className="pricing-toggle glass">
                <button className={`toggle-option ${period === 'monthly' ? 'active' : ''}`} type="button" onClick={() => setPeriod('monthly')}>Mensuel</button>
                <button className={`toggle-option ${period === 'yearly' ? 'active' : ''}`} type="button" onClick={() => setPeriod('yearly')}>Annuel -20%</button>
              </div>
            </div>
            <div className="pricing-grid">
              {pricing.map((p) => (
                <article className={`price-card glass hover-glow ${p.primary ? 'featured' : ''}`} key={p.name}>
                  {p.primary && <div className="price-badge">Le plus populaire</div>}
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>
                  <div className="price-amount"><strong>{period === 'yearly' ? p.yearly : p.monthly}</strong><span>{periodLabel}</span></div>
                  <a className={`btn ${p.primary ? 'btn-primary' : 'btn-secondary'}`} href="#auth">{p.cta}</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="container faq-wrap">
            <div className="section-label">FAQ</div><h2>Questions frequentes</h2>
            <div className="faq-list" style={{ marginTop: 20 }}>
              {faqs.map((item, idx) => {
                const isOpen = openFaq === idx
                return (
                  <article className={`faq-item glass ${isOpen ? 'open' : ''}`} key={item.q}>
                    <button className="faq-question" type="button" onClick={() => setOpenFaq(isOpen ? null : idx)}>
                      <span>{item.q}</span><span className="faq-icon" />
                    </button>
                    <div className="faq-answer" style={{ maxHeight: isOpen ? 180 : 0 }}><div className="faq-answer-inner"><p>{item.a}</p></div></div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
