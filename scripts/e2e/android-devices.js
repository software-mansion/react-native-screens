const { getCommandLineResponse } = require('./command-line-helpers');

const DEFAULT_CI_AVD_NAME = 'e2e_emulator';
const isRunningCI = !!process.env.CI;

const envVarKeys = /** @type {const} */ ({
  adbSerial: 'RNS_DEVICE_SERIAL',
  avdName: 'RNS_AVD_NAME',
});

const passedAdbSerial = process.env[envVarKeys.adbSerial];

function resolveAttachedAndroidDeviceSerial() {
  if (passedAdbSerial) return passedAdbSerial;
  const connectedNonEmulators = getDeviceIds().filter(
    deviceID => !deviceID.startsWith('emulator'),
  );
  if (connectedNonEmulators.length === 0) {
    throw new Error('No physical devices attached.');
  } else if (connectedNonEmulators.length === 1) {
    return connectedNonEmulators[0];
  } else
    throw new Error(
      `Connected devices: ${connectedNonEmulators.join(', ')}\nUnplug ${
        connectedNonEmulators.length - 1
      } device(s) or use ${
        envVarKeys.adbSerial
      } environment variable to select a specific one.`,
    );
}

function detectAndroidEmulatorName() {
  const isEmulatorConfig = process.argv.some(runtimeArg =>
    runtimeArg.includes('android.emu')
  );
  if (!isEmulatorConfig) return 'INACTIVE CONFIG';
  if (passedAdbSerial) {
    return getDeviceName(passedAdbSerial);
  }
  return process.env[envVarKeys.avdName] || isRunningCI
    ? DEFAULT_CI_AVD_NAME
    : detectLocalAndroidEmulator();
}

function detectLocalAndroidEmulator() {
  return getAvailableEmulatorNames()[0];
}

function getAvailableEmulatorNames() {
  try {
    const outputText = getCommandLineResponse('emulator -list-avds');
    const avdList = outputText
      .trim()
      .split('\n')
      .map(name => name.trim());
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
 * @returns {string[]}
 */
function getDeviceIds() {
  const nonEmptyLines = getCommandLineResponse('adb devices')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);
  nonEmptyLines.shift(); // The first line is always the "List of devices attached" (header) so we ignore it
  if (nonEmptyLines.length === 0) {
    throw new Error('Seems that the attached device list is empty');
  }
  return nonEmptyLines.map(line => {
    const [id, state] = line.split('\t');
    if (state !== 'device') {
      console.warn(
        `THE DEVICE (ID ${id}) HAS STATUS "${state}". ITS STATUS SHOULD BE 'device' TO CONTINUE!`,
      );
    }
    return id;
  });
}

/**
 * @param {string} device adb identifier, device serial
 * @returns {string} device name (avd name)
 */
function getDeviceName(deviceId) {
  const deviceName = getCommandLineResponse(
    `adb -s ${deviceId} emu avd name`,
  ).split('\r\n')[0];
  if (deviceName) {
    return deviceName;
  }
  throw new Error(`Failed to get device name for id "${deviceId}"`);
}

module.exports = {
  detectAndroidEmulatorName,
  resolveAttachedAndroidDeviceSerial,
};
