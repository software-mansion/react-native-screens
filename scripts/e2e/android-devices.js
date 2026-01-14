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
  const connectedPhysicalDevices = getDeviceIds((deviceIdAndState) => {
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
      return false;;
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

function detectAndroidEmulatorName() {
  const isEmulatorConfig = process.argv.some(runtimeArg =>
    runtimeArg.includes('android.emu'),
  );
  if (!isEmulatorConfig) return 'INACTIVE CONFIG';
  if (passedAdbSerial) {
    return resolveAvdNameFromDeviceId(passedAdbSerial);
  }
  const passedAvdName = process.env[envVarKeys.avdName];
  if (passedAvdName) {
    return passedAvdName;
  }
  if (isRunningCI) {
    return DEFAULT_CI_AVD_NAME;
  }
  // non-zero length is guaranteed.
  return getAvailableEmulatorNames()[0];
}

function getAvailableEmulatorNames() {
  try {
    const outputText = getCommandLineResponse('emulator -list-avds');
    const avdList = outputText
      .trim()
      .split('\n')
      .map(name => name.trim())
      .filter(Boolean);
    if (avdList.length === 0) {
      throw new Error('No installed AVDs detected on the device');
    }

    return avdList;
  } catch (error) {
    const errorMessage = `Failed to find any Android emulator. Set "${envVarKeys.avdName}" env variable pointing to one. Cause:\n${error}`;
    throw new Error(errorMessage);
  }
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
    .map(line => /** @type {[string, string]} */(line.split('\t')))
    .filter(filterPredicate)
    .map(deviceIdAndState => deviceIdAndState[0])
  }

module.exports = {
  detectAndroidEmulatorName,
  resolveAttachedAndroidDeviceSerial,
};
