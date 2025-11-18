const ChildProcess = require('node:child_process');
const semverSatisfies = require('semver/functions/satisfies');
const semverCoerce = require('semver/functions/coerce');
const semverMaxSatisfying = require('semver/ranges/max-satisfying');
const SemVer = require('semver/classes/semver')

const CI_AVD_NAME = 'e2e_emulator';
const SUPPORTED_API_LEVEL_RANGE = '>=25'; // Android 7.1.1
const isRunningCI = JSON.parse(String(process.env.CI));

function detectAndroidEmulatorName() {
  return isRunningCI ? CI_AVD_NAME : detectLocalAndroidEmulator();
}

function detectLocalAndroidEmulator() {
  // "DETOX_AVD_NAME" can be set for local developement
  const detoxAvdName = process.env.DETOX_AVD_NAME;
  if (detoxAvdName) return detoxAvdName;

  const availableEmulatorNames = getAvailableEmulatorNames();
  const requestedAPILevel = getPassedAndroidAPILevel();
  if (!requestedAPILevel) {
    return findDeviceWithTheHighestAPILevel(availableEmulatorNames);
  }
  const requestedEmulator = availableEmulatorNames.find(emulatorName => getEmulatorAPILevel(emulatorName) === requestedAPILevel);
  if (requestedEmulator) {
    return requestedEmulator
  }
  throw new Error(`Android emulator with API level ${requestedAPILevel} is not available (Create a new one).`)
}

function getAvailableEmulatorNames() {
  try {
    const stdout = ChildProcess.execSync("emulator -list-avds")
    // Possibly convert Buffer to string
    const outputText = typeof stdout === 'string' ? stdout : stdout.toString();
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
 * @param {string} emulatorName
 * @returns device's API Level or null if failed
 */
function getEmulatorAPILevel(emulatorName) {
    try {
    const stdout = ChildProcess.execSync(`adb -s ${emulatorName} shell getprop ro.build.version.sdk`)
    const outputText = typeof stdout === 'string' ? stdout : stdout.toString();
    const response = outputText.split('\n').map(name => name.trim()).filter(Boolean);

    if (response.length !== 1) {
      throw new Error(
        `One-line response expected. Reveived:\n${response}\n(${response.length} non-empty lines, ${outputText} total length)`
      );
    }

    return response[0];
  } catch (error) {
    const errorMessage = `Android emulator "${emulatorName}" doesn't want to share its API Level 👹.\nCause: ${error}`
    console.warn(errorMessage);
    console.warn('SKIPPING...');
    return null;
  }
}

/**
 * @param {string[]} adbDeviceNames
 */
function findDeviceWithTheHighestAPILevel(adbDeviceNames){
  if (adbDeviceNames.length === 1) return adbDeviceNames[0];
  /**
 * @type {Map<string, string>}
 */
  const versionToDeviceName = new Map();
  for (const name of adbDeviceNames) {
    const apiLevel = getEmulatorAPILevel(name);
    if (!apiLevel) continue;
    const parsedVersion = semverCoerce(apiLevel);
    if (!parsedVersion) continue;
    versionToDeviceName.set(parsedVersion.toString(), name);
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
 * @param {unknown} value
 * @returns {value is SemVer}
 */
function isSemVer(value) {
    return value instanceof SemVer;
}

module.exports = {
    detectAndroidEmulatorName
}
