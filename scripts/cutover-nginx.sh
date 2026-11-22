#!/usr/bin/env bash
# One-time nginx cutover: point heavenconnect.in at TripHavenco ui/web/current.
# Run on the server as rohith (requires sudo once).
set -euo pipefail

TARGET="/etc/nginx/sites-available/heavenconnect.in"
BACKUP="/etc/nginx/sites-available/heavenconnect.in.bak.$(date +%Y%m%d%H%M%S)"
NEW_ROOT="/home/rohith/TripHavenco/ui/web/current"

test -f "${NEW_ROOT}/index.html"

sudo cp "${TARGET}" "${BACKUP}"
sudo sed -i.bak-sed \
  's|root /var/www/html/ui/india-escapes-reimagined-ccc5f75a/dist;|root /home/rohith/TripHavenco/ui/web/current;|' \
  "${TARGET}"
sudo rm -f "${TARGET}.bak-sed"
sudo nginx -t
sudo systemctl reload nginx

echo "Cutover complete. Backup: ${BACKUP}"
curl -fsSI https://heavenconnect.in/ | head -n 15
curl -fsS https://heavenconnect.in/ | grep -qi "TriphavenCo"
echo "Smoke check passed."
