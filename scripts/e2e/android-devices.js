const ChildProcess = require('node:child_process');
const semverSatisfies = require('semver/functions/satisfies');
const semverCoerce = require('semver/functions/coerce');
const semverMaxSatisfying = require('semver/ranges/max-satisfying');
const SemVer = require('semver/classes/semver')

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

  attachAllAvailableEmulators();
    
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
function attachAllAvailableEmulators() {
  const availableEmulatorNames = getAvailableEmulatorNames();
  availableEmulatorNames.forEach(turnOnDevice);
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
            throw new Error(`Android API version ${passedAPILevel}. Doesn't seem right`);
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
    const errorMessage = `Android emulator "${emulatorId}" doesn't want to share its API Level 👹.\nCause: ${error?.message}`
    console.warn(errorMessage);
    console.warn('SKIPPING...');
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
    versions.filter(isSemVer).map(levelAPIVersion => semverCoerce(levelAPIVersion)).filter(isSemVer),
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
  return nonEmptyLines;
}

/**
 * @param {unknown} value
 * @returns {value is SemVer}
 */
function isSemVer(value) {
    return value instanceof SemVer;
}

/**
 * Turns on (attaches) the device
 * @param {string} deviceId
 * @returns {string} device name (avd name)
 */
function getDeviceName (deviceId) {
  return getOneLineCommandLineResponse(`adb -s ${deviceId} emu avd name`);
}

/**
 * Turns on (attaches) the device
 * @param {string} deviceName 
 */
function turnOnDevice (deviceName) {
  ChildProcess.execSync(`emulator @${deviceName}`);
}

/**
 * Runs a command and returns it's response as string. The response is quaranteed to be one line
 * @param {string} command to run
 * @returns {string} command-line response
 */
function getOneLineCommandLineResponse (command) {
  const outputText = getCommandLineResponse(command)
  const response = outputText.split('\n').map(name => name.trim()).filter(Boolean);
  
  if (response.length === 1) {
    return response[0];
  }
  throw new Error(
    `One-line response expected. Reveived:\n${response}\n(${response.length} non-empty lines, ${outputText} total length)`
  );
}

/**
 * Runs a command and returns it's response as string
 * @param {string} command to run
 * @returns {string} command-line response
 */
function getCommandLineResponse (command) {
    const stdout = ChildProcess.execSync(command);
    // Possibly convert Buffer to string
    return typeof stdout === 'string' ? stdout : stdout.toString();
}

module.exports = {
    detectAndroidEmulatorName
}
