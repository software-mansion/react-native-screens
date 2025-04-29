#!/bin/bash

yarn install --immutable

if ! CURRENT_VERSION=$(node ./set-version.js --nightly); then
  exit 1
fi

yarn prepare

npm pack

node ./set-version.js "$CURRENT_VERSION" >/dev/null

echo "Done!"
