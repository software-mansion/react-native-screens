const { getCommandLineResponse } = require('./command-line-helpers');

const DEFAULT_APPLE_SIMULATOR_NAME = 'iPhone 17';
const DEFAULT_IOS_VERSION = 'iOS 26.2';

const envVarKeys = /** @type {const} */ ({
  simName: 'RNS_APPLE_SIM_NAME',
  iosVersion: 'RNS_IOS_VERSION',
});

/**
 * @return {string | undefined} validated simulator name from env, or undefined
 */
function readSimulatorNameEnv() {
  const passedDevice = process.env[envVarKeys.simName];
  if (!passedDevice) {
    return undefined;
  }
  if (/^(iPhone|iPad)\s.+/.test(passedDevice)) {
    return passedDevice;
  }
  throw new Error(
    `Environment variable ${envVarKeys.simName} should be "iPhone xyz" or "iPad xyz".`,
  );
}

/**
 * @return {`iOS ${string}` | undefined} validated iOS version from env, or undefined
 */
function readIOSVersionEnv() {
  const passedVersion = process.env[envVarKeys.iosVersion];
  if (!passedVersion) {
    return undefined;
  }
  if (/^iOS\s\S+/.test(passedVersion)) {
    return /** @type {`iOS ${string}`} */ (passedVersion);
  }
  throw new Error(
    `Environment variable ${envVarKeys.iosVersion} should be "iOS xyz".`,
  );
}

/**
 * Maps a CoreSimulator runtime identifier to a human iOS version string.
 * "com.apple.CoreSimulator.SimRuntime.iOS-26-2" -> "iOS 26.2"
 * @param {string} runtimeId
 * @return {`iOS ${string}` | undefined}
 */
function runtimeIdToIOSVersion(runtimeId) {
  const match = /SimRuntime\.iOS-(\d+(?:-\d+)*)$/.exec(runtimeId);
  if (!match) {
    return undefined;
  }
  return /** @type {`iOS ${string}`} */ (`iOS ${match[1].replace(/-/g, '.')}`);
}

/**
 * @typedef {{ name: string, os: `iOS ${string}` }} SimulatorTarget
 */

/**
 * Queries `simctl` for currently booted, available iOS simulators.
 * @return {SimulatorTarget[]}
 */
function listBootedAppleSimulators() {
  let parsed;
  try {
    parsed = JSON.parse(
      getCommandLineResponse('xcrun simctl list devices booted --json'),
    );
  } catch (error) {
    console.warn(
      `Could not query booted iOS simulators, falling back to defaults. Cause:\n${error}`,
    );
    return [];
  }
  const devicesByRuntime = parsed.devices ?? {};
  /** @type {SimulatorTarget[]} */
  const booted = [];
  for (const [runtimeId, devices] of Object.entries(devicesByRuntime)) {
    const os = runtimeIdToIOSVersion(runtimeId);
    if (!os) {
      continue;
    }
    for (const device of /** @type {any[]} */ (devices)) {
      if (device.state === 'Booted' && device.isAvailable !== false) {
        booted.push({ name: device.name, os });
      }
    }
  }
  return booted;
}

/**
 * Reads the active Detox configuration name from the `--configuration <name>`
 * CLI flag or the `DETOX_CONFIGURATION` env var (Detox sets the latter in the
 * worker processes it spawns). Returns undefined when neither is present, so
 * callers can fall back to scanning argv for indirect invocations.
 * @return {string | undefined}
 */
function readDetoxConfigName() {
  const fromEnv = process.env.DETOX_CONFIGURATION;
  if (fromEnv) {
    return fromEnv;
  }
  const flagIndex = process.argv.indexOf('--configuration');
  if (flagIndex !== -1 && flagIndex + 1 < process.argv.length) {
    return process.argv[flagIndex + 1];
  }
  return undefined;
}

/** @type {SimulatorTarget | undefined} */
let cachedTarget;

/**
 * Resolves a single simulator target so that the device name and iOS version
 * always come from the same simulator.
 *
 * Resolution order:
 * 1. `RNS_APPLE_SIM_NAME` / `RNS_IOS_VERSION` env vars (explicit intent).
 * 2. The default device/version, if it is already booted.
 * 3. The first booted simulator, so tests can run on whatever is available.
 * 4. The defaults, so Detox boots one when nothing is running.
 *
 * @return {SimulatorTarget}
 */
function resolveSimulatorTarget() {
  if (cachedTarget !== undefined) {
    return cachedTarget;
  }

  const envName = readSimulatorNameEnv();
  const envVersion = readIOSVersionEnv();

  // Explicit selection via env var(s) wins and disables auto-detection.
  if (envName || envVersion) {
    cachedTarget = {
      name: envName ?? DEFAULT_APPLE_SIMULATOR_NAME,
      os: envVersion ?? DEFAULT_IOS_VERSION,
    };
    return cachedTarget;
  }

  // Only probe `simctl` for iOS simulator configurations - mirrors the Android
  // side guarding on the active Detox configuration. Prefer the resolved
  // configuration name (flag/env) and fall back to scanning argv so indirect
  // invocations that don't surface the name still work.
  const detoxConfig = readDetoxConfigName();
  const isIOSSimulatorConfig =
    detoxConfig !== undefined
      ? detoxConfig.includes('ios.sim')
      : process.argv.some(runtimeArg => runtimeArg.includes('ios.sim'));
  if (!isIOSSimulatorConfig) {
    cachedTarget = {
      name: DEFAULT_APPLE_SIMULATOR_NAME,
      os: DEFAULT_IOS_VERSION,
    };
    return cachedTarget;
  }

  const booted = listBootedAppleSimulators();

  const defaultBooted = booted.find(
    sim =>
      sim.name === DEFAULT_APPLE_SIMULATOR_NAME &&
      sim.os === DEFAULT_IOS_VERSION,
  );

  if (defaultBooted) {
    // Preferred default is booted - use it.
    cachedTarget = defaultBooted;
  } else if (booted.length > 0) {
    // Fall back to whatever is booted so the test run can start.
    cachedTarget = booted[0];
    console.log(
      `Default simulator "${DEFAULT_APPLE_SIMULATOR_NAME}" (${DEFAULT_IOS_VERSION}) is not booted. ` +
        `Using booted simulator "${cachedTarget.name}" (${cachedTarget.os}) instead.`,
    );
  } else {
    // Nothing booted - keep defaults so Detox boots one.
    cachedTarget = {
      name: DEFAULT_APPLE_SIMULATOR_NAME,
      os: DEFAULT_IOS_VERSION,
    };
  }
  return cachedTarget;
}

/**
 * @return {string}
 */
function resolveAppleSimulatorName() {
  return resolveSimulatorTarget().name;
}

/**
 * @return {`iOS ${string}`} requested version of ios, or default if not specified
 */
function getIOSVersion() {
  return resolveSimulatorTarget().os;
}

/**
 * @return { string } iOS version number (e.g. 26.2)
 */
function getIOSVersionNumber() {
  // getIOSVersion() always returns "iOS <version>" per the SimulatorTarget type.
  return getIOSVersion().slice('iOS '.length);
}

module.exports = {
  resolveAppleSimulatorName,
  getIOSVersion,
  getIOSVersionNumber,
};
