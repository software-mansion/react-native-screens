#!/bin/bash

yarn install --immutable

if ! CURRENT_VERSION=$(node scripts/set-version.js); then
  exit 1
fi

yarn build

npm pack

node scripts/set-version.js "$CURRENT_VERSION" >/dev/null

echo "Done!"
