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

/**
 * @return {boolean} whether the active Detox configuration targets an iOS
 * simulator. When unknown we assume it does, so the iOS resolution still runs.
 */
function isIOSSimulatorConfig() {
  const detoxConfig = readDetoxConfigName();
  if (detoxConfig !== undefined) {
    return detoxConfig.includes('ios.sim');
  }
  // Fall back to scanning argv for indirect invocations that don't surface the
  // configuration name.
  return process.argv.some(runtimeArg => runtimeArg.includes('ios.sim'));
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
 * @typedef {{ name: string, os: `iOS ${string}`, booted: boolean }} InstalledSimulator
 */

/** @type {InstalledSimulator[] | undefined} */
let cachedSimulators;

/**
 * Queries `simctl` once for created, available simulator instances. Results are
 * memoized for the process lifetime.
 *
 * Note: only instances that actually exist are returned, because Detox finds
 * devices through `applesimutils`, which matches existing simulators and does
 * NOT create new ones from a device type + runtime pairing.
 * @return {InstalledSimulator[]}
 */
function listInstalledSimulators() {
  if (cachedSimulators !== undefined) {
    return cachedSimulators;
  }

  let parsed;
  try {
    parsed = JSON.parse(
      getCommandLineResponse('xcrun simctl list devices available --json'),
    );
  } catch (error) {
    console.warn(
      `Could not query iOS simulators, falling back to defaults. Cause:\n${error}`,
    );
    cachedSimulators = [];
    return cachedSimulators;
  }

  /** @type {InstalledSimulator[]} */
  const simulators = [];
  const devicesByRuntime = parsed.devices ?? {};
  for (const [runtimeId, devices] of Object.entries(devicesByRuntime)) {
    const os = runtimeIdToIOSVersion(runtimeId);
    if (!os) {
      continue;
    }
    for (const device of /** @type {any[]} */ (devices)) {
      if (device.isAvailable === false) {
        continue;
      }
      simulators.push({
        name: device.name,
        os,
        booted: device.state === 'Booted',
      });
    }
  }

  cachedSimulators = simulators;
  return cachedSimulators;
}

/**
 * Compares two "iOS x.y[.z]" strings numerically. Returns a positive number when
 * `a` is newer than `b`.
 * @param {`iOS ${string}`} a
 * @param {`iOS ${string}`} b
 * @return {number}
 */
function compareIOSVersions(a, b) {
  const toParts = (/** @type {string} */ value) =>
    value
      .replace(/^iOS\s+/, '')
      .split('.')
      .map(part => Number.parseInt(part, 10) || 0);
  const aParts = toParts(a);
  const bParts = toParts(b);
  const length = Math.max(aParts.length, bParts.length);
  for (let i = 0; i < length; i++) {
    const diff = (aParts[i] ?? 0) - (bParts[i] ?? 0);
    if (diff !== 0) {
      return diff;
    }
  }
  return 0;
}

/**
 * Picks the preferred simulator from a non-empty list: newest iOS version
 * first, then iPhone models over others, keeping `simctl` order as the final
 * tiebreak.
 * @param {InstalledSimulator[]} simulators non-empty list
 * @return {InstalledSimulator}
 */
function pickPreferredSimulator(simulators) {
  return simulators.reduce((best, sim) => {
    const osDiff = compareIOSVersions(sim.os, best.os);
    if (osDiff > 0) {
      return sim;
    }
    if (osDiff < 0) {
      return best;
    }
    // Same OS - prefer an iPhone over any other device family.
    const simIsIPhone = sim.name.startsWith('iPhone');
    const bestIsIPhone = best.name.startsWith('iPhone');
    if (simIsIPhone && !bestIsIPhone) {
      return sim;
    }
    return best;
  });
}

/**
 * @typedef {{ name: string, os: `iOS ${string}` }} SimulatorTarget
 */

/** @type {SimulatorTarget | undefined} */
let cachedTarget;

/**
 * Resolves a single simulator target so that the device name and iOS version
 * always come from the same simulator.
 *
 * Resolution order (descending priority):
 * 1. User input (`RNS_APPLE_SIM_NAME` / `RNS_IOS_VERSION`). Either may be given
 *    on its own: a lone model picks its latest installed OS, a lone version
 *    picks the first installed device on that OS.
 * 2. An already-booted simulator.
 * 3. The default hardcoded device/version, when an instance of it is installed.
 * 4. The newest installed simulator (preferring iPhone models).
 *
 * @return {SimulatorTarget}
 */
function resolveSimulatorTarget() {
  if (cachedTarget !== undefined) {
    return cachedTarget;
  }
  cachedTarget = computeSimulatorTarget();
  return cachedTarget;
}

/**
 * @return {SimulatorTarget}
 */
function computeSimulatorTarget() {
  const envName = readSimulatorNameEnv();
  const envVersion = readIOSVersionEnv();

  // 1a. Both provided - honor verbatim, no probing needed.
  if (envName && envVersion) {
    return { name: envName, os: envVersion };
  }

  // For non-iOS configurations the returned values are unused by Detox, so we
  // avoid shelling out to `simctl` and just echo defaults/env pieces.
  if (!isIOSSimulatorConfig()) {
    return {
      name: envName ?? DEFAULT_APPLE_SIMULATOR_NAME,
      os: envVersion ?? DEFAULT_IOS_VERSION,
    };
  }

  const simulators = listInstalledSimulators();

  // 1b. Model only - pick its latest installed OS, else fall back to default OS.
  if (envName) {
    const matches = simulators.filter(sim => sim.name === envName);
    if (matches.length > 0) {
      const latest = matches.reduce((newest, sim) =>
        compareIOSVersions(sim.os, newest.os) > 0 ? sim : newest,
      );
      return { name: envName, os: latest.os };
    }
    return { name: envName, os: DEFAULT_IOS_VERSION };
  }

  // 1c. Version only - first installed device on that OS (preferring a booted
  // one), else fall back to the default device.
  if (envVersion) {
    const matches = simulators.filter(sim => sim.os === envVersion);
    const chosen = matches.find(sim => sim.booted) ?? matches[0];
    return {
      name: chosen ? chosen.name : DEFAULT_APPLE_SIMULATOR_NAME,
      os: envVersion,
    };
  }

  // 2. An already-booted simulator (prefer the default when it is booted).
  const booted = simulators.filter(sim => sim.booted);
  if (booted.length > 0) {
    const defaultBooted = booted.find(
      sim =>
        sim.name === DEFAULT_APPLE_SIMULATOR_NAME &&
        sim.os === DEFAULT_IOS_VERSION,
    );
    if (defaultBooted) {
      return { name: defaultBooted.name, os: defaultBooted.os };
    }
    console.log(
      `Default simulator "${DEFAULT_APPLE_SIMULATOR_NAME}" (${DEFAULT_IOS_VERSION}) is not booted. ` +
        `Using booted simulator "${booted[0].name}" (${booted[0].os}) instead.`,
    );
    return { name: booted[0].name, os: booted[0].os };
  }

  // 3. The default hardcoded device/version, when an instance of it actually
  // exists - `applesimutils` (used by Detox) only matches existing simulators.
  const defaultInstalled = simulators.some(
    sim =>
      sim.name === DEFAULT_APPLE_SIMULATOR_NAME &&
      sim.os === DEFAULT_IOS_VERSION,
  );
  if (defaultInstalled) {
    return { name: DEFAULT_APPLE_SIMULATOR_NAME, os: DEFAULT_IOS_VERSION };
  }

  // 4. The newest installed simulator, preferring iPhone models.
  if (simulators.length > 0) {
    const fallback = pickPreferredSimulator(simulators);
    console.log(
      `Default simulator "${DEFAULT_APPLE_SIMULATOR_NAME}" (${DEFAULT_IOS_VERSION}) is not installed. ` +
        `Using installed simulator "${fallback.name}" (${fallback.os}) instead.`,
    );
    return { name: fallback.name, os: fallback.os };
  }

  // Nothing installed - keep defaults and let Detox surface the error.
  return { name: DEFAULT_APPLE_SIMULATOR_NAME, os: DEFAULT_IOS_VERSION };
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
