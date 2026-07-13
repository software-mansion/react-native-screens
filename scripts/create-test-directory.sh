#!/usr/bin/env bash
#
# create-test-directory.sh
#
# Scaffolds a new test screen directory under apps/src/tests/<category>/<domain>/.
#
# Creates:
#   apps/src/tests/<category>/<domain>/<test-dir-name>/
#     index.tsx               (empty)
#     scenario-description.ts (from template, name/key filled in)
#     scenario.md             (copied from the repo scenario.md template)
#
# The <domain> directory is created automatically if it does not exist yet.
#
# Usage:
#   scripts/create-test-directory.sh <test-dir-name> <screen-name> <domain> <category>
#
# Example:
#   scripts/create-test-directory.sh \
#     test-form-sheet-grabber-visible \
#     "Grabber visible" \
#     form-sheet \
#     single-feature-tests

set -euo pipefail

usage() {
  cat <<'EOF'
Usage: scripts/create-test-directory.sh <test-dir-name> <screen-name> <domain> <category>

Arguments:
  test-dir-name   Directory name for the new test (e.g. test-form-sheet-grabber-visible).
                  Also used as the `key` in scenario-description.ts.
  screen-name     Human-readable screen name (e.g. "Grabber visible").
                  Used as the `name` in scenario-description.ts. Quote if it contains spaces.
  domain          Domain sub-directory (e.g. form-sheet). Created if missing.
  category         Category directory under apps/src/tests (e.g. single-feature-tests).

Example:
  scripts/create-test-directory.sh test-form-sheet-grabber-visible "Grabber visible" form-sheet single-feature-tests
EOF
}

if [[ "${1:-}" == "-h" || "${1:-}" == "--help" ]]; then
  usage
  exit 0
fi

if [[ $# -ne 4 ]]; then
  echo "Error: expected 4 arguments, got $#." >&2
  echo >&2
  usage
  exit 1
fi

TEST_DIR_NAME="$1"
SCREEN_NAME="$2"
DOMAIN="$3"
CATEGORY="$4"

# Resolve paths relative to the repository root (this script lives in scripts/).
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
REPO_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"

TESTS_ROOT="$REPO_ROOT/apps/src/tests"
TEMPLATE_SCENARIO="$TESTS_ROOT/template/scenario.md"
DOMAIN_DIR="$TESTS_ROOT/$CATEGORY/$DOMAIN"
TARGET_DIR="$DOMAIN_DIR/$TEST_DIR_NAME"

if [[ ! -d "$TESTS_ROOT/$CATEGORY" ]]; then
  echo "Error: category directory does not exist: apps/src/tests/$CATEGORY" >&2
  echo "       Existing categories:" >&2
  find "$TESTS_ROOT" -mindepth 1 -maxdepth 1 -type d -exec basename {} \; | sed 's/^/         - /' >&2
  exit 1
fi

if [[ ! -f "$TEMPLATE_SCENARIO" ]]; then
  echo "Error: scenario.md template not found at apps/src/tests/template/scenario.md" >&2
  exit 1
fi

if [[ -e "$TARGET_DIR" ]]; then
  echo "Error: target directory already exists: ${TARGET_DIR#$REPO_ROOT/}" >&2
  exit 1
fi

# Create the domain directory (if missing) and the test directory.
mkdir -p "$TARGET_DIR"

# 1. Empty index.tsx
: > "$TARGET_DIR/index.tsx"

# 2. scenario-description.ts from template, with name and key filled in.
cat > "$TARGET_DIR/scenario-description.ts" <<EOF
import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: '$SCREEN_NAME',
  key: '$TEST_DIR_NAME',
  details: '',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
EOF

# 3. scenario.md copied from the template (placeholders left intact).
cp "$TEMPLATE_SCENARIO" "$TARGET_DIR/scenario.md"

echo "Created test screen: ${TARGET_DIR#$REPO_ROOT/}"
echo "  - index.tsx (empty)"
echo "  - scenario-description.ts (name='$SCREEN_NAME', key='$TEST_DIR_NAME')"
echo "  - scenario.md (from template)"
