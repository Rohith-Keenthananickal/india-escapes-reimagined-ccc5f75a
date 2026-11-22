# Deploy — TripHavenCo UI (heavenconnect.in)

## Server layout

```text
/home/rohith/TripHavenco/
  ui/web/current/     # nginx document root (live build)
  ui/web/releases/    # last 5 release snapshots
  backend/            # later
  communication/      # later
  admin/              # later
```

## One-time nginx cutover

The deploy workflow runs an idempotent cutover step. It needs **passwordless sudo** for `rohith` (or run this once manually):

```bash
sudo cp /etc/nginx/sites-available/heavenconnect.in \
  /etc/nginx/sites-available/heavenconnect.in.bak.pre-triphavenco
sudo sed -i \
  's|root /var/www/html/ui/india-escapes-reimagined-ccc5f75a/dist;|root /home/rohith/TripHavenco/ui/web/current;|' \
  /etc/nginx/sites-available/heavenconnect.in
sudo nginx -t && sudo systemctl reload nginx
```

A prepared config draft may already exist at `/tmp/heavenconnect.in.new` on the server.

Helper script in this repo: `scripts/cutover-nginx.sh`

Old path `/var/www/html/ui/india-escapes-reimagined-ccc5f75a/dist` is left untouched for rollback.

## GitHub Actions secrets

| Secret | Purpose |
|--------|---------|
| `SERVER_HOST` | Deploy host |
| `SERVER_USER` | SSH user (`rohith`) |
| `SERVER_SSH_KEY` | Private key |
| `SERVER_PORT` | SSH port (usually `22`) |
| `VITE_API_BASE_URL` | e.g. `https://api.triphavenco.com` |
| `VITE_GOOGLE_MAPS_API_KEY` | Maps key |
| `VITE_GOOGLE_CLIENT_ID` | Google OAuth web client ID |
| `VITE_CASHFREE_MODE` | `sandbox` or `production` |

## Routine deploys

- Automatic on push to `main`
- Manual via Actions → **Build And Deploy UI** → Run workflow

## Rollback

```bash
# Restore a previous release
rsync -a --delete /home/rohith/TripHavenco/ui/web/releases/<sha>/ \
  /home/rohith/TripHavenco/ui/web/current/

# Or point nginx back to the old dist and reload
sudo sed -i \
  's|root /home/rohith/TripHavenco/ui/web/current;|root /var/www/html/ui/india-escapes-reimagined-ccc5f75a/dist;|' \
  /etc/nginx/sites-available/heavenconnect.in
sudo nginx -t && sudo systemctl reload nginx
```
