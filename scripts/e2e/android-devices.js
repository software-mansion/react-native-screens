const { getCommandLineResponse } = require('./command-line-helpers');

const DEFAULT_CI_AVD_NAME = 'e2e_emulator';
const isRunningCI = !!process.env.CI;

const envVarKeys = /** @type {const} */ ({
  adbSerial: 'RNS_DEVICE_SERIAL',
  avdName: 'RNS_AVD_NAME',
});

const passedAdbSerial = process.env[envVarKeys.adbSerial];

function resolveAttachedAndroidDeviceSerial() {
  const isEmulatorConfig = process.argv.some(runtimeArg =>
    runtimeArg.includes('android.att'),
  );
  if (!isEmulatorConfig) return 'INACTIVE CONFIG';
  if (passedAdbSerial) return passedAdbSerial;
  const connectedPhysicalDevices = getDeviceIds(deviceIdAndState => {
    const [deviceId, state] = deviceIdAndState;
    if (deviceId.startsWith('emulator')) {
      return false;
    }
    if (state === 'device') {
      return true;
    } else {
      console.warn(
        `Device "${deviceId}" has state "${state}", but state "device" is expected. This device will be ignored.`,
      );
      return false;
    }
  });
  if (connectedPhysicalDevices.length === 0) {
    throw new Error('No physical devices attached.');
  } else if (connectedPhysicalDevices.length > 1) {
    throw new Error(
      `Connected devices: ${connectedPhysicalDevices.join(', ')}\nUnplug ${
        connectedPhysicalDevices.length - 1
      } device(s) or use ${
        envVarKeys.adbSerial
      } environment variable to select a specific one.`,
    );
  }
  return connectedPhysicalDevices[0];
}

/**
 * Resolves the AVD name Detox should target for an `android.emu.*` run.
 *
 * Resolution order (descending priority), mirroring the iOS simulator resolver:
 * 1. User input - `RNS_DEVICE_SERIAL` (its AVD name is derived from the serial)
 *    or `RNS_AVD_NAME` (used verbatim).
 * 2. An already-booted emulator (its AVD name is derived from the serial). When
 *    several are booted, the first one reported by `adb devices` is used.
 * 3. The default CI emulator (`e2e_emulator`), only when running in CI.
 * 4. The first AVD reported by `emulator -list-avds`.
 *
 * @returns {string} AVD name, or 'INACTIVE CONFIG' when the active config is not
 * an emulator one.
 */
function detectAndroidEmulatorName() {
  const isEmulatorConfig = process.argv.some(runtimeArg =>
    runtimeArg.includes('android.emu'),
  );
  if (!isEmulatorConfig) return 'INACTIVE CONFIG';

  // 1. User input.
  if (passedAdbSerial) {
    return resolveAvdNameFromDeviceId(passedAdbSerial);
  }
  const passedAvdName = process.env[envVarKeys.avdName];
  if (passedAvdName) {
    return passedAvdName;
  }

  // 2. An already-booted emulator - adapt to whatever is running locally.
  const bootedAvdName = detectBootedEmulatorAvdName();
  if (bootedAvdName) {
    return bootedAvdName;
  }

  // 3. The default CI emulator (booted by the CI runner, so step 2 normally
  // wins in CI; this is a safety net when the AVD name cannot be derived).
  if (isRunningCI) {
    return DEFAULT_CI_AVD_NAME;
  }

  // 4. The first available AVD. Non-zero length is guaranteed.
  return getAvailableEmulatorNames()[0];
}

/**
 * @returns {string | undefined} AVD name of a currently booted emulator, or
 * undefined when none is running (or the device list cannot be read).
 */
function detectBootedEmulatorAvdName() {
  let bootedEmulatorIds;
  try {
    bootedEmulatorIds = getDeviceIds(deviceIdAndState => {
      const [deviceId, state] = deviceIdAndState;
      if (!deviceId.startsWith('emulator')) {
        return false;
      }
      if (state === 'device') {
        return true;
      }
      console.warn(
        `Emulator "${deviceId}" has state "${state}", but state "device" is expected. This emulator will be ignored.`,
      );
      return false;
    });
  } catch (error) {
    console.warn(
      `Failed to detect booted emulator from "adb devices"; falling back to other resolution strategies. Cause:\n${error}`,
    );
    return undefined;
  }
  if (bootedEmulatorIds.length === 0) {
    return undefined;
  }
  if (bootedEmulatorIds.length > 1) {
    console.warn(
      `Multiple booted emulators detected: ${bootedEmulatorIds.join(
        ', ',
      )}. Using "${bootedEmulatorIds[0]}". Set "${
        envVarKeys.avdName
      }" or "${envVarKeys.adbSerial}" to select a specific one.`,
    );
  }
  try {
    return resolveAvdNameFromDeviceId(bootedEmulatorIds[0]);
  } catch (error) {
    console.warn(
      `Failed to derive AVD name from booted emulator "${bootedEmulatorIds[0]}"; falling back to other resolution strategies. Cause:\n${error}`,
    );
    return undefined;
  }
}

function getAvailableEmulatorNames() {
  let outputText;
  try {
    outputText = getCommandLineResponse('emulator -list-avds');
  } catch (error) {
    // The command itself failed - naming an AVD directly skips this lookup.
    throw new Error(
      `Failed to list Android emulators. Set "${envVarKeys.avdName}" env variable pointing to one, or make sure the Android SDK "emulator" tool is on your PATH. Cause:\n${error}`,
    );
  }
  const avdList = outputText
    .trim()
    .split('\n')
    .map(name => name.trim())
    .filter(Boolean);
  if (avdList.length === 0) {
    // No AVDs exist, so RNS_AVD_NAME cannot point to one - the user must create
    // an emulator first.
    throw new Error(
      'No installed AVDs detected. Create an emulator in Android Studio before running the tests.',
    );
  }
  return avdList;
}

/**
 * @param {string} deviceId - Device adb identifier, device serial
 * @returns {string} device name (avd name)
 */
function resolveAvdNameFromDeviceId(deviceId) {
  const deviceName = getCommandLineResponse(
    `adb -s ${deviceId} emu avd name`,
  ).split('\r\n')[0];
  if (deviceName) {
    return deviceName;
  }
  throw new Error(`Failed to get emulator name for id "${deviceId}"`);
}

/**
 * @callback AdbDevicesFilterPredicate
 * @param {[string, string]} idAndState
 * @param {number} index element's position in the output list
 * @returns {boolean} true if it should go through the filter and false otherwise
 */

/**
 * @param {AdbDevicesFilterPredicate} [filterPredicate]
 * @returns {string[]} list of device adb serials,
 * for both physical and emulated devices, but only
 * with status "device" (connected and ready)
 */
function getDeviceIds(filterPredicate = () => true) {
  const adbDeviceLines = getCommandLineResponse('adb devices')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
  // Remove header line: "List of devices attached"
  adbDeviceLines.shift();
  if (adbDeviceLines.length === 0) {
    throw new Error('The attached device list is empty');
  }
  return adbDeviceLines
    .map(line => /** @type {[string, string]} */ (line.split('\t')))
    .filter(filterPredicate)
    .map(deviceIdAndState => deviceIdAndState[0]);
}

module.exports = {
  detectAndroidEmulatorName,
  resolveAttachedAndroidDeviceSerial,
};
