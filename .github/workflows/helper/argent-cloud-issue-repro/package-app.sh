#!/usr/bin/env bash
# Packages everything that build-app.sh staged (one .app directory, and the source archive of a
# Debug build) into the one .tar.gz that argent-cloud uploads to the simulator host.
#
# Usage: package-app.sh <staging-dir> <output.tar.gz>
set -euo pipefail

STAGING="${1:?usage: package-app.sh <staging-dir> <output.tar.gz>}"
OUTPUT="${2:?usage: package-app.sh <staging-dir> <output.tar.gz>}"

entries=()
while IFS= read -r entry; do
  entries+=("$entry")
done < <(cd "$STAGING" && ls -A)
[ "${#entries[@]}" -gt 0 ] || { echo "::error::nothing staged in $STAGING"; exit 1; }
ls -d "$STAGING"/*.app > /dev/null 2>&1 || { echo "::error::no .app in $STAGING"; exit 1; }

mkdir -p "$(dirname "$OUTPUT")"
# COPYFILE_DISABLE and --no-mac-metadata keep macOS resource forks (._* entries) out of the archive.
COPYFILE_DISABLE=1 tar --no-mac-metadata -czf "$OUTPUT" -C "$STAGING" "${entries[@]}"
echo "Packaged ${entries[*]} into $OUTPUT"
