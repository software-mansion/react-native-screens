#!/usr/bin/env bash
# Installs the app on the booted iOS simulator and runs the Argent flows from
# .argent/flows against it. Run from the repository root in CI, after
# scripts/e2e/boot-argent-ios-simulator.sh and after the Argent tool-server was
# started (.github/actions/argent-server).
#
#   scripts/e2e/run-argent-flows-ios.sh <simulator UDID> <path to .app>
#
# Snapshots are always diffed against the baselines in .argent/flows/__baselines__,
# a symlink into the react-native-screens-testing submodule (the workflow
# initializes it); a missing baseline fails the flow. Record new baselines with
# `--update-baselines` on a simulator matching this job - iPhone 17 on the
# runtime the workflow pins.
set -euo pipefail

UDID="$1"
APP_PATH="$2"

xcrun simctl install "$UDID" "$APP_PATH"

# Everything a failure needs lands in $OUT (uploaded by the workflow):
# argent-flows.log, snapshots/ (baseline/current/diff of each mismatching
# snapshot) and screen-at-failure.png.
OUT="${RUNNER_TEMP:-/tmp}/argent-out"
mkdir -p "$OUT"
set +e
argent flow run ./.argent/flows --device "$UDID" \
  --output "$OUT/snapshots" 2>&1 | tee "$OUT/argent-flows.log"
RC=${PIPESTATUS[0]}
set -e
if [ "$RC" -ne 0 ]; then
  xcrun simctl io "$UDID" screenshot "$OUT/screen-at-failure.png" || true
fi
exit "$RC"
