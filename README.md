# Konform (frontend)

Ce dépôt peut cohabiter avec ton autre SaaS sur **le même VPS** sans conflit, à condition d'isoler :

- les ports internes Docker,
- les noms de services,
- les volumes,
- et le routage Nginx (par sous-domaine recommandé).

## 1) Architecture recommandée (cohabitation propre)

Utilise des sous-domaines séparés :

- `app1.tondomaine.com` → ton SaaS existant
- `konform.tondomaine.com` → ce frontend Konform

Chaque app tourne dans ses conteneurs, et un reverse-proxy Nginx (host ou container dédié) distribue le trafic selon le `server_name`.

## 2) Démarrage local en Docker (Konform)

### Build + run

```bash
docker compose up -d --build
```

Le conteneur expose le site sur le port `8082` de l'hôte.

## 3) Nginx sur le VPS : 2 apps séparées

Si Nginx tourne sur l'hôte, ajoute un vhost pour Konform (fichier exemple fourni : `nginx/konform.conf`).

- ton SaaS existant garde son bloc `server` actuel
- Konform a son propre bloc `server` avec `proxy_pass http://127.0.0.1:8082;`

Ensuite :

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 4) SSL (Let's Encrypt)

Exemple :

```bash
sudo certbot --nginx -d konform.tondomaine.com
```

## 5) Déploiement standard sur VPS

```bash
git pull
docker compose up -d --build
```

## 6) Points critiques pour cohabiter sans casse

1. **Ports uniques**: ne jamais réutiliser un port déjà pris par l'autre SaaS.
2. **Noms de conteneurs uniques**: éviter les collisions globales Docker.
3. **Réseaux/volumes distincts**: préfixes dédiés (`konform_*`).
4. **Sous-domaines séparés**: simplifie SSL, logs, et maintenance.
5. **Healthcheck**: détecte vite une régression au déploiement.

## 7) Option alternative (sans Nginx host)

Tu peux aussi avoir un **reverse-proxy Docker unique** (Traefik/Nginx Proxy Manager) qui route vers tes deux stacks Docker.
Le principe reste identique: deux services isolés, deux hostnames différents.
