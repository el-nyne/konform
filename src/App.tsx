import { useEffect, useMemo, useState } from 'react'

type Period = 'monthly' | 'yearly'

type Faq = {
  q: string
  a: string
}

const pricing = [
  {
    name: 'Starter',
    desc: "Pour structurer rapidement la conformite d'une petite equipe industrielle.",
    monthly: '99€',
    yearly: '79€',
    cta: 'Choisir Starter',
    primary: false,
    features: ['Jusqu\'a 10 salaries', 'Suivi des echeances cles', 'Tableau de bord centralise', 'Support email'],
  },
  {
    name: 'Pro',
    desc: 'Le meilleur equilibre pour une PME qui prepare serieusement ses audits.',
    monthly: '199€',
    yearly: '159€',
    cta: 'Choisir Pro',
    primary: true,
    features: ['Jusqu\'a 30 salaries', 'Relances automatiques', 'Documents assistes par IA', "Preparation d'audit guidee"],
  },
  {
    name: 'Business',
    desc: 'Pour les structures multi-sites qui veulent industrialiser leur conformite.',
    monthly: '399€',
    yearly: '319€',
    cta: 'Choisir Business',
    primary: false,
    features: ['Jusqu\'a 100 salaries', 'Gestion multi-sites', 'Exports audit avances', 'Accompagnement prioritaire'],
  },
]

const faqs: Faq[] = [
  {
    q: 'Quelles certifications sont couvertes ?',
    a: 'Konform est pense pour piloter les exigences MASE et differents cadres ISO avec un suivi operationnel des preuves, habilitations et echeances.',
  },
  {
    q: 'Faut-il etre expert QSE pour utiliser Konform ?',
    a: "Non. L'interface est concue pour rester lisible cote terrain, RH ou direction, avec des reperes simples et des actions guidees.",
  },
  {
    q: 'Comment les donnees sont-elles securisees ?',
    a: "Les acces sont organises par roles, les actions sont tracables et l'hebergement est prevu en France.",
  },
  {
    q: "Que se passe-t-il a la fin de l'essai gratuit ?",
    a: 'Vous choisissez librement de continuer sur un plan payant ou d\'arreter.',
  },
]

export default function App() {
  const [scrolled, setScrolled] = useState(false)
  const [period, setPeriod] = useState<Period>('monthly')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const items = Array.from(document.querySelectorAll<HTMLElement>('.fade-in'))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible')
            observer.unobserve(entry.target)
          }
        })
      },
      { threshold: 0.14, rootMargin: '0px 0px -48px 0px' },
    )

    items.forEach((item) => observer.observe(item))
    return () => observer.disconnect()
  }, [])

  const periodLabel = useMemo(() => (period === 'yearly' ? '/mois, facture annuellement' : '/mois'), [period])

  return (
    <>
      <header className={`site-header ${scrolled ? 'scrolled' : ''}`} id="site-header">
        <div className="container nav">
          <a className="logo" href="#top" aria-label="Konform accueil">
            <span className="logo-mark">K</span>
            <span>onform</span>
          </a>
          <nav className="nav-links" aria-label="Navigation principale">
            <a className="nav-link" href="#produit">Produit</a>
            <a className="nav-link" href="#fonctionnalites">Fonctionnalites</a>
            <a className="nav-link" href="#tarifs">Tarifs</a>
            <a className="nav-link" href="#faq">FAQ</a>
          </nav>
          <div className="nav-actions">
            <a className="btn btn-secondary" href="#faq">Se connecter</a>
            <a className="btn btn-primary" href="#cta-final">Essai gratuit</a>
          </div>
        </div>
      </header>

      <main id="top">
        <section className="section hero" id="produit">
          <div className="container hero-grid">
            <div className="hero-copy fade-in">
              <div className="hero-badge"><span className="pulse-dot" />Certifications MASE & ISO - Nouvelle approche</div>
              <h1>La conformite, enfin sous controle.</h1>
              <p className="hero-subtitle">Konform centralise vos certifications MASE et ISO. Habilitations, documents, audits - tout est automatise.</p>
              <div className="hero-actions">
                <a className="btn btn-primary" href="#cta-final">Demarrer gratuitement -&gt;</a>
                <a className="btn btn-secondary" href="#dashboard">Voir la demo</a>
                <span className="eyebrow-note">Aucune carte bancaire requise</span>
              </div>
              <div className="stat-bar glass">
                <div className="stat-chip"><strong>3h</strong><span>/ semaine economisees</span></div>
                <div className="stat-chip"><strong>0</strong><span>certification perdue</span></div>
                <div className="stat-chip"><strong>14 jours</strong><span>d'essai offerts</span></div>
              </div>
            </div>

            <div className="hero-side fade-in fade-delay-2">
              <div className="mini-dashboard glass hover-glow">
                <div className="mini-top">
                  <div><div className="mini-tag">Dashboard</div><h3>Vision temps reel de votre conformite</h3></div>
                  <span className="badge">Audit pret</span>
                </div>
                <div className="mini-summary">
                  <div className="mini-box"><span>Score site</span><strong>94%</strong></div>
                  <div className="mini-box"><span>Echeances a traiter</span><strong>3</strong></div>
                  <div className="mini-box"><span>Docs conformes</span><strong>47/50</strong></div>
                </div>
                <div className="mini-list">
                  <div className="mini-row"><div><strong>Nadia M.</strong><br /><span>Travaux en hauteur</span></div><div>Validite 28/09/2026</div><span className="status ok">A jour</span></div>
                  <div className="mini-row"><div><strong>Lucas P.</strong><br /><span>CACES R489</span></div><div>Validite 19/05/2026</div><span className="status warn">Bientot</span></div>
                  <div className="mini-row"><div><strong>Thomas G.</strong><br /><span>Habilitation BT</span></div><div>Validite 08/04/2026</div><span className="status urgent">Urgent</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="section" id="fonctionnalites">
          <div className="container">
            <div className="fade-in" style={{ maxWidth: 760, marginBottom: 30 }}>
              <div className="section-label">La solution</div>
              <h2>Tout ce dont vous avez besoin. Rien de superflu.</h2>
              <p>Konform se concentre sur les gestes vraiment utiles pour piloter MASE et ISO dans une PME industrielle.</p>
            </div>
            <div className="feature-grid">
              {[
                ['01', '📊', 'Tableau de bord temps reel', 'Une lecture immediate des risques, des echeances et du niveau de preparation audit.'],
                ['02', '👷', 'Gestion salaries et habilitations', 'Suivi des formations, CACES, habilitations, visites et renouvellements.'],
                ['03', '🤖', 'Generateur de documents par IA', 'Creez plus vite vos trames, procedures et documents de preuve.'],
                ['04', '🧭', "Preparation d'audit guidee", 'Des etapes concretes et un plan d\'action visible.'],
              ].map(([num, emoji, title, desc], i) => (
                <article className={`feature-card glass hover-glow fade-in fade-delay-${(i % 4) + 1}`} key={title}>
                  <div className="feature-top"><span className="feature-number">{num}</span><div className="feature-emoji">{emoji}</div></div>
                  <h3>{title}</h3>
                  <p>{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="tarifs">
          <div className="container">
            <div className="pricing-head fade-in">
              <div><div className="section-label">Tarifs</div><h2>Transparent. Sans surprise.</h2></div>
              <div className="pricing-toggle glass" role="tablist" aria-label="Choix de periode de facturation">
                <button className={`toggle-option ${period === 'monthly' ? 'active' : ''}`} type="button" onClick={() => setPeriod('monthly')}>Mensuel</button>
                <button className={`toggle-option ${period === 'yearly' ? 'active' : ''}`} type="button" onClick={() => setPeriod('yearly')}>Annuel -20%</button>
              </div>
            </div>
            <div className="pricing-grid">
              {pricing.map((p, idx) => (
                <article className={`price-card glass hover-glow fade-in fade-delay-${idx + 1} ${p.primary ? 'featured' : ''}`} key={p.name}>
                  {p.primary && <div className="price-badge">Le plus populaire</div>}
                  <h3>{p.name}</h3>
                  <p>{p.desc}</p>
                  <div className="price-amount"><strong>{period === 'yearly' ? p.yearly : p.monthly}</strong><span>{periodLabel}</span></div>
                  <ul>{p.features.map((f) => <li key={f}>{f}</li>)}</ul>
                  <a className={`btn ${p.primary ? 'btn-primary' : 'btn-secondary'}`} href="#cta-final">{p.cta}</a>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="section" id="faq">
          <div className="container faq-wrap">
            <div className="fade-in" style={{ marginBottom: 24 }}><div className="section-label">FAQ</div><h2>Questions frequentes</h2></div>
            <div className="faq-list">
              {faqs.map((item, idx) => {
                const isOpen = openFaq === idx
                return (
                  <article key={item.q} className={`faq-item glass fade-in fade-delay-${(idx % 4) + 1} ${isOpen ? 'open' : ''}`}>
                    <button className="faq-question" type="button" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? null : idx)}>
                      <span>{item.q}</span><span className="faq-icon" aria-hidden="true" />
                    </button>
                    <div className="faq-answer" style={{ maxHeight: isOpen ? 240 : 0 }}>
                      <div className="faq-answer-inner"><p>{item.a}</p></div>
                    </div>
                  </article>
                )
              })}
            </div>
          </div>
        </section>

        <section className="section final-cta" id="cta-final">
          <div className="container">
            <div className="cta-panel glass fade-in">
              <div className="section-label" style={{ justifyContent: 'center' }}>Derniere etape</div>
              <h2>Pret a securiser vos certifications ?</h2>
              <p>Structurez vos echeances, centralisez vos preuves et transformez vos audits en routine maitrisee.</p>
              <a className="btn btn-primary" href="#top">Demarrer l'essai gratuit</a>
            </div>
          </div>
        </section>
      </main>
    </>
  )
}
