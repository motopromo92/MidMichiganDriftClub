#!/usr/bin/env bash
# Render the MMDC collateral to PDF.
#
#   ./docs/build-pdfs.sh [output-dir]      (default: docs/pdf)
#
# Headless Chrome is used rather than a print dialog so the output is
# repeatable: same margins, same pagination, same embedded fonts every time.
# The brand faces come from Google Fonts at render time and are embedded into
# the PDF, so the files stay correct on a machine that has never seen them.
set -euo pipefail

OUT="${1:-$(cd "$(dirname "$0")" && pwd)/pdf}"
DOCS="$(cd "$(dirname "$0")" && pwd)"

CHROME=""
for c in \
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" \
  "/Applications/Chromium.app/Contents/MacOS/Chromium" \
  "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser" \
  "$(command -v google-chrome || true)" \
  "$(command -v chromium || true)"; do
  [ -n "$c" ] && [ -x "$c" ] && CHROME="$c" && break
done
if [ -z "$CHROME" ]; then
  echo "No Chrome/Chromium found. Install Chrome, or open the .html files and print to PDF." >&2
  exit 1
fi

mkdir -p "$OUT"
for name in partnership-prospectus arroyo-grand-nationals-proposal one-pager; do
  "$CHROME" --headless --disable-gpu --no-pdf-header-footer \
    --virtual-time-budget=15000 \
    --print-to-pdf="$OUT/MMDC-$name.pdf" \
    "file://$DOCS/$name.html" >/dev/null 2>&1
  printf '  %-42s %s\n' "MMDC-$name.pdf" "$(du -h "$OUT/MMDC-$name.pdf" | cut -f1)"
done
echo "PDFs written to $OUT"
