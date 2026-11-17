#!/usr/bin/env bash
# Builds the scaffolded app for the iOS simulator and stages the .app, plus the JavaScript source
# for a Debug build, into a staging directory. package-app.sh turns the staging directory into the
# one .tar.gz for argent-cloud.
#
# Usage: build-app.sh <app-root> <staging-dir> [Release|Debug] [<xcodebuild.log>]
set -euo pipefail

main() {
  APP_ROOT="${1:?usage: build-app.sh <app-root> <staging-dir> [Release|Debug] [<xcodebuild.log>]}"
  STAGING="${2:?usage: build-app.sh <app-root> <staging-dir> [Release|Debug] [<xcodebuild.log>]}"
  CONFIGURATION="${3:-Release}"
  BUILD_LOG="${4:-}"
  DERIVED_DATA="$APP_ROOT/ios/build"
  mkdir -p "$STAGING"

  case "$CONFIGURATION" in
    Release | Debug) ;;
    *) fail "unknown configuration '$CONFIGURATION', expected Release or Debug" ;;
  esac

  find_workspace_and_scheme
  build
  stage_app
  if [ "$CONFIGURATION" = "Debug" ]; then
    stage_source
  fi
}

# The scheme is the one named after the workspace when it exists, else the first one that is not a
# Pods scheme, because the CLI and the Expo templates name them differently.
find_workspace_and_scheme() {
  WORKSPACE=$(find "$APP_ROOT/ios" -maxdepth 1 -name '*.xcworkspace' | head -n 1)
  [ -n "$WORKSPACE" ] || fail "no .xcworkspace in $APP_ROOT/ios"
  local workspace_name
  workspace_name=$(basename "$WORKSPACE" .xcworkspace)
  SCHEME=$(xcodebuild -list -json -workspace "$WORKSPACE" \
    | jq -r --arg name "$workspace_name" '
        .workspace.schemes as $schemes
        | ($schemes | map(select(. == $name)) | first)
          // ($schemes | map(select(startswith("Pods") | not)) | first)')
  [ -n "$SCHEME" ] && [ "$SCHEME" != "null" ] || fail "no buildable scheme in $WORKSPACE"
  echo "Workspace: $WORKSPACE, scheme: $SCHEME, configuration: $CONFIGURATION"
}

# -quiet keeps the job log readable; the full output goes to BUILD_LOG when given, which the
# workflow uploads on failure.
build() {
  local -a cmd=(
    xcodebuild build
    -workspace "$WORKSPACE"
    -scheme "$SCHEME"
    -configuration "$CONFIGURATION"
    -sdk iphonesimulator
    -destination 'generic/platform=iOS Simulator'
    -derivedDataPath "$DERIVED_DATA"
    CODE_SIGNING_ALLOWED=NO
  )
  if [ -n "$BUILD_LOG" ]; then
    mkdir -p "$(dirname "$BUILD_LOG")"
    # The status of xcodebuild is taken directly, not through a pipeline: an `|| true` after a
    # pipeline runs the `true` builtin, which resets PIPESTATUS to 0 and hides the failure. The
    # log is filtered afterwards for the job log.
    local status=0
    "${cmd[@]}" > "$BUILD_LOG" 2>&1 || status=$?
    grep -E 'error:|warning: .*(Screens|RNS)|\*\* BUILD' "$BUILD_LOG" || true
    [ "$status" -eq 0 ] || fail "xcodebuild failed with $status, see $BUILD_LOG"
  else
    "${cmd[@]}" -quiet
  fi
}

stage_app() {
  local products="$DERIVED_DATA/Build/Products/$CONFIGURATION-iphonesimulator"
  APP=$(find "$products" -maxdepth 1 -name '*.app' | head -n 1)
  [ -n "$APP" ] || fail "no .app in $products"
  if [ "$CONFIGURATION" = "Release" ] && [ ! -f "$APP/main.jsbundle" ]; then
    fail "the Release app has no main.jsbundle, so it would wait for a Metro server"
  fi
  cp -R "$APP" "$STAGING/"
  echo "Staged $(basename "$APP") in $STAGING"
}

# A Debug app loads its JavaScript from Metro, which the tester runs on the cloud Mac. The tester
# needs the app source with its lockfile, without the native projects and node_modules.
# prepare-app.sh installs the library and every other package from npm, so every dependency in the
# lockfile resolves from npm; a `file:` dependency here is a bug in the pipeline and fails the build
# rather than shipping a source the tester cannot install.
stage_source() {
  local source="$STAGING/source"
  mkdir -p "$source"
  (cd "$APP_ROOT" && find . -mindepth 1 -maxdepth 1 \
    ! -name node_modules ! -name ios ! -name android ! -name .git ! -name .expo \
    -exec cp -R {} "$source/" \;)
  local file_dependencies
  file_dependencies=$(jq -r '[.dependencies // {}, .devDependencies // {}] | add | to_entries[] | select(.value | startswith("file:")) | "\(.key)=\(.value)"' "$source/package.json")
  [ -z "$file_dependencies" ] || fail "a Debug app has local dependencies that the tester cannot install: $file_dependencies"
  COPYFILE_DISABLE=1 tar --no-mac-metadata -czf "$STAGING/repro-source.tar.gz" -C "$STAGING" source
  rm -rf "$source"
  echo "Packaged the JavaScript source of $APP_ROOT for Metro"
}

fail() {
  echo "::error::$1"
  exit 1
}

main "$@"
