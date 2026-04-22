#!/bin/bash

# Validates that the current branch and package.json version are appropriate
# for publishing a non-nightly (stable / beta / rc) release.
#
# Exits 0 if the target is valid; non-zero (with one or more error messages)
# otherwise. All failures are reported before exit so the operator sees every
# problem in a single run.
#
# This script assumes it is run from the top level repo directory.
#
# Usage: scripts/validate-publish-target.sh <branch> <release-type>

set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <branch> <release-type>" >&2
  exit 2
fi

BRANCH="$1"
RELEASE_TYPE="$2"
VERSION=$(jq -r .version package.json)

echo "ref=$BRANCH version=$VERSION release-type=$RELEASE_TYPE"

emit_error() {
  if [[ -n "${GITHUB_ACTIONS:-}" ]]; then
    echo "::error::$1"
  else
    echo "error: $1" >&2
  fi
}

FAIL=0

if [[ "$VERSION" == 1000.* ]]; then
  emit_error "package.json version is '$VERSION' — this is the main-branch sentinel. Bump the version on a release branch before publishing a $RELEASE_TYPE release."
  FAIL=1
fi

if [[ "$BRANCH" == "main" ]]; then
  emit_error "Refusing to publish a $RELEASE_TYPE release from 'main'. Release from a *-stable or v*-main branch."
  FAIL=1
fi

if ! [[ "$BRANCH" =~ ^(v[0-9]+-main|[0-9]+\.[0-9]+-stable)$ ]]; then
  emit_error "Branch '$BRANCH' does not match an allowed release-branch pattern (v<major>-main or <major>.<minor>-stable). Publish from a dedicated release branch."
  FAIL=1
fi

exit $FAIL
