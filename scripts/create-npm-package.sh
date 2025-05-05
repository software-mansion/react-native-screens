#!/bin/bash

# This script assumes it is run from the top level repo directory.

yarn install --immutable

if ! CURRENT_VERSION=$(node ./scripts/set-version.js --nightly); then
  exit 1
fi

yarn prepare

npm pack

node ./scripts/set-version.js "$CURRENT_VERSION" >/dev/null

echo "Done!"
