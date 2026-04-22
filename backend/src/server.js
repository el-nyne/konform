import express from 'express'
import cors from 'cors'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import fs from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { v4 as uuidv4 } from 'uuid'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
const DB_FILE = path.join(__dirname, '../data/users.json')

const JWT_SECRET = process.env.JWT_SECRET || 'change-this-secret-in-production'
const PORT = Number(process.env.PORT || 8083)
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || '*'

const app = express()
app.use(cors({ origin: CLIENT_ORIGIN === '*' ? true : CLIENT_ORIGIN }))
app.use(express.json())

function readDb() {
  if (!fs.existsSync(DB_FILE)) {
    fs.mkdirSync(path.dirname(DB_FILE), { recursive: true })
    fs.writeFileSync(DB_FILE, JSON.stringify({ users: [] }, null, 2))
  }
  const raw = fs.readFileSync(DB_FILE, 'utf-8')
  return JSON.parse(raw)
}

function writeDb(data) {
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2))
}

function toPublicUser(user) {
  return { id: user.id, email: user.email, name: user.name }
}

function auth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) return res.status(401).json({ error: 'Token manquant' })

  const token = header.replace('Bearer ', '')
  try {
    const payload = jwt.verify(token, JWT_SECRET)
    req.userId = payload.sub
    next()
  } catch {
    return res.status(401).json({ error: 'Token invalide' })
  }
}

app.get('/api/health', (_req, res) => res.json({ ok: true }))

app.post('/api/auth/register', async (req, res) => {
  const { name, email, password } = req.body || {}
  if (!name || !email || !password || password.length < 6) {
    return res.status(400).json({ error: 'Nom, email et mot de passe (6+) requis' })
  }

  const db = readDb()
  const existing = db.users.find((u) => u.email.toLowerCase() === String(email).toLowerCase())
  if (existing) return res.status(409).json({ error: 'Email déjà utilisé' })

  const hash = await bcrypt.hash(password, 10)
  const user = { id: uuidv4(), name, email: String(email).toLowerCase(), passwordHash: hash }
  db.users.push(user)
  writeDb(db)

  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' })
  return res.status(201).json({ token, user: toPublicUser(user) })
})

app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body || {}
  const db = readDb()
  const user = db.users.find((u) => u.email === String(email).toLowerCase())
  if (!user) return res.status(401).json({ error: 'Identifiants invalides' })

  const ok = await bcrypt.compare(password ?? '', user.passwordHash)
  if (!ok) return res.status(401).json({ error: 'Identifiants invalides' })

  const token = jwt.sign({ sub: user.id }, JWT_SECRET, { expiresIn: '7d' })
  return res.json({ token, user: toPublicUser(user) })
})

app.get('/api/me', auth, (req, res) => {
  const db = readDb()
  const user = db.users.find((u) => u.id === req.userId)
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })

  return res.json({ user: toPublicUser(user) })
})

app.get('/api/dashboard', auth, (req, res) => {
  const db = readDb()
  const user = db.users.find((u) => u.id === req.userId)
  if (!user) return res.status(404).json({ error: 'Utilisateur introuvable' })

  const seed = user.id.charCodeAt(0)
  return res.json({
    kpis: [
      { label: 'Conformité globale', value: `${88 + (seed % 10)}%`, sub: 'Calculée sur vos éléments' },
      { label: 'Alertes actives', value: String((seed % 4) + 1), sub: 'Issues de votre périmètre' },
      { label: 'Documents à jour', value: `${40 + (seed % 10)}/50`, sub: 'Bibliothèque personnelle' },
    ],
    alerts: [
      { title: 'Habilitation CACES à renouveler', status: 'Urgent' },
      { title: 'Revue MASE à planifier', status: 'Bientôt' },
    ],
  })
})

app.listen(PORT, () => {
  console.log(`Konform API running on :${PORT}`)
})
