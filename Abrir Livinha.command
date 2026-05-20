#!/bin/zsh
cd "$(dirname "$0")"

PORT=4173
URL="http://127.0.0.1:${PORT}/"
NODE="/Users/matheusmelgaco/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/bin/node"

if lsof -nP -iTCP:${PORT} -sTCP:LISTEN >/dev/null 2>&1; then
  open "$URL"
  exit 0
fi

if [ ! -x "$NODE" ]; then
  NODE="$(command -v node)"
fi

if [ -z "$NODE" ]; then
  open "index.html"
  exit 0
fi

"$NODE" server-local.mjs
