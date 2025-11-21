const AppleDeviceUtil = require('./ios-devices');
const AndroidDeviceUtil = require('./android-devices');

const isRunningCI = process.env.CI != null;

// Assumes that local developement is done on arm64-v8a.
const apkBulidArchitecture = isRunningCI ? 'x86_64' : 'arm64-v8a';
// test-butler requires AOSP emulator image, which is not available to download for arm64-v8a in Android Studio SDK Manager, therefore
// it is assumed here that arm64-v8a AOSP emulator is not available in local setup.
const testButlerApkPath = isRunningCI ? ['../Example/e2e/apps/test-butler-app-2.2.1.apk'] : undefined;

/**
 * The output of this function can be controlled through couple of env vars.
 *
 * * `RNS_DEVICE_SERIAL` env var can be specified in case of running 
 * tests with an attached Android device. It can also be an emulator.
 * The expected value here is the same as you would pass to `adb -s`.
 * You can find device serial by running `adb devices` command.
 *
 * * `RNS_AVD_NAME` env var can be specified in case of running tests on Android emulator. 
 * The exepected value here is the same as displayed in Android Studio or listed by
 * `emulator -list-avds`.
 *
 * * `RNS_APPLE_SIM_NAME` env var can be set in case of running tests on iOS simulator.
 * The expected value here is exactly as one listed in XCode.
 *
 * * `RNS_IOS_VERSION` env var can be specified to request particular iOS version
 * for the given simulator. Note that required SDK & simulators must be installed.
 *
 * @param {string} applicationName name (FabricExample / ScreensExample)
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
        binaryPath:
          `ios/build/Build/Products/Debug-iphonesimulator/${applicationName}.app`,
        build:
          `xcodebuild -workspace ios/${applicationName}.xcworkspace -UseNewBuildSystem=YES -scheme ${applicationName} -configuration Debug -sdk iphonesimulator -derivedDataPath ios/build -quiet | xcpretty`,
      },
      'ios.release': {
        type: 'ios.app',
        binaryPath:
          `ios/build/Build/Products/Release-iphonesimulator/${applicationName}.app`,
        build:
          `export RCT_NO_LAUNCH_PACKAGER=true && xcodebuild ONLY_ACTIVE_ARCH=YES -workspace ios/${applicationName}.xcworkspace -UseNewBuildSystem=YES -scheme ${applicationName} -configuration Release -sdk iphonesimulator -derivedDataPath ios/build -quiet | xcpretty`,
      },
      'android.debug': {
        type: 'android.apk',
        binaryPath: 'android/app/build/outputs/apk/debug/app-debug.apk',
        build:
          `cd android && ./gradlew assembleDebug assembleAndroidTest -DtestBuildType=debug -PreactNativeArchitectures=${apkBulidArchitecture} && cd ..`,
        reversePorts: [8081],
      },
      'android.release': {
        type: 'android.apk',
        binaryPath: 'android/app/build/outputs/apk/release/app-release.apk',
        build:
          `cd android && ./gradlew assembleRelease assembleAndroidTest -DtestBuildType=release -PreactNativeArchitectures=${apkBulidArchitecture} && cd ..`,
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
          adbName: AndroidDeviceUtil.resolveAndroidDeviceSerial(),
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
      'ios.release': {
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
      'android.release': {
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
