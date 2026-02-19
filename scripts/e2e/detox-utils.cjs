const AppleDeviceUtil = require('./ios-devices');
const AndroidDeviceUtil = require('./android-devices');

const isRunningCI = process.env.CI != null;

// Assumes that local development is done on arm64-v8a.
const apkBuildArchitecture = isRunningCI ? 'x86_64' : 'arm64-v8a';
// test-butler requires AOSP emulator image, which is not available to download for arm64-v8a in Android Studio SDK Manager, therefore
// it is assumed here that arm64-v8a AOSP emulator is not available in local setup.
const testButlerApkPath = isRunningCI
  ? ['../FabricExample/e2e/test-butler-app-2.2.1.apk']
  : undefined;

/**
 * @typedef {import('../../FabricExample/node_modules/detox')} Detox
 */

/**
 * The output of this function can be controlled through couple of env vars.
 *
 * Android:
 *
 * * `RNS_DEVICE_SERIAL` env var can be specified in case of running
 * tests with an attached Android device. It can also be an emulator.
 * The expected value here is the same as you would pass to `adb -s`.
 * You can find device serial by running `adb devices` command.
 * Example: RNS_DEVICE_SERIAL=33221FDH3000VT
 *
 * * `RNS_AVD_NAME` env var can be specified in case of running tests on Android emulator.
 * The expected value here is the same as displayed in Android Studio or listed by
 * `emulator -list-avds`. Recommended for regular needs.
 * Example: RNS_AVD_NAME=Pixel_8
 *
 * iOS:
 *
 * * `RNS_APPLE_SIM_NAME` env var can be set in case of running tests on iOS simulator.
 * The expected value here is exactly as one listed in XCode.
 * Example: RNS_APPLE_SIM_NAME="iPhone 16 Pro"
 *
 * * `RNS_IOS_VERSION` env var can be specified to request particular iOS version
 * for the given simulator. Note that required SDK & simulators must be installed.
 * Example: RNS_IOS_VERSION="iOS 26.1"
 *
 * * Remember:
 * Device versions are assigned to iOS versions.
 * That means running a version that has never been available
 * on a given device will result in an error.
 * Example: `RNS_IOS_VERSION="iOS 18.6" RNS_APPLE_SIM_NAME="iPhone 17 Pro" yarn test-e2e-ios` will fail
 * as iPhone 17 Pro was released with iOS 26
 *
 * @param {string} applicationName name (FabricExample)
 * @returns {Detox.DetoxConfig}
 */
function commonDetoxConfigFactory(applicationName) {
  return {
    testRunner: {
      args: {
        $0: 'jest',
        config: 'e2e/jest.config.js',
      },
      jest: {
        setupTimeout: 360000,
      },
    },
    apps: {
      'ios.debug': {
        type: 'ios.app',
        binaryPath: `ios/build/Build/Products/Debug-iphonesimulator/${applicationName}.app`,
        build: `xcodebuild -workspace ios/${applicationName}.xcworkspace -UseNewBuildSystem=YES -scheme ${applicationName} -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build -quiet | xcpretty`,
      },
      'ios.release': {
        type: 'ios.app',
        binaryPath: `ios/build/Build/Products/Release-iphonesimulator/${applicationName}.app`,
        build: `export RCT_NO_LAUNCH_PACKAGER=true && xcodebuild ONLY_ACTIVE_ARCH=YES -workspace ios/${applicationName}.xcworkspace -UseNewBuildSystem=YES -scheme ${applicationName} -configuration Release -sdk iphonesimulator -derivedDataPath ios/build -quiet | xcpretty`,
      },
      'android.debug': {
        type: 'android.apk',
        binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
        build: `cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug -PreactNativeArchitectures=${apkBuildArchitecture} && cd ..`,
        reversePorts: [8081],
      },
      'android.release': {
        type: 'android.apk',
        binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
        build: `cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release -PreactNativeArchitectures=${apkBuildArchitecture} && cd ..`,
      },
    },
    devices: {
      simulator: {
        type: 'ios.simulator',
        device: {
          type: AppleDeviceUtil.resolveAppleSimulatorName(),
          os: AppleDeviceUtil.getIOSVersion(),
        },
      },
      attached: {
        type: 'android.attached',
        device: {
          adbName: AndroidDeviceUtil.resolveAttachedAndroidDeviceSerial(),
        },
        utilBinaryPaths: testButlerApkPath,
      },
      emulator: {
        type: 'android.emulator',
        device: {
          avdName: AndroidDeviceUtil.detectAndroidEmulatorName(),
        },
        utilBinaryPaths: testButlerApkPath,
      },
    },
    configurations: {
      'ios.sim.debug': {
        device: 'simulator',
        app: 'ios.debug',
      },
      'ios.sim.release': {
        device: 'simulator',
        app: 'ios.release',
      },
      'android.att.debug': {
        device: 'attached',
        app: 'android.debug',
      },
      'android.att.release': {
        device: 'attached',
        app: 'android.release',
      },
      'android.emu.debug': {
        device: 'emulator',
        app: 'android.debug',
      },
      'android.emu.release': {
        device: 'emulator',
        app: 'android.release',
      },
    },
  };
}

module.exports = {
  commonDetoxConfigFactory,
  isRunningCI,
};
