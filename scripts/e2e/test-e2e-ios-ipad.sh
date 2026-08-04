#!/usr/bin/env bash
# Runs the @ipad Detox e2e suite against an iPad simulator.
# Simulator defaults to DEFAULT_APPLE_IPAD_SIMULATOR_NAME (scripts/e2e/ios-devices.js);
# override by exporting RNS_APPLE_SIM_NAME. Must be run from FabricExample/.

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

# Use the module default if RNS_APPLE_SIM_NAME is not already set.
if [[ -z "${RNS_APPLE_SIM_NAME:-}" ]]; then
  RNS_APPLE_SIM_NAME="$(node -p "require('${SCRIPT_DIR}/ios-devices').DEFAULT_APPLE_IPAD_SIMULATOR_NAME")"
fi

# Bail if node returned empty or "undefined" (constant missing or not exported).
if [[ -z "${RNS_APPLE_SIM_NAME}" || "${RNS_APPLE_SIM_NAME}" == "undefined" ]]; then
  echo "Error: could not resolve an iPad simulator name. Set RNS_APPLE_SIM_NAME explicitly or check scripts/e2e/ios-devices.js." >&2
  exit 1
fi

# Reject non-iPad names even if RNS_APPLE_SIM_NAME was set by the caller.
if [[ "${RNS_APPLE_SIM_NAME}" != iPad* ]]; then
  echo "Error: test-e2e-ios-ipad only runs on iPad simulators, but RNS_APPLE_SIM_NAME='${RNS_APPLE_SIM_NAME}'." >&2
  echo "       Set RNS_APPLE_SIM_NAME to an iPad model (e.g. \"iPad Pro 13-inch (M4)\")." >&2
  exit 1
fi
export RNS_APPLE_SIM_NAME

echo "Running @ipad e2e suite on simulator: ${RNS_APPLE_SIM_NAME}"

# Extra args forwarded to detox (e.g. --reuse, --cleanup).
detox test \
  --configuration ios.sim.release \
  --take-screenshots failing \
  "$@" \
  -- -t '@ipad'
