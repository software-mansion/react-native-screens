#!/usr/bin/env bash
# Runs the Argent flows from .argent/flows against the booted Android emulator.
# Meant to be the `script:` of reactivecircus/android-emulator-runner in CI, run
# from the repository root, after `yarn build-e2e-android` and after the Argent
# tool-server was started (.github/actions/argent-server).
#
# Snapshots are always diffed against the baselines committed under
# .argent/flows/__baselines__; a missing baseline fails the flow. Record new
# baselines locally with `--update-baselines` and commit them.
set -euo pipefail

SERIAL=$(adb devices | awk 'NR>1 && $2=="device"{print $1; exit}')
if [ -z "$SERIAL" ]; then
  echo "No booted Android device found" >&2
  adb devices >&2
  exit 1
fi
echo "Running Argent flows on $SERIAL"

adb -s "$SERIAL" install -r FabricExample/android/app/build/outputs/apk/release/app-release.apk

adb -s "$SERIAL" shell settings put global window_animation_scale 0.0
adb -s "$SERIAL" shell settings put global animator_duration_scale 0.0
# transition_animation_scale is left alone on purpose: Reanimated reports
# reduced motion when it is 0.

argent flow run ./.argent/flows --device "$SERIAL" \
  --output "${RUNNER_TEMP:-/tmp}/argent-out"
