#!/usr/bin/env bash
# Creates and boots a fresh iPhone 17 simulator for the Argent flows, never one
# another job has used, and exports its UDID as SIMULATOR_UDID.
#
#   scripts/e2e/boot-argent-ios-simulator.sh <runtime identifier>
#
# The runtime is pinned by the caller to the one the committed iOS baselines
# were recorded on: tab bar rendering differs between iOS minor versions, so a
# newer runtime on the runner image would show up as snapshot diffs.
set -euo pipefail

RUNTIME="$1"

if ! xcrun simctl list runtimes -j | jq -e --arg r "$RUNTIME" \
  '.runtimes[] | select(.identifier == $r and .isAvailable)' > /dev/null; then
  echo "iOS runtime $RUNTIME (the baselines' runtime) is not available on this runner:" >&2
  xcrun simctl list runtimes >&2
  exit 1
fi

UDID=$(xcrun simctl create "Argent iPhone 17" com.apple.CoreSimulator.SimDeviceType.iPhone-17 "$RUNTIME")
echo "Booting $UDID ($RUNTIME)"
xcrun simctl boot "$UDID"
xcrun simctl bootstatus "$UDID"

if [ -n "${GITHUB_ENV:-}" ]; then
  echo "SIMULATOR_UDID=$UDID" >> "$GITHUB_ENV"
fi
