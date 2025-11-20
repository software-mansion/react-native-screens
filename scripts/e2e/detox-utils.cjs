const { iosDevice } = require('./ios-devices');
const { detectAndroidEmulatorName } = require('./android-devices');

const CI_AVD_NAME = 'e2e_emulator';

const isRunningCI = process.env.CI != null;

// Assumes that local developement is done on arm64-v8a.
const apkBulidArchitecture = isRunningCI ? 'x86_64' : 'arm64-v8a';
// test-butler requires AOSP emulator image, which is not available to download for arm64-v8a in Android Studio SDK Manager, therefore
// it is assumed here that arm64-v8a AOSP emulator is not available in local setup.
const testButlerApkPath = isRunningCI ? ['../Example/e2e/apps/test-butler-app-2.2.1.apk'] : undefined;

/**
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
        device: iosDevice,
      },
      attached: {
        type: 'android.attached',
        device: {
          adbName: CI_AVD_NAME,
        },
        utilBinaryPaths: testButlerApkPath,
      },
      emulator: {
        type: 'android.emulator',
        device: {
          avdName: detectAndroidEmulatorName(),
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
  }
}

module.exports = {
  commonDetoxConfigFactory,
  isRunningCI,
}
