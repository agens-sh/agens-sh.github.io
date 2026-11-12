#!/usr/bin/env bash
# Copyright (c) 2026 agens-sh. All Rights Reserved.
set -euo pipefail
cd "$(dirname "$0")/.."
port="${PORT:-8080}"
echo "Serving site at http://127.0.0.1:${port}"
exec python3 -m http.server "$port" --bind 127.0.0.1
