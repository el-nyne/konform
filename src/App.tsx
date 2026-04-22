import { useMemo, useState } from 'react'
import { BellRing, FileText, Gauge, Moon, ShieldCheck, Sun, TriangleAlert, Users } from 'lucide-react'

type PageId = 'dashboard' | 'salaries' | 'documents' | 'audit' | 'accidents' | 'reporting'

const pages: { id: PageId; label: string; icon: JSX.Element }[] = [
  { id: 'dashboard', label: 'Tableau de bord', icon: <Gauge size={16} /> },
  { id: 'salaries', label: 'Salariés & Habilitations', icon: <Users size={16} /> },
  { id: 'documents', label: 'Documents', icon: <FileText size={16} /> },
  { id: 'audit', label: 'Préparation Audit', icon: <ShieldCheck size={16} /> },
  { id: 'accidents', label: "Accidents & Presqu'acc.", icon: <TriangleAlert size={16} /> },
  { id: 'reporting', label: 'Reporting', icon: <BellRing size={16} /> },
]

const salaries = [
  { name: 'Thomas Guerrin', role: 'Cariste', compliance: 62, status: 'Expiré' },
  { name: 'Malik Diouf', role: 'Électricien', compliance: 75, status: 'Alerte' },
  { name: 'Camille Roux', role: 'Technicienne qualité', compliance: 98, status: 'À jour' },
]

export default function App() {
  const [page, setPage] = useState<PageId>('dashboard')
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [accent, setAccent] = useState('#00e5a0')

  document.documentElement.dataset.theme = theme
  document.documentElement.style.setProperty('--accent', accent)

  const title = useMemo(() => pages.find((p) => p.id === page)?.label ?? 'Konform', [page])

  return (
    <div className="min-h-screen">
      <div className="grid min-h-screen grid-cols-[260px_1fr]">
        <aside className="glass border-r-white/15 p-4">
          <div className="mb-6 flex items-center gap-3 border-b border-white/10 pb-4">
            <div className="grid h-9 w-9 place-content-center rounded-xl bg-[var(--accent)] text-black">
              <ShieldCheck size={16} />
            </div>
            <div>
              <div className="font-display text-lg font-black">Konform</div>
              <span className="rounded-full border border-emerald-300/20 bg-emerald-300/10 px-2 py-0.5 text-[10px] text-emerald-300">MASE</span>
            </div>
          </div>
          <nav className="space-y-2">
            {pages.map((item) => (
              <button
                key={item.id}
                onClick={() => setPage(item.id)}
                className={`flex w-full items-center gap-3 rounded-xl border px-3 py-2 text-left text-sm font-semibold transition ${
                  page === item.id
                    ? 'border-emerald-400/30 bg-emerald-400/10 text-emerald-300'
                    : 'border-transparent text-white/80 hover:border-white/10 hover:bg-white/5'
                }`}
              >
                {item.icon}
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main>
          <header className="glass flex h-16 items-center justify-between border-x-0 border-t-0 px-6">
            <div>
              <h1 className="font-display text-lg font-black">{title}</h1>
              <p className="text-xs text-white/60">Interface moderne React + Tailwind + TypeScript</p>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 p-1">
              <button className={`rounded-full p-2 ${theme === 'dark' ? 'bg-[var(--accent)] text-black' : 'text-white/70'}`} onClick={() => setTheme('dark')}><Moon size={14} /></button>
              <button className={`rounded-full p-2 ${theme === 'light' ? 'bg-[var(--accent)] text-black' : 'text-white/70'}`} onClick={() => setTheme('light')}><Sun size={14} /></button>
              <input type="color" value={accent} onChange={(e) => setAccent(e.target.value)} className="h-7 w-7 cursor-pointer rounded-full border border-white/20 bg-transparent p-0" />
            </div>
          </header>

          <section className="p-6">
            {page === 'dashboard' && <Dashboard />}
            {page === 'salaries' && <Salaries />}
            {page !== 'dashboard' && page !== 'salaries' && <Placeholder page={title} />}
          </section>
        </main>
      </div>
    </div>
  )
}

function Dashboard() {
  const cards = [
    { label: 'Conformité globale', value: '94%', sub: 'MASE 91% · ISO 97%' },
    { label: 'Alertes actives', value: '3', sub: '2 urgentes · 1 bientôt' },
    { label: 'Documents à jour', value: '47/50', sub: '94% de conformité documentaire' },
    { label: 'Prochain audit MASE', value: 'J-42', sub: '14 mai 2026 · APAVE' },
  ]

  return (
    <div className="space-y-5">
      <div>
        <p className="mb-1 text-xs uppercase tracking-[0.2em] text-[var(--accent)]">Bonjour</p>
        <h2 className="font-display text-3xl font-black">Bonjour, Sarah 👋</h2>
      </div>
      <div className="grid gap-4 xl:grid-cols-4">
        {cards.map((card) => (
          <article key={card.label} className="glass rounded-3xl p-5">
            <p className="text-xs uppercase tracking-[0.12em] text-white/50">{card.label}</p>
            <p className="mt-2 font-display text-4xl font-black">{card.value}</p>
            <p className="mt-2 text-sm text-white/60">{card.sub}</p>
          </article>
        ))}
      </div>
    </div>
  )
}

function Salaries() {
  return (
    <div className="glass overflow-hidden rounded-3xl">
      <table className="w-full text-sm">
        <thead className="bg-white/5 text-left text-xs uppercase tracking-[0.12em] text-white/60">
          <tr>
            <th className="px-4 py-3">Salarié</th>
            <th className="px-4 py-3">Poste</th>
            <th className="px-4 py-3">Conformité</th>
            <th className="px-4 py-3">Statut</th>
          </tr>
        </thead>
        <tbody>
          {salaries.map((row) => (
            <tr key={row.name} className="border-t border-white/10">
              <td className="px-4 py-3 font-semibold">{row.name}</td>
              <td className="px-4 py-3 text-white/70">{row.role}</td>
              <td className="px-4 py-3">{row.compliance}%</td>
              <td className="px-4 py-3">
                <span className="rounded-full border border-white/10 bg-white/5 px-2 py-1 text-xs">{row.status}</span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Placeholder({ page }: { page: string }) {
  return (
    <div className="glass rounded-3xl p-10 text-center">
      <h3 className="font-display text-2xl font-black">{page}</h3>
      <p className="mt-3 text-white/65">Cette section est prête pour brancher les données métier, graphiques et actions avancées.</p>
    </div>
  )
}
