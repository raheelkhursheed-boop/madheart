#!/usr/bin/env bash
# Usage: scripts/verify.sh <domain> [text that must appear]
# Fetches the live site and confirms it is the right site and, optionally, contains the new change.
set -euo pipefail
domain="$1"; want="${2:-}"
check=$(python3 -c "import json,sys;print(next(s['check_text'] for s in json.load(open('sites.json'))['sites'] if s['domain']==sys.argv[1]))" "$domain")
html=$(curl -fsSL "https://$domain/?v=$(date +%s)")
grep -qF "$check" <<<"$html" || { echo "FAIL: $domain is not serving its own site (missing: $check)"; exit 1; }
if [ -n "$want" ]; then grep -qF "$want" <<<"$html" || { echo "FAIL: $domain is live but missing: $want"; exit 1; }; fi
echo "OK: $domain"
