const ChildProcess = require('node:child_process');

// Should be kept in sync with the constant defined in e2e workflow file
const DEFAULT_CI_AVD_NAME = 'e2e_emulator';

function detectLocalAndroidEmulator() {
  // "RNS_E2E_AVD_NAME" can be set for local developement
  const avdName = process.env.RNS_AVD_NAME ?? null;
  if (avdName !== null) {
    return avdName
  }

  // Fallback: try to use Android SDK
  try {
    let stdout = ChildProcess.execSync("emulator -list-avds");

    // Possibly convert Buffer to string
    if (typeof stdout !== 'string') {
      stdout = stdout.toString();
    }

    const avdList = stdout.trim().split('\n').map(name => name.trim());

    if (avdList.length === 0) {
      throw new Error('No installed AVDs detected on the device');
    }

    // Just select first one in the list.
    // TODO: consider giving user a choice here.
    return avdList[0];
  } catch (error) {
    const errorMessage = `Failed to find Android emulator. Set "RNS_E2E_AVD_NAME" env variable pointing to one. Cause: ${error}`;
    console.error(errorMessage);
    throw new Error(errorMessage);
  }
}

/**
 * @param {boolean} isRunningCI whether this script is run in CI environment
 */
function detectAndroidEmulatorName(isRunningCI) {
  return isRunningCI ? DEFAULT_CI_AVD_NAME : detectLocalAndroidEmulator();
}

/**
 * @returns {string | null} Device serial as requested by user, first serial from adb list or null
 */
function resolveAndroidDeviceSerial() {
  const deviceSerial = process.env.RNS_DEVICE_SERIAL ?? null;

  if (deviceSerial !== null) {
    return deviceSerial;
  }

  // Fallback: try to use adb
  try {
    let stdout = ChildProcess.execSync("adb devices");

    // Possibly convert Buffer to string
    if (typeof stdout !== 'string') {
      stdout = stdout.toString();
    }

    /** @type {string} */
    const stringStdout = stdout;

    // Example `adb devices` output:
    //
    // List of devices attached
    // 6lh6huzhr48lu8t8        device
    // emulator-5554   device

    const deviceList = stringStdout
      .trim()
      .split('\n')
      .map(line => line.trim())
      .filter((line, index) => line !== '' && index !== 0) // empty lines & header
      .map(line => line.split(' ', 1)[0]);


    if (deviceList.length === 0) {
      throw new Error("Seems that the attached device list is empty");
    }

    // Just select first one in the list.
    // TODO: consider giving user a choice here.
    return deviceList[0];
  } catch (error) {
    console.error(`Failed to find attached device. Try setting "RNS_DEVICE_SERIAL" env variable pointing to one. Cause: ${error}`);
  }

  return null;
}

module.exports = {
  DEFAULT_CI_AVD_NAME,
  detectLocalAndroidEmulator,
  detectAndroidEmulatorName,
  resolveAndroidDeviceSerial,
}
