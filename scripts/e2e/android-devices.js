const { getCommandLineResponse } = require('./command-line-helpers');
const { getDeviceIds, bootDevices } = require('./turn-on-android-emulators');

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
  const connectedPhysicalDevices = getDeviceIds().filter(
    deviceID => !deviceID.startsWith('emulator'),
  );
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
  return isRunningCI ? DEFAULT_CI_AVD_NAME : detectLocalAndroidEmulator();
}

function detectLocalAndroidEmulator() {
  bootInactiveEmulators();
  // non-zero length is guaranteed. It will be replaced in the next change anyway.
  return getAvailableEmulatorNames()[0];
}

/**
 * attaches all available emulators to be able to call them via adb
 */
function bootInactiveEmulators() {
  const allAvailableEmulatorNames = getAvailableEmulatorNames();
  try {
    const alreadyRunningDevices = new Set(
      getDeviceIds().map(resolveAvdNameFromDeviceId)
    );
    const inactiveEmulators = allAvailableEmulatorNames.filter(
      deviceName => !alreadyRunningDevices.has(deviceName),
    );
    bootDevices(inactiveEmulators);
  } catch (_) {
    bootDevices(allAvailableEmulatorNames);
  }
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

module.exports = {
  detectAndroidEmulatorName,
  resolveAttachedAndroidDeviceSerial,
};
