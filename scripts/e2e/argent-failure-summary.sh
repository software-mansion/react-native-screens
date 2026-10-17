#!/usr/bin/env bash
# Writes the failing Argent flow steps to the GitHub job summary, so the reason
# a flow failed is visible on the run page without opening the logs.
#
#   scripts/e2e/argent-failure-summary.sh <platform> <argent-out dir>
#
# Expects <argent-out dir>/argent-flows.log (the `argent flow run` output) and,
# when present, lists the images the failure artifact carries.
set -uo pipefail

PLATFORM="$1"
OUT="$2"
LOG="$OUT/argent-flows.log"
SUMMARY="${GITHUB_STEP_SUMMARY:-/dev/stdout}"

{
  echo "### Argent flows failed ($PLATFORM)"
  echo
  if [ -f "$LOG" ]; then
    echo '```'
    # Failed/errored steps and the per-flow and final verdict lines.
    grep -E '✗|^\s*(PASS|FAIL)|^(PASS|FAIL) ' "$LOG" || echo "(no failing step in the log — see argent-flows.log)"
    echo '```'
  else
    echo "No flow output — the flows did not start (see argent-server.log)."
  fi
  echo
  echo "Download the **argent-$PLATFORM-failure** artifact:"
  echo
  echo "- \`screen-at-failure.png\` — the device screen right after the failure"
  if [ -d "$OUT/snapshots" ] && [ -n "$(ls -A "$OUT/snapshots" 2>/dev/null)" ]; then
    echo "- \`snapshots/<flow>/\` — baseline / current / diff PNGs of each mismatching snapshot:"
    (cd "$OUT/snapshots" && find . -name '*.png' | sed 's|^\./|  - `|; s|$|`|')
  else
    echo "- no snapshot diffs — no snapshot was compared and mismatched (a step failed before or instead)"
  fi
  echo "- \`argent-flows.log\` — full flow output"
  echo "- \`argent-server.log\` — Argent tool-server log (for device/connection problems)"
} >> "$SUMMARY"
