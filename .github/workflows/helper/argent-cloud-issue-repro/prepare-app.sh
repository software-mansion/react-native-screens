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
#
# `expo prebuild` runs config plugins in Node, and `--ignore-scripts` does not cover them: the
# plugins that app.json lists, which this script writes, and the plugins that
# @expo/prebuild-config applies by itself to the packages on its fixed list (see getAutoPlugins in
# its withDefaultPlugins.js, for example expo-camera, expo-file-system or expo-notifications) when
# they are installed. Before a package from that list goes on the allowlist, accept that its
# plugin runs here. In a Debug run, `expo start` on the tester's machine evaluates the plugins of
# app.json too.
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
  validate_expo_router
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

# Expo packages must match the SDK of the template, so `expo install` picks their versions.
is_expo_package() {
  [[ "$1" == expo-* ]]
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
    if is_expo_package "$name" && [ "$APP_KIND" != "expo" ]; then
      echo "::error::dependency '$name' is an Expo package; it needs appKind 'expo', got '$APP_KIND'"
      rejected=1
    fi
  done <<< "$EXTRA_DEPENDENCIES"
  [ "$rejected" -eq 0 ] || fail "extraDependencies were rejected"
}

# Expo Router finds the routes in src/app/ of the overlay; without them the app shows nothing but
# Expo Router's "unmatched route" screen.
validate_expo_router() {
  has_dependency expo-router || return 0
  [ -d "$OVERLAY_DIR/src/app" ] || fail "expo-router needs the routes under src/app/ of the overlay"
  has_dependency react-native-safe-area-context || fail "expo-router needs react-native-safe-area-context among extraDependencies"
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
    # `expo install` adds the config plugin of every package it installs to app.json; only the
    # plugins of the template and the ones set below are kept.
    local template_plugins
    template_plugins=$(jq -c '.expo.plugins // []' app.json)
    npm install
    npx expo install babel-preset-expo
    install_library_packages
    local expo_router=false
    has_dependency expo-router && expo_router=true
    # The template has no bundle identifier, and prebuild needs one. Expo Router needs a URL scheme,
    # its config plugin and its entry point, which loads the routes from src/app/.
    TEMPLATE_PLUGINS="$template_plugins" EXPO_ROUTER="$expo_router" node -e '
      const fs = require("fs");
      const expoRouter = process.env.EXPO_ROUTER === "true";
      const config = JSON.parse(fs.readFileSync("app.json", "utf8"));
      config.expo.name = "ReproApp";
      config.expo.slug = "reproapp";
      config.expo.newArchEnabled = true;
      config.expo.ios = { ...(config.expo.ios ?? {}), bundleIdentifier: "com.swmansion.reproapp" };
      config.expo.plugins = JSON.parse(process.env.TEMPLATE_PLUGINS);
      if (expoRouter) {
        config.expo.scheme = "reproapp";
        config.expo.plugins.push("expo-router");
      }
      fs.writeFileSync("app.json", JSON.stringify(config, null, 2) + "\n");
      if (expoRouter) {
        const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
        pkg.main = "expo-router/entry";
        fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
      }
    '
  )
  write_babel_config
  copy_overlay
  (cd "$APP_DIR" && npx expo prebuild --platform ios --no-install)
}

# Lifecycle scripts are disabled for the library and the extra dependencies: none of the
# allowlisted packages needs them, and it removes the one way an npm package runs code here.
# Expo packages are installed by `expo install` at the versions of the SDK, so the versions in the
# plan are ignored for them; Expo Router also needs expo-linking. `expo install` saves `~` ranges
# in package.json whatever npm flags it gets, so the lockfile is what pins them. An override keeps a single copy
# of react-native-screens: expo-router depends on it directly, and a version of the plan outside
# its range would otherwise nest a second copy with a second native module.
install_library_packages() {
  local packages=("${LIBRARY_PACKAGES[@]}") expo_packages=()
  while IFS= read -r dependency; do
    [ -n "$dependency" ] || continue
    if is_expo_package "${dependency%@*}"; then
      expo_packages+=("${dependency%@*}")
    else
      packages+=("$dependency")
    fi
  done <<< "$EXTRA_DEPENDENCIES"
  if has_dependency expo-router && ! has_dependency expo-linking; then
    expo_packages+=(expo-linking)
  fi
  SCREENS_VERSION="$SCREENS_VERSION" node -e '
    const fs = require("fs");
    const pkg = JSON.parse(fs.readFileSync("package.json", "utf8"));
    pkg.overrides = { ...(pkg.overrides ?? {}), "react-native-screens": process.env.SCREENS_VERSION };
    fs.writeFileSync("package.json", JSON.stringify(pkg, null, 2) + "\n");
  '
  echo "Installing ${packages[*]} with lifecycle scripts disabled"
  npm install --ignore-scripts --save-exact "${packages[@]}"
  if [ "${#expo_packages[@]}" -gt 0 ]; then
    echo "Installing ${expo_packages[*]} at the versions of the SDK with lifecycle scripts disabled"
    npx expo install "${expo_packages[@]}" -- --ignore-scripts --save-exact
  fi
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
