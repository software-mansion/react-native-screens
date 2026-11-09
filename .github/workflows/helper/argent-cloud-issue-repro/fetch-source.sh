#!/usr/bin/env bash
# Fetches the reproduction that resolve-source.ts found into a read-only tree for the planning agent.
#
# Nothing from the tree is ever installed, built or executed, here or later: the build job scaffolds a
# fresh app and copies only the files that the agent writes. This script still strips what could
# steer the agent or leak into its plan: git metadata and hooks, symbolic links, instruction files
# for AI agents, lockfiles and package-manager configuration.
#
# Usage: fetch-source.sh <source.json> <destination-dir>
# Writes `localRoot` and `file` into source.json when the link points inside the repository.
set -euo pipefail

SOURCE_FILE="${1:?usage: fetch-source.sh <source.json> <destination-dir>}"
DESTINATION="${2:?usage: fetch-source.sh <source.json> <destination-dir>}"

readonly NAME_RE='^[A-Za-z0-9_.-]+$'
readonly REF_RE='^[A-Za-z0-9][A-Za-z0-9_./+-]*$'

# A Snack has no fetchable source and `none` means no link; both leave the agent with the issue text.
main() {
  local kind
  kind=$(jq -r .kind "$SOURCE_FILE")
  case "$kind" in
    repository) fetch_repository ;;
    gist) fetch_gist ;;
    snack | none)
      echo "reproduction source is '$kind'; nothing to fetch"
      ;;
    *) fail "unknown source kind '$kind'" ;;
  esac
}

# Clones the linked repository at the linked ref, sanitizes it, and records in source.json where
# the agent finds it (localRoot) and which file the link pointed at (file).
fetch_repository() {
  local owner repo link_kind
  owner=$(jq -r .owner "$SOURCE_FILE")
  repo=$(jq -r .repo "$SOURCE_FILE")
  link_kind=$(jq -r .linkKind "$SOURCE_FILE")
  [[ "$owner" =~ $NAME_RE && "$repo" =~ $NAME_RE ]] || fail "invalid repository name '$owner/$repo'"
  local remote="https://github.com/$owner/$repo.git"

  local -a segments=()
  while IFS= read -r segment; do
    [ -n "$segment" ] && segments+=("$segment")
  done < <(jq -r '.refAndPath[]' "$SOURCE_FILE")

  local ref="" path=""
  if [ "${#segments[@]}" -gt 0 ] && ! resolve_ref_and_path "$remote" "$link_kind" "${segments[@]}"; then
    echo "::warning::the link into $remote does not name a fetchable ref; the agent works from the issue text only"
    jq '. + {fetched: false}' "$SOURCE_FILE" > "$SOURCE_FILE.tmp" && mv "$SOURCE_FILE.tmp" "$SOURCE_FILE"
    return 0
  fi

  if ! clone "$remote" "$ref" "$DESTINATION/repository"; then
    echo "::warning::could not fetch $remote at '${ref:-default branch}'; the agent works from the issue text only"
    rm -rf "$DESTINATION/repository"
    jq '. + {fetched: false}' "$SOURCE_FILE" > "$SOURCE_FILE.tmp" && mv "$SOURCE_FILE.tmp" "$SOURCE_FILE"
    return 0
  fi
  sanitize "$DESTINATION/repository"

  local local_root="$DESTINATION/repository" file=""
  if [ -n "$path" ]; then
    if [ "$link_kind" = "blob" ]; then
      if [ -f "$DESTINATION/repository/$path" ]; then
        file="$path"
      else
        echo "::warning::the linked file '$path' is not in the repository"
      fi
    elif [ -d "$DESTINATION/repository/$path" ]; then
      local_root="$DESTINATION/repository/$path"
    else
      echo "::warning::the linked directory '$path' is not in the repository"
    fi
  fi
  jq --arg ref "$ref" --arg path "$path" --arg root "$local_root" --arg file "$file" --arg commit "$CLONED_COMMIT" \
    '. + {fetched: true, localRoot: $root, commit: $commit} + ({ref: $ref, path: $path, file: $file} | with_entries(select(.value != "")))' \
    "$SOURCE_FILE" > "$SOURCE_FILE.tmp" && mv "$SOURCE_FILE.tmp" "$SOURCE_FILE"
  [ -s "$SOURCE_FILE" ] || fail "could not update $SOURCE_FILE"
  echo "fetched $remote at '${ref:-default branch}' (commit $CLONED_COMMIT) into $local_root${file:+ (file: $file)}"
}

# Sets `ref` and `path`. A branch name can contain slashes, so the longest prefix of the segments
# that names a branch or a tag wins; a 7-40 hex first segment is a commit; otherwise the first
# segment is taken as the ref and git decides whether it exists. Returns 1 when a commit link does
# not name a commit, or when the ref would not pass the checks of `clone`; the caller then treats
# the link as unfetchable rather than failing the run over a reporter's typo.
resolve_ref_and_path() {
  local remote="$1" link_kind="$2"
  shift 2
  local -a segments=("$@")
  local refs
  refs=$(GIT_TERMINAL_PROMPT=0 timeout "$CLONE_TIMEOUT_SECONDS" git -c protocol.allow=never -c protocol.https.allow=always \
    ls-remote --heads --tags "$remote" 2>/dev/null | awk '{ print $2 }' | sed -E 's#^refs/(heads|tags)/##; s#\^\{\}$##' | sort -u || true)
  local count="${#segments[@]}" n
  for ((n = count; n >= 1; n--)); do
    local candidate
    candidate=$(IFS=/; echo "${segments[*]:0:$n}")
    if grep -qxF -- "$candidate" <<< "$refs"; then
      ref="$candidate"
      path=$(IFS=/; echo "${segments[*]:$n}")
      break
    fi
  done
  if [ -z "$ref" ]; then
    ref="${segments[0]}"
    path=$(IFS=/; echo "${segments[*]:1}")
    if [ "$link_kind" = "commit" ] && ! [[ "$ref" =~ ^[0-9a-f]{7,40}$ ]]; then
      echo "a commit link must name a commit, got '$ref'"
      return 1
    fi
  fi
  # Also for a ref that exists on the remote: a valid branch name such as `feat#x` would otherwise
  # reach `clone`, which fails the run on it.
  if ! [[ "$ref" =~ $REF_RE ]] || [[ "$ref" == *".."* ]]; then
    echo "'$ref' is not a valid ref"
    return 1
  fi
}

fetch_gist() {
  local id
  id=$(jq -r .id "$SOURCE_FILE")
  # Case-insensitive, like the check in resolve-source.ts.
  [[ "$id" =~ ^[0-9a-fA-F]{20,40}$ ]] || fail "invalid gist id '$id'"
  if ! clone "https://gist.github.com/$id.git" "" "$DESTINATION/repository"; then
    echo "::warning::could not fetch gist $id; the agent works from the issue text only"
    rm -rf "$DESTINATION/repository"
    jq '. + {fetched: false}' "$SOURCE_FILE" > "$SOURCE_FILE.tmp" && mv "$SOURCE_FILE.tmp" "$SOURCE_FILE"
    return 0
  fi
  sanitize "$DESTINATION/repository"
  jq --arg root "$DESTINATION/repository" --arg commit "$CLONED_COMMIT" '. + {fetched: true, localRoot: $root, commit: $commit}' \
    "$SOURCE_FILE" > "$SOURCE_FILE.tmp" && mv "$SOURCE_FILE.tmp" "$SOURCE_FILE"
  [ -s "$SOURCE_FILE" ] || fail "could not update $SOURCE_FILE"
  echo "fetched gist $id (commit $CLONED_COMMIT) into $DESTINATION/repository"
}

# Shallow clone with hooks, submodules, LFS and every non-https transport disabled, under a time
# limit and a blob-size filter, followed by a size check: a reporter can link any repository, and
# a huge one must not stall or fill the runner. A clone that misses a limit counts as "could not
# fetch", and the agent works from the issue text.
#
# Sets CLONED_COMMIT to the commit that was checked out. A branch link is resolved at run time, so
# the reporter can change what the branch points at after a maintainer read it; the commit goes into
# source.json and the report so that what the agent read can be audited.
readonly CLONE_TIMEOUT_SECONDS=300
readonly MAX_TREE_MB=200
readonly MAX_TREE_FILES=20000
CLONED_COMMIT=""

clone() {
  local remote="$1" ref="$2" target="$3"
  [ -z "$ref" ] || [[ "$ref" =~ $REF_RE ]] || fail "invalid ref '$ref'"
  [[ "$ref" != *".."* ]] || fail "invalid ref '$ref'"
  local -a git=(
    timeout "$CLONE_TIMEOUT_SECONDS"
    git
    -c core.hooksPath=/dev/null
    -c protocol.allow=never
    -c protocol.https.allow=always
    -c submodule.recurse=false
    -c filter.lfs.smudge=
    -c filter.lfs.process=
    -c filter.lfs.required=false
    -c core.symlinks=false
  )
  if [ -z "$ref" ] || [[ ! "$ref" =~ ^[0-9a-f]{7,40}$ ]]; then
    GIT_TERMINAL_PROMPT=0 GIT_LFS_SKIP_SMUDGE=1 "${git[@]}" clone --quiet --depth 1 --no-tags --no-recurse-submodules \
      --filter=blob:limit=1m ${ref:+--branch "$ref"} "$remote" "$target" || return 1
  else
    GIT_TERMINAL_PROMPT=0 GIT_LFS_SKIP_SMUDGE=1 "${git[@]}" init --quiet "$target" || return 1
    (
      cd "$target"
      GIT_TERMINAL_PROMPT=0 GIT_LFS_SKIP_SMUDGE=1 "${git[@]}" fetch --quiet --depth 1 --no-tags --filter=blob:limit=1m "$remote" "$ref"
      GIT_LFS_SKIP_SMUDGE=1 "${git[@]}" checkout --quiet FETCH_HEAD
    ) || return 1
  fi
  CLONED_COMMIT=$(git -C "$target" -c core.hooksPath=/dev/null rev-parse HEAD 2>/dev/null || true)
  [[ "$CLONED_COMMIT" =~ ^[0-9a-f]{40}$ ]] || { echo "::warning::could not read the commit of the clone"; return 1; }
  local size files
  size=$(du -sm "$target" | cut -f1)
  files=$(find "$target" -type f | wc -l | tr -d ' ')
  if [ "$size" -gt "$MAX_TREE_MB" ] || [ "$files" -gt "$MAX_TREE_FILES" ]; then
    echo "::warning::the clone is ${size} MB and ${files} files, over the limit of ${MAX_TREE_MB} MB / ${MAX_TREE_FILES} files"
    return 1
  fi
}

# Strips everything that is not plain source: nothing here is ever executed, but the planning agent
# reads this tree, so files that could steer it or hide a dependency outside npm must go first.
sanitize() {
  local tree="$1"
  rm -rf "$tree/.git"
  # Symbolic links could point outside the tree.
  find "$tree" -type l -delete
  # Instruction files for AI agents. The planning agent must never read them, and Claude Code loads
  # a CLAUDE.md on its own when it reads files next to it, so they go before the agent starts.
  find "$tree" \( -iname 'CLAUDE.md' -o -iname 'CLAUDE.local.md' -o -iname 'AGENTS.md' -o -iname 'AGENT.md' \
    -o -iname 'GEMINI.md' -o -iname 'copilot-instructions.md' -o -iname '.cursorrules' -o -iname '.windsurfrules' \
    -o -iname '.clinerules' -o -iname '.mcp.json' \) -type f -delete
  find "$tree" \( -iname '.claude' -o -iname '.cursor' -o -iname '.windsurf' -o -iname '.clinerules' \
    -o -iname '.codex' -o -iname '.gemini' -o -iname '.github' -o -iname '.husky' -o -iname '.yarn' \
    -o -iname 'node_modules' -o -iname 'Pods' -o -iname '.expo' \) -type d -prune -exec rm -rf {} +
  # Lockfiles and package-manager configuration: they are never used, and a lockfile can pin a
  # dependency to a tarball outside the registry, which the agent must not copy into the plan.
  find "$tree" \( -iname 'package-lock.json' -o -iname 'npm-shrinkwrap.json' -o -iname 'yarn.lock' \
    -o -iname 'pnpm-lock.yaml' -o -iname 'bun.lock' -o -iname 'bun.lockb' -o -iname 'Podfile.lock' \
    -o -iname 'Gemfile.lock' -o -iname '*.lockfile' -o -iname 'Cargo.lock' -o -iname 'poetry.lock' \
    -o -iname 'Pipfile.lock' -o -iname 'composer.lock' -o -iname 'flake.lock' -o -iname 'packages.lock.json' \
    -o -iname '.npmrc' -o -iname '.yarnrc' -o -iname '.yarnrc.yml' -o -iname '.pnpmfile.cjs' \
    -o -iname '.env' -o -iname '.env.*' \) -type f -delete
  # Binaries and archives are of no use to a planner that only reads source.
  find "$tree" \( -iname '*.tgz' -o -iname '*.tar' -o -iname '*.tar.gz' -o -iname '*.zip' -o -iname '*.jar' \
    -o -iname '*.aar' -o -iname '*.apk' -o -iname '*.ipa' -o -iname '*.app' -o -iname '*.framework' \
    -o -iname '*.xcframework' -o -iname '*.dylib' -o -iname '*.so' -o -iname '*.node' -o -iname '*.wasm' \
    -o -iname '*.exe' -o -iname '*.dll' -o -iname '*.bin' \) -prune -exec rm -rf {} +
  chmod -R a-x+X "$tree" 2>/dev/null || true
  echo "sanitized $tree: $(find "$tree" -type f | wc -l | tr -d ' ') file(s) left"
}

fail() {
  echo "::error::$1"
  exit 1
}

main "$@"
