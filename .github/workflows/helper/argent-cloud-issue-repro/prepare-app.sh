#!/usr/bin/env bash
# Scaffolds a fresh React Native CLI or Expo app from the official template, installs
# react-native-screens from npm at the exact version that the plan names, plus the allowlisted
# dependencies, and copies the overlay that the planning agent wrote. Nothing from the reporter's
# repository is ever used here, and the library never comes from this checkout.
#
# Usage: prepare-app.sh <plan.json> <overlay-dir> <app-dir>
#
# The templates are installed at their current versions on purpose: pinning them would freeze
# security fixes. This job holds no secrets, but code that runs here can still reach the runtime
# token of the artifact and cache actions of this run, so a compromised template could taint the
# app that goes to Argent Cloud and write caches of the default branch. No workflow that publishes
# restores a dependency cache for that reason.
set -euo pipefail

# The name of the app and the last part of its bundle identifier (com.swmansion.reproapp).
readonly APP_NAME=ReproApp

main() {
  PLAN_FILE="${1:?usage: prepare-app.sh <plan.json> <overlay-dir> <app-dir>}"
  OVERLAY_DIR="${2:?usage: prepare-app.sh <plan.json> <overlay-dir> <app-dir>}"
  APP_DIR="${3:?usage: prepare-app.sh <plan.json> <overlay-dir> <app-dir>}"
  ALLOWLIST_FILE="$(dirname "${BASH_SOURCE[0]}")/allowed-dependencies.json"

  read_plan
  read_library_packages
  validate_overlay
  validate_extra_dependencies
  # The workflow supports only the New Architecture.
  export RCT_NEW_ARCH_ENABLED=1

  case "$APP_KIND" in
    rn-cli) scaffold_rn_cli ;;
    expo) scaffold_expo ;;
    *) fail "unknown appKind '$APP_KIND'" ;;
  esac

  install_pods
  echo "Prepared the app in $APP_DIR"
}

# Reads the fields of the plan that drive the scaffold. The plan is the structured output of the
# planning agent, validated against plan.schema.json by Claude Code, but the version strings are
# free text there, so they are checked again here before they reach npm.
read_plan() {
  plan() { jq -r "$1" "$PLAN_FILE"; }
  APP_KIND=$(plan '.appKind')
  RN_VERSION=$(plan '.reactNativeVersion')
  SCREENS_VERSION=$(plan '.screensVersion // empty')
  EXPO_SDK_VERSION=$(plan '.expoSdkVersion // empty')
  CONFIGURATION=$(plan '.configuration // "release"')
  EXTRA_DEPENDENCIES=$(plan '.extraDependencies[] | "\(.name)@\(.version)"')
  [[ "$RN_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+([-.+][0-9A-Za-z.-]+)?$ ]] || fail "reactNativeVersion must be exact, got '$RN_VERSION'"
}

# react-native-screens always comes from npm, at the exact version of the plan. The workflow checks
# the version string when it saves the plan; this is the second line of defense before it reaches
# npm, so a range or a tarball URL cannot slip through.
read_library_packages() {
  [[ "$SCREENS_VERSION" =~ ^[0-9]+\.[0-9]+\.[0-9]+([-.+][0-9A-Za-z.-]+)?$ ]] || fail "screensVersion must be exact, got '$SCREENS_VERSION'"
  LIBRARY_PACKAGES=("react-native-screens@$SCREENS_VERSION")
}

# True when the plan lists the package (any version) among extraDependencies.
has_dependency() {
  grep -q -- "^$1@" <<< "$EXTRA_DEPENDENCIES"
}

# The overlay is the only agent-written input that lands in the app. Only App.tsx and source files
# under src/ are accepted, so the agent cannot change the Babel, Metro or Expo configuration, the
# package manifest or anything native. Dotfiles and package.json are refused under src/ as well:
# Metro runs Babel with babelrc lookup on, so a `src/.babelrc.json` (or a `babel` key in a nested
# package.json) would load a plugin from a `.js` file of the overlay and run it in Node, on this
# runner at bundle time and on the tester's machine in a Debug run. The library itself is never
# part of the overlay: it is installed from npm.
validate_overlay() {
  [ -d "$OVERLAY_DIR" ] || return 0
  local rejected=0
  while IFS= read -r file; do
    case "$file" in
      App.tsx) ;;
      src/*.ts | src/*.tsx | src/*.js | src/*.jsx | src/*.json) ;;
      *)
        echo "::error::overlay file '$file' is not allowed; only App.tsx and src/**/*.{ts,tsx,js,jsx,json} are copied"
        rejected=1
        ;;
    esac
    case "$file" in
      *..*)
        echo "::error::overlay file '$file' has a '..' segment"
        rejected=1
        ;;
      */.* | .*)
        echo "::error::overlay file '$file' is a dotfile or lives under a dot directory; Babel or Metro could load it as configuration"
        rejected=1
        ;;
      */package.json | package.json)
        echo "::error::overlay file '$file' is a package manifest; it is not allowed anywhere in the overlay"
        rejected=1
        ;;
    esac
  done < <(cd "$OVERLAY_DIR" && find . -mindepth 1 \( -type f -o -type l \) | sed 's|^\./||')
  if [ -n "$(find "$OVERLAY_DIR" -type l)" ]; then
    echo "::error::the overlay contains symbolic links"
    rejected=1
  fi
  [ "$rejected" -eq 0 ] || fail "the overlay in $OVERLAY_DIR was rejected"
}

# Every extra dependency must be on the allowlist and pinned to an exact version, so the app can
# only pull packages that maintainers vetted, and npm cannot be steered to a tarball or a range.
validate_extra_dependencies() {
  local rejected=0
  while IFS= read -r dependency; do
    [ -n "$dependency" ] || continue
    local name="${dependency%@*}"
    local version="${dependency##*@}"
    if ! jq -e --arg name "$name" 'index($name) != null' "$ALLOWLIST_FILE" > /dev/null; then
      echo "::error::dependency '$name' is not in $ALLOWLIST_FILE"
      rejected=1
    fi
    if ! [[ "$version" =~ ^[0-9]+\.[0-9]+\.[0-9]+([-.+][0-9A-Za-z.-]+)?$ ]]; then
      echo "::error::dependency '$name' must have an exact version, got '$version'"
      rejected=1
    fi
  done <<< "$EXTRA_DEPENDENCIES"
  [ "$rejected" -eq 0 ] || fail "extraDependencies were rejected"
}

scaffold_rn_cli() {
  echo "Scaffolding React Native CLI app $APP_NAME with react-native@$RN_VERSION"
  npx @react-native-community/cli init "$APP_NAME" \
    --directory "$APP_DIR" \
    --version "$RN_VERSION" \
    --skip-install \
    --install-pods 0 \
    --skip-git-init
  (
    cd "$APP_DIR"
    npm install
    install_library_packages
  )
  write_babel_config
  copy_overlay
}

scaffold_expo() {
  [ -n "$EXPO_SDK_VERSION" ] || fail "expoSdkVersion is required for appKind 'expo'"
  [[ "$EXPO_SDK_VERSION" =~ ^[0-9]+$ ]] || fail "expoSdkVersion must be a major number, got '$EXPO_SDK_VERSION'"
  echo "Scaffolding Expo app $APP_NAME with SDK $EXPO_SDK_VERSION"
  npx create-expo-app@latest "$APP_DIR" --template "blank-typescript@sdk-$EXPO_SDK_VERSION" --no-install
  (
    cd "$APP_DIR"
    npm install
    npx expo install babel-preset-expo
    install_library_packages
    # The template has no bundle identifier, and prebuild needs one.
    node -e '
      const fs = require("fs");
      const config = JSON.parse(fs.readFileSync("app.json", "utf8"));
      config.expo.name = "ReproApp";
      config.expo.slug = "reproapp";
      config.expo.newArchEnabled = true;
      config.expo.ios = { ...(config.expo.ios ?? {}), bundleIdentifier: "com.swmansion.reproapp" };
      fs.writeFileSync("app.json", JSON.stringify(config, null, 2) + "\n");
    '
  )
  write_babel_config
  copy_overlay
  (cd "$APP_DIR" && npx expo prebuild --platform ios --no-install)
}

# Lifecycle scripts are disabled for the library and the extra dependencies: none of the
# allowlisted packages needs them, and it removes the one way an npm package runs code here.
install_library_packages() {
  local packages=("${LIBRARY_PACKAGES[@]}")
  while IFS= read -r dependency; do
    [ -n "$dependency" ] && packages+=("$dependency")
  done <<< "$EXTRA_DEPENDENCIES"
  echo "Installing ${packages[*]} with lifecycle scripts disabled"
  npm install --ignore-scripts --save-exact "${packages[@]}"
}

# The Babel config is always written here, never taken from the agent, so the only plugins are the
# ones that the allowlisted Reanimated or Worklets packages need to work at all.
write_babel_config() {
  local preset="module:@react-native/babel-preset"
  if [ "$APP_KIND" = "expo" ]; then
    preset="babel-preset-expo"
  fi
  local plugins=""
  if has_dependency react-native-worklets; then
    plugins="'react-native-worklets/plugin'"
  elif has_dependency react-native-reanimated; then
    plugins="'react-native-reanimated/plugin'"
  fi
  cat > "$APP_DIR/babel.config.js" <<BABEL
module.exports = {
  presets: ['$preset'],
  plugins: [$plugins],
};
BABEL
}

# tar keeps the src/ tree; macOS cp has no --parents. The overlay was validated above, so
# everything in it is copied.
copy_overlay() {
  if [ -d "$OVERLAY_DIR" ] && [ -n "$(ls -A "$OVERLAY_DIR")" ]; then
    echo "Copying overlay files from $OVERLAY_DIR:"
    (cd "$OVERLAY_DIR" && find . -type f)
    (cd "$OVERLAY_DIR" && tar -cf - .) | tar -xf - -C "$APP_DIR"
  fi
}

install_pods() {
  cd "$APP_DIR/ios"
  if [ -f ../Gemfile ]; then
    # The templates ship a Gemfile without the json gem; json 3 breaks CocoaPods on Ruby 3.3, so
    # it is pinned below 3 before bundler resolves.
    grep -q "^gem 'json'" ../Gemfile || echo "gem 'json', '< 3.0'" >> ../Gemfile
    (cd .. && bundle install)
    bundle exec pod install
  else
    pod install
  fi
  cd - > /dev/null
}

fail() {
  echo "::error::$1"
  exit 1
}

main "$@"
