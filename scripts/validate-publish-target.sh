#!/bin/bash

# Validates that the current branch and package.json version are appropriate
# for publishing the requested release.
#
# Handles all four release types:
#   - nightly: always valid — nightly publishes are allowed from any branch
#     per the release guide; the script returns success without running the
#     branch/version checks.
#   - stable / beta / rc: rejects the main-branch sentinel version, refuses
#     publishes from `main`, and requires the branch to match a documented
#     release-branch pattern.
#
# Exits 0 if the target is valid; 1 if a validation check fails (with one or
# more error messages); 2 on usage error (missing arguments or unknown
# release-type). For validation failures all checks are reported before exit
# so the operator sees every problem in a single run.
#
# This script assumes it is run from the top level repo directory.
#
# Requires `jq` on PATH (pre-installed on GitHub-hosted ubuntu runners).
#
# Usage: scripts/validate-publish-target.sh <branch> <release-type>
#   <release-type>: one of stable | beta | rc | nightly

set -euo pipefail

if [[ $# -ne 2 ]]; then
  echo "Usage: $0 <branch> <release-type>" >&2
  exit 2
fi

BRANCH="$1"
RELEASE_TYPE="$2"

case "$RELEASE_TYPE" in
  stable|beta|rc|nightly) ;;
  *)
    echo "error: unknown release-type '$RELEASE_TYPE' (expected: stable | beta | rc | nightly)" >&2
    exit 2
    ;;
esac

VERSION=$(jq -r .version package.json)

echo "ref=$BRANCH version=$VERSION release-type=$RELEASE_TYPE"

# Nightly publishes are the designed exception per the release guide: they are
# allowed from any branch (scheduled cron runs from main; manual dispatch can
# target a release branch). No further checks apply.
if [[ "$RELEASE_TYPE" == "nightly" ]]; then
  exit 0
fi

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
