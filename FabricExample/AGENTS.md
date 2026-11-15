# FabricExample

Example app used to exercise and test `react-native-screens`. It consumes:

- the JS of `../apps/` through path aliases,
- the library from `../src` (and its native code from `../ios`, `../android`, `../common`, `../cpp`),
- React Navigation from the `../react-navigation` git submodule.

App identifiers: iOS `org.reactjs.native.example.FabricExample`, Android `com.fabricexample`.

## Picking a test screen

`apps/App.tsx` imports the screen the app renders. Swap its `Example` import to a screen from
`apps/src/tests/{issue-tests,single-feature-tests,component-integration-tests}` and revert it afterwards.

Render test screens directly from `apps/App.tsx`, not through the example app's navigator. The app shell is a v4
(legacy) native stack, and a v5 stack nested in a v4 stack is not supported.

## Setup (fresh clone or worktree)

From the repository root:

```bash
yarn install
yarn submodules
cd FabricExample && yarn install
cd ios && rbenv exec bundle install
LANG=en_US.UTF-8 LC_ALL=en_US.UTF-8 rbenv exec bundle exec pod install
```

- Without the UTF-8 locale, CocoaPods can fail with `Encoding::CompatibilityError`.
- Re-run `pod install` only when native source files are **added or removed** in the root `ios/` or `common/`
  directories.
- The React Native version checks of Worklets / Reanimated can fail at random ("not compatible" in `pod install`,
  `assertMinimalReactNativeVersionTask` with no message in Gradle). This has been a Node crash in the check script,
  not a real version mismatch. Retry.

## iOS

Run from `FabricExample/`:

```bash
# debug
xcodebuild -workspace ios/FabricExample.xcworkspace \
  -scheme FabricExample -configuration Debug -sdk iphonesimulator

# release (JS bundled, no Metro)
xcodebuild -workspace ios/FabricExample.xcworkspace \
  -scheme FabricExample -configuration Release -sdk iphonesimulator \
  RCT_NO_LAUNCH_PACKAGER=true
```

To build a second checkout without touching the first one's app or Metro, add `-derivedDataPath <dir>` and
`RCT_METRO_PORT=<port>`, and run Metro on that port.

## Android

Run from `FabricExample/android/`:

```bash
./gradlew :app:assembleDebug     # add -PreactNativeArchitectures=arm64-v8a for a single ABI
./gradlew :app:assembleRelease
```

- The debug APK always loads JS from port 8081; `-PreactNativeDevServerPort` does not change that. To use Metro on
  another port, map it: `adb -s <serial> reverse tcp:8081 tcp:<port>`.
- When only `../apps/` JS changed, the release bundle task can report UP-TO-DATE and ship a stale bundle. Force it
  with `./gradlew :app:createBundleReleaseJsAndAssets --rerun :app:assembleRelease`.
- The release build does not run R8 (`enableProguardInReleaseBuilds = false` in `app/build.gradle`).

## Run

`yarn ios` / `yarn android` (from `FabricExample/`) build, install and launch the debug app through the React
Native CLI.

## Library debug logs

- iOS: `RNS_DEBUG_LOGGING=1 rbenv exec bundle exec pod install` (the podspec reads it at install time), then rebuild.
  Run `pod install` without it to turn the logs off again.
- Android: `./gradlew :app:assembleDebug -PrnsDebugLogsEnabled=true`.

## Metro

```bash
yarn start                                 # port 8081
npx react-native start --port <port>
```

In a worktree nested inside the main checkout (e.g. `.claude/worktrees/*`), Metro can hang on
"Waiting for Watchman `watch-project`", because Watchman resolves the root to the main checkout. Start it with a
config that disables Watchman, e.g. an untracked `metro.nowatchman.config.js`:

```js
const config = require('./metro.config.js');
module.exports = { ...config, resolver: { ...config.resolver, useWatchman: false } };
```

```bash
npx react-native start --port <port> --config metro.nowatchman.config.js
```
