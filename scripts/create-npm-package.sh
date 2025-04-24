#!/bin/bash

yarn install --immutable

if ! CURRENT_VERSION=$(node ./set-version.js); then
  exit 1
fi

yarn build

npm pack

node ./set-version.js "$CURRENT_VERSION" >/dev/null

echo "Done!"
