# Konform (landing + auth + dashboard)

Cette stack inclut :

- Frontend React (landing + connexion/inscription)
- API Node/Express (JWT + bcrypt)
- Données utilisateur isolées (chaque utilisateur voit **ses** KPI)

## Pourquoi la connexion ne marchait pas

Si tu ouvres `http://IP:8082`, le frontend devait appeler `/api/...` sur le **même port**.

Avant, le Nginx du conteneur frontend ne proxyfiais pas `/api` vers l'API, donc les appels login/register échouaient.

✅ Correction faite :

- `nginx/default.conf` proxy maintenant `/api/` vers `konform_api:8083`
- `docker-compose` met `frontend` et `api` sur le même réseau Docker
- le frontend est exposé en `8082:80` (accessible depuis ton IP)

## Lancer / relancer

```bash
docker compose down
docker compose up -d --build
```

Puis teste :

- Front: `http://TON_IP:8082`
- Health API via frontend proxy: `http://TON_IP:8082/api/health`

## Ports

- `8082` public: frontend + proxy `/api`
- `8083` non publié publiquement (interne Docker via `expose`)

## Sécurité minimale implémentée

- Hash des mots de passe avec `bcryptjs`
- Auth stateless avec JWT (`Authorization: Bearer <token>`)
- Middleware d'auth sur endpoints privés

⚠️ Pour production :

- change `JWT_SECRET`
- active HTTPS (Let's Encrypt)
- ajoute rate limit / logs / sauvegarde du fichier `backend/data/users.json`
