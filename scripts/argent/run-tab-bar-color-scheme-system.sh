#!/usr/bin/env bash
#
# Run the Tabs "Tab Bar Color Scheme" SYSTEM-source matrix end to end.
#
# The argent flow engine has no shell step and there is no in-app control for the OS appearance, so the
# system light/dark flip cannot live inside the flow YAML. This wrapper does it: it SETS the system
# appearance, then runs the matching headless flow — once for DARK, once for LIGHT. Together the two
# flows cover the full matrix (system ∈ {dark,light} × TabsHost ∈ {inherit,light,dark}), with React
# Native's colorScheme held at `unspecified` throughout.
#
# Simulator / emulator ONLY — `simctl` targets a booted simulator and `adb cmd uimode` an emulator;
# neither drives a physical device.
#
# Usage:
#   scripts/run-tab-bar-color-scheme-system.sh ios     [extra argent flags…]
#   scripts/run-tab-bar-color-scheme-system.sh android [extra argent flags…]
#
#   # seed & commit baselines on first run:
#   scripts/run-tab-bar-color-scheme-system.sh ios --update-baselines
#
#   # target a specific device (else the booted simulator / first emulator is used):
#   IOS_UDID=<UDID>      scripts/run-tab-bar-color-scheme-system.sh ios
#   ANDROID_SERIAL=<ser> scripts/run-tab-bar-color-scheme-system.sh android
#
# Prereqs: the FabricExample app is installed on the target and (for a dev build) Metro is running.
# Extra args after the platform are forwarded verbatim to every `argent flow run` (e.g.
# --update-baselines, --output dir, --device <id>, --json).

set -euo pipefail

PLATFORM="${1:-}"
shift || true
EXTRA_ARGS=("$@")

# RN-source flow (drives the React Native colorScheme via the on-screen picker). It is run with the
# system default appearance set to LIGHT so its RN=unspecified baseline snapshots are deterministic.
RN_FLOW="test-tabs-tab-bar-color-scheme"
DARK_FLOW="test-tabs-tab-bar-color-scheme-system-dark"
LIGHT_FLOW="test-tabs-tab-bar-color-scheme-system-light"

# Resolve to the repo root (this script lives in scripts/) so `argent flow run` finds .argent/flows.
ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$ROOT"

set_appearance() {
  # $1 = dark|light
  local mode="$1"
  case "$PLATFORM" in
    ios)
      local target="${IOS_UDID:-booted}"
      echo ">> iOS: set system appearance = $mode  (xcrun simctl ui $target appearance $mode)"
      xcrun simctl ui "$target" appearance "$mode"
      ;;
    android)
      local night; [[ "$mode" == "dark" ]] && night="yes" || night="no"
      # Avoid empty-array expansion (unbound under `set -u` on macOS bash 3.2); branch on the serial.
      if [[ -n "${ANDROID_SERIAL:-}" ]]; then
        echo ">> Android: set system appearance = $mode  (adb -s $ANDROID_SERIAL shell cmd uimode night $night)"
        adb -s "$ANDROID_SERIAL" shell "cmd uimode night $night"
      else
        echo ">> Android: set system appearance = $mode  (adb shell cmd uimode night $night)"
        adb shell "cmd uimode night $night"
      fi
      ;;
    *)
      echo "ERROR: first arg must be 'ios' or 'android' (got: '${PLATFORM:-}')." >&2
      exit 2
      ;;
  esac
  # Give the running app a moment to react to the appearance change before the flow launches it.
  sleep 1
}

run_flow() {
  # $1 = flow name. The ${arr[@]+"${arr[@]}"} idiom expands to nothing when EXTRA_ARGS is empty,
  # which is safe under `set -u` on macOS bash 3.2 (a bare ${EXTRA_ARGS[@]} would be "unbound").
  echo ">> argent flow run $1 --platform $PLATFORM ${EXTRA_ARGS[*]:-}"
  argent flow run "$1" --platform "$PLATFORM" ${EXTRA_ARGS[@]+"${EXTRA_ARGS[@]}"}
}

echo "=== Tab Bar Color Scheme matrix on $PLATFORM ==="

# 1) RN-source flow, with the system default appearance = LIGHT.
set_appearance light
run_flow "$RN_FLOW"

# 2) SYSTEM-source matrix: LIGHT row (system already light from step 1) then DARK row.
set_appearance light
run_flow "$LIGHT_FLOW"

set_appearance dark
run_flow "$DARK_FLOW"

# Leave the system in a neutral LIGHT state for whatever runs next.
set_appearance light
echo "=== Done. System appearance = light. ==="
