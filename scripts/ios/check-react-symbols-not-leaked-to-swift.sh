#!/usr/bin/env bash
#
# check-react-symbols-not-leaked-to-swift.sh
#
# Guards the invariant established by the "hide react symbols from swift" fix:
# the public Objective-C headers of the `RNScreens` module must NOT expose any
# React (React-Core / Fabric / ReactCommon ...) symbols to Swift.
#
# Why this matters
# ----------------
# Swift consumes `RNScreens` through its Clang module. The Clang importer parses
# the public Objective-C headers in *Objective-C* mode (without `__cplusplus`).
# If a public header `#import`s a React header (or derives from a React type)
# outside of an `#if defined(__cplusplus)` guard, that React header is baked
# into the precompiled `RNScreens` Clang module (`.pcm`) and leaks into every
# Swift translation unit that does `import RNScreens`.
#
# How the check works
# -------------------
# After the app is built, Xcode emits a precompiled module for `RNScreens` under
# `.../SwiftExplicitPrecompiledModules/RNScreens-*.pcm`. We dump its inputs with
# `clang -module-file-info` and assert that every input header is either:
#   * a system / SDK header (UIKit, Foundation, the SDK itself), or
#   * one of the module's own public headers (incl. RNS-owned `RCT*` categories
#     such as `RCTConvert+RNSTabs.h`).
# Any input that lives outside the module's own header directory (e.g. a
# React-Core header like `RCTViewManager.h` or `RCTBridge.h`) is a leak and
# fails the check.
#
# Usage
# -----
#   scripts/ios/check-react-symbols-not-leaked-to-swift.sh [SEARCH_ROOT]
#
# SEARCH_ROOT defaults to ~/Library/Developer/Xcode/DerivedData. Pass a custom
# DerivedData path when the build uses one (e.g. `-derivedDataPath`).

set -euo pipefail

MODULE_NAME="RNScreens"
SEARCH_ROOT="${1:-$HOME/Library/Developer/Xcode/DerivedData}"

if [[ ! -d "$SEARCH_ROOT" ]]; then
  echo "error: search root not found: $SEARCH_ROOT" >&2
  echo "       Build the app first so that the ${MODULE_NAME} Clang module is generated." >&2
  exit 1
fi

# Collect every precompiled module for RNScreens (there may be several, e.g. one
# per architecture / configuration). All of them must be clean.
pcms=()
while IFS= read -r pcm; do
  pcms+=("$pcm")
done < <(find "$SEARCH_ROOT" \
  -path '*/SwiftExplicitPrecompiledModules/*' \
  -name "${MODULE_NAME}-*.pcm" 2>/dev/null | sort -u)

if [[ ${#pcms[@]} -eq 0 ]]; then
  echo "error: no ${MODULE_NAME}-*.pcm found under ${SEARCH_ROOT}." >&2
  echo "       The Swift Clang module for ${MODULE_NAME} was not generated -" >&2
  echo "       make sure the iOS app was built (with Swift) before running this check." >&2
  exit 1
fi

# Returns true (0) for headers that are allowed to back the module:
#   * the module's own public headers (under the dir holding its module map), and
#   * system / SDK headers.
is_allowed() {
  local file="$1" module_dir="$2"
  [[ -n "$module_dir" && "$file" == "$module_dir/"* ]] && return 0
  case "$file" in
    *.platform/*|*.sdk/*|/Applications/Xcode*.app/*) return 0 ;;
  esac
  return 1
}

leak_found=0

for pcm in "${pcms[@]}"; do
  echo "==> Inspecting $(basename "$pcm")"

  inputs=$(xcrun clang -module-file-info "$pcm" 2>/dev/null \
    | sed -n 's/^[[:space:]]*Input file:[[:space:]]*//p' \
    | sed 's/[[:space:]]*\[System\]$//')

  if [[ -z "$inputs" ]]; then
    echo "error: could not read input files from $pcm" >&2
    exit 1
  fi

  # The module's own public headers live alongside its module map.
  module_dir=$(printf '%s\n' "$inputs" | grep -E '/'"${MODULE_NAME}"'\.modulemap$' | head -n1 | xargs -I{} dirname {} 2>/dev/null || true)
  if [[ -z "$module_dir" ]]; then
    module_dir=$(printf '%s\n' "$inputs" | grep -E '/'"${MODULE_NAME}"'-umbrella\.h$' | head -n1 | xargs -I{} dirname {} 2>/dev/null || true)
  fi

  leaks=()
  while IFS= read -r file; do
    [[ -z "$file" ]] && continue
    if ! is_allowed "$file" "$module_dir"; then
      leaks+=("$file")
    fi
  done <<< "$inputs"

  if [[ ${#leaks[@]} -gt 0 ]]; then
    leak_found=1
    echo "  ✗ React/foreign headers leaked into the ${MODULE_NAME} Swift module:" >&2
    for f in "${leaks[@]}"; do
      echo "      - $f" >&2
    done
  else
    echo "  ✓ no foreign headers leaked"
  fi
done

if [[ $leak_found -ne 0 ]]; then
  cat >&2 <<EOF

React symbols are leaking into the ${MODULE_NAME} Swift module.

A public Objective-C header imports a React header (or derives from a React
type) outside of an '#if defined(__cplusplus)' guard. Wrap the React import and
the React-dependent declaration in such a guard so the symbol stays invisible to
Swift's (Objective-C) Clang importer. See the headers under ios/ for the pattern.
EOF
  exit 1
fi

echo "All ${MODULE_NAME} Swift modules are free of leaked React symbols."
