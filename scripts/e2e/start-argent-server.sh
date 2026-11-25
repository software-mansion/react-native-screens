#!/usr/bin/env bash
# Starts an Argent tool-server in the background and waits until it serves.
# Used by .github/actions/argent-server, after the Argent CLI was installed.
#
#   scripts/e2e/start-argent-server.sh [port] [simulator-server log level]
#
# The server is started here and its log exported as ARGENT_SERVER_LOG, so
# `flow run` reuses it instead of starting one in-process, which has to come up
# within a fixed window a cold runner can miss - the first run downloads the
# simulator-server binary.
#
# Not `argent server start --detach`: it gives the server a hard 15s to come up
# and then kills its whole process group, and backgrounding the CLI does not
# help because the timeout lives in the process we backgrounded. Started under
# nohup there is no deadline and the server's own output lands in our log.
set -euo pipefail

PORT="${1:-3001}"
SIMULATOR_SERVER_LOG="${2:-}"
LOG="${RUNNER_TEMP:-/tmp}/argent-server.log"

# Exported before anything can fail, so the caller's log-collecting step can
# find it even when startup is what went wrong.
if [ -n "${GITHUB_ENV:-}" ]; then
  echo "ARGENT_SERVER_LOG=$LOG" >> "$GITHUB_ENV"
fi

if [ -n "$SIMULATOR_SERVER_LOG" ]; then
  export SIMSERVER_LOG="$SIMULATOR_SERVER_LOG"
fi

nohup argent server start --no-auth --port "$PORT" > "$LOG" 2>&1 &
SERVER_PID=$!

echo "Waiting for Argent tool-server on :$PORT..."
# 3 min budget. Poll liveness too, so a server that dies on startup fails right
# away with its log instead of at the end of the budget.
for _ in $(seq 1 90); do
  if ! kill -0 "$SERVER_PID" 2>/dev/null; then
    echo "Argent tool-server exited during startup" >&2
    cat "$LOG" >&2
    exit 1
  fi
  if curl -fsS "http://127.0.0.1:$PORT/tools" >/dev/null 2>&1; then
    echo "tool-server is ready"
    exit 0
  fi
  sleep 2
done
echo "Argent tool-server failed to become ready in time" >&2
cat "$LOG" >&2
exit 1
