# Konform (landing + auth + dashboard)

Cette stack inclut maintenant :

- Frontend React (landing + connexion/inscription)
- API Node/Express (JWT + bcrypt)
- Données utilisateur isolées (chaque utilisateur voit **ses** KPI)

## Ports choisis (compatibles avec ton VPS)

Tu as déjà des services sur `3000`, `5432`, `8080`.

Cette stack utilise volontairement :

- `127.0.0.1:8082` → frontend Konform
- `127.0.0.1:8083` → API Konform

Aucun conflit avec tes ports existants.

## Lancer

```bash
docker compose up -d --build
```

## Nginx host

Utilise `nginx/konform.conf` :

- `/` vers `127.0.0.1:8082`
- `/api/` vers `127.0.0.1:8083`

Puis :

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Flux utilisateur

1. L'utilisateur arrive sur la landing page.
2. Il s'inscrit ou se connecte depuis la landing.
3. Le frontend stocke le JWT et appelle `/api/me` + `/api/dashboard`.
4. L'utilisateur est redirigé vers son dashboard avec ses propres données.

## Sécurité minimale implémentée

- Hash des mots de passe avec `bcryptjs`
- Auth stateless avec JWT (`Authorization: Bearer <token>`)
- Middleware d'auth sur endpoints privés

⚠️ Pour production :

- change `JWT_SECRET`
- active HTTPS (Let's Encrypt)
- ajoute rate limit / logs / sauvegarde du fichier `backend/data/users.json`
