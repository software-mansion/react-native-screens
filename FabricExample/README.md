# React Native Screens example app that uses fabric architecture

## Installing & running application

Before running application you need to install all dependencies. To do that:

- In project's root directory run `yarn install`
- In FabricExample directory run `yarn install`

### Android

To run this application on Android you need to have Java 11 active on your computer. You can check which version you are using by running `javac --version`. You can change it by changing `JAVA_HOME` environment variable or in Android Studio settings.

Then you can run this application by `yarn android` or from Android Studio.

### iOS

To run on iOS:
- Navigate to the `FabricExample` directory and install Ruby dependencies: `rbenv exec bundle install`
- Then, navigate to the `FabricExample/ios` subdirectory and install CocoaPods: `rbenv exec bundle exec pod install`
- Then in `FabricExample` run `yarn ios` or run application from Xcode.

## E2E tests (Detox)

Build the app for the simulator, then run tests:

```bash
yarn build-e2e-ios
yarn test-e2e-ios
```

To **watch the test run** (see the simulator window and taps/UI):

1. **Option A – Force simulator to show:** Shut down simulators so Detox boots one and opens the Simulator app:
   ```bash
   xcrun simctl shutdown all
   yarn test-e2e-ios
   ```
   The Simulator app should open and you’ll see the device and the test interacting.

2. **Option B – Reuse an already-open simulator:** Open the Simulator app and pick the device your config uses (e.g. iPhone 17, from `scripts/e2e/ios-devices.js`). Then run with `--reuse`:
   ```bash
   open -a Simulator
   yarn test-e2e-ios-watch
   ```
   Or run a single test file:
   ```bash
   npx detox test --configuration ios.sim.release --reuse e2e/firstTest.e2e.ts
   ```

Don’t pass `--headless` (or `-H`) if you want to see the simulator; that flag is for CI.

## E2E tests (Maestro)

[Maestro](https://maestro.mobile.dev/) flows are in `e2e/maestro/` (e.g. `first-test.yaml`, equivalent to the Detox `firstTest.e2e.ts`).

**Prerequisites:** Install [Maestro](https://maestro.mobile.dev/getting-started/installing-maestro).

**Run (iOS):**

1. Build the app and install on a simulator:
   ```bash
   yarn build-e2e-ios
   xcrun simctl boot "iPhone 17"   # or any booted simulator
   xcrun simctl install booted ios/build/Build/Products/Release-iphonesimulator/FabricExample.app
   ```
2. Run the flow (Simulator stays visible so you can watch):
   ```bash
   yarn test-e2e-maestro
   ```
   Or: `maestro test e2e/maestro/first-test.yaml`
