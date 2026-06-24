#!/usr/bin/env bash
# Deploy this web dashboard.
#
# The Docker stack (docker-compose with db/api/web/cloudflared) lives in the
# sibling Heliolytics backend repo, so this delegates to its web-only deploy
# script — rebuilding and restarting just the `web` container while db/api stay
# up (no API or strap-sync downtime).
#
#   ./deploy.sh          # build from the current checkout
#   PULL=1 ./deploy.sh   # git pull this repo first, then rebuild
set -euo pipefail
cd "$(dirname "$0")"

BACKEND_DEPLOY="../Heliolytics/deploy/deploy-web.sh"
if [[ ! -x "$BACKEND_DEPLOY" ]]; then
  echo "Cannot find the backend deploy script at: $BACKEND_DEPLOY" >&2
  echo "The Docker stack lives in the sibling Heliolytics repo — clone it next to this one." >&2
  exit 1
fi

# Pull this (web) source if requested, then hand off (build uses this checkout).
if [[ "${PULL:-0}" == "1" && -d .git ]]; then
  echo "→ Pulling latest web source…"
  git pull --ff-only
fi

exec "$BACKEND_DEPLOY"
