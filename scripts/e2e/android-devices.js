const semverSatisfies = require('semver/functions/satisfies');
const semverCoerce = require('semver/functions/coerce');
const semverMaxSatisfying = require('semver/ranges/max-satisfying');
const SemVer = require('semver/classes/semver');
const { bootDevices } = require('./turn-on-android-devices');
const { getOneLineCommandLineResponse, getCommandLineResponse } = require('./command-line-helpers');
const { assertError } = require('./errors-helpers');

const CI_AVD_NAME = 'e2e_emulator';
const SUPPORTED_API_LEVEL_RANGE = '>=25'; // Android 7.1.1
const isRunningCI = process.env.CI;

function detectAndroidEmulatorName() {
  return isRunningCI ? CI_AVD_NAME : detectLocalAndroidEmulator();
}

function detectLocalAndroidEmulator() {
  // "DETOX_AVD_NAME" can be set for local developement
  const detoxAvdName = process.env.DETOX_AVD_NAME;
  if (detoxAvdName) return detoxAvdName;
  bootInactiveDevices();
  
  const deviceIds = getDeviceIds();
  const devices = deviceIds.map(id => ({id, name: getDeviceName(id)}));
  const requestedAPILevel = getPassedAndroidAPILevel();
  if (!requestedAPILevel) {
    return findDeviceWithTheHighestAPILevel(devices).name;
  }
  const requestedEmulator = devices.find(emulator => getEmulatorAPILevel(emulator.id) === requestedAPILevel);
  if (requestedEmulator) {
    return requestedEmulator.name
  }
  throw new Error(`Android emulator with API level ${requestedAPILevel} is not available (Create a new one).`)
}

/**
 * attaches all available devices to be able to call them via adb
 */
function bootInactiveDevices() {
  const allAvailableEmulatorNames = getAvailableEmulatorNames();
  try {
    const nowRunningDevices = new Set(getDeviceIds().map(getDeviceName));
    bootDevices(allAvailableEmulatorNames.filter(deviceName => !nowRunningDevices.has(deviceName))); 
  } catch(e) {
    assertError(e);
    bootDevices(allAvailableEmulatorNames);
  }
}

function getAvailableEmulatorNames() {
  try {
    const outputText = getCommandLineResponse("emulator -list-avds");
    const avdList = outputText.trim().split('\n').map(name => name.trim());
    if (avdList.length === 0) {
      throw new Error('No installed AVDs detected on the device');
    }

    return avdList;
  } catch (error) {
    const errorMessage = `Failed to find any Android emulator. Set "DETOX_AVD_NAME" env variable pointing to one. Cause:\n${error}`
    throw new Error(errorMessage);
  }
}

function getPassedAndroidAPILevel() {
    const passedAPILevel = process.env.E2E_ANDROID_API_LEVEL;
    if (passedAPILevel) {
        const semverVersion = semverCoerce(passedAPILevel);
        if (!semverVersion) {
            throw new Error(`Android API version ${passedAPILevel}. Doesn't seem right.`);
        }
        if (!semverSatisfies(semverVersion, SUPPORTED_API_LEVEL_RANGE)) {
            console.warn(`⚠️Android API version ${passedAPILevel} may be not supported!⚠️`);
        };
        return passedAPILevel;
    }
}

/**
 * @param {string} emulatorId
 * @returns device's API Level or null if failed
 */
function getEmulatorAPILevel(emulatorId) {
  try {
    return getOneLineCommandLineResponse(`adb -s ${emulatorId} shell getprop ro.build.version.sdk`);
  } catch (error) {
    assertError(error);
    const errorMessage = `Android emulator "${emulatorId}" doesn't want to share its API Level 👹.\nCause: ${error?.message}`
    console.warn(errorMessage);
    console.warn('SKIPPING THIS DEVICE...');
    return null;
  }
}

/**
 * @param {{name: string, id: string}[]} devices
 */
function findDeviceWithTheHighestAPILevel(devices){
  /**
 * @type {Map<string, {name: string, id: string}>}
 */
  const versionToDeviceName = new Map();
  for (const device of devices) {
    const apiLevel = getEmulatorAPILevel(device.id);
    if (!apiLevel) continue;
    const parsedVersion = semverCoerce(apiLevel);
    if (!parsedVersion) continue;
    versionToDeviceName.set(parsedVersion.toString(), device);
  }
  const versions = Array.from(versionToDeviceName.keys());
  const highestAvailableVersion = semverMaxSatisfying(
    versions.filter(isValidSemVer).map(levelAPIVersion => semverCoerce(levelAPIVersion)).filter(isValidSemVer),
    SUPPORTED_API_LEVEL_RANGE
  );
  const result = versionToDeviceName.get(String(highestAvailableVersion));
  if (!result) {
    throw new Error('Something went wrong (Implementation error?)');
  }
  return result;
}

/**
 * @returns {string[]}
 */
function getDeviceIds() {
  const nonEmptyLines = getCommandLineResponse('adb devices').split('\n').map(line => line.trim()).filter(Boolean);
  nonEmptyLines.shift(); // The first line is always the "List of devices attached" (header) so we remove it
  if (nonEmptyLines.length === 0) {
    throw new Error('The device list (from adb) is empty.');
  }
  return nonEmptyLines.map(line => {
    const [id, state] = line.split('\t');
    if (state !== 'device') {
      console.warn(`THE DEVICE (ID ${id}) HAS STATUS "${state}". ITS STATUS SHOULD BE 'device' TO CONTINUE!`);
    }
    return id;
  });
}

/**
 * @param {unknown} value
 * @returns {value is SemVer}
 */
function isValidSemVer(value) {
    return value instanceof SemVer || typeof value === 'string' && Boolean(new SemVer(value));
}

/**
 * Turns on (attaches) the device
 * @param {string} deviceId
 * @returns {string} device name (avd name)
 */
function getDeviceName(deviceId) {
  const deviceName = getCommandLineResponse(`adb -s ${deviceId} emu avd name`).split('\r\n')[0];
  if (deviceName) {
    return deviceName;
  }
  throw new Error(`Failed to get device name for id "${deviceId}"`);
}


module.exports = {
    detectAndroidEmulatorName
}
