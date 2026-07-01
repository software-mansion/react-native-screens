const { getCommandLineResponse } = require('./command-line-helpers');

const DEFAULT_APPLE_SIMULATOR_NAME = 'iPhone 17';
const DEFAULT_IOS_VERSION = '26.2';

const envVarKeys = /** @type {const} */ ({
  simName: 'RNS_APPLE_SIM_NAME',
  iosVersion: 'RNS_IOS_VERSION',
});

/**
 * @return {string | undefined} validated simulator name from env, or undefined
 */
function readSimulatorNameEnv() {
  const passedDevice = process.env[envVarKeys.simName]?.trim();
  if (!passedDevice) {
    return undefined;
  }
  // Require at least one non-whitespace character after the family prefix.
  if (/^(iPhone|iPad)\s\S.*/.test(passedDevice)) {
    return passedDevice;
  }
  throw new Error(
    `Environment variable ${envVarKeys.simName} should be "iPhone xyz" or "iPad xyz".`,
  );
}

/**
 * @return {string | undefined} validated iOS version from env, or undefined
 */
function readIOSVersionEnv() {
  const passedVersion = process.env[envVarKeys.iosVersion]?.trim();
  if (!passedVersion) {
    return undefined;
  }
  // Accept only a bare "<digits>(.<digits>)*" version, so typos fail here, not
  // downstream.
  if (/^\d+(\.\d+)*$/.test(passedVersion)) {
    return passedVersion;
  }
  throw new Error(
    `Environment variable ${envVarKeys.iosVersion} should be a version like "26.2".`,
  );
}

/**
 * Reads the active Detox configuration name from the `--configuration <name>`
 * CLI flag or the `DETOX_CONFIGURATION` env var (Detox sets the latter in its
 * worker processes), or undefined when neither is present.
 *
 * Accepted values are the `configurations` keys defined in
 * `scripts/e2e/detox-utils.cjs` (`commonDetoxConfigFactory`):
 * `ios.sim.debug`, `ios.sim.release`, `android.att.debug`,
 * `android.att.release`, `android.emu.debug`, `android.emu.release`.
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
 * simulator. When it can't be determined, we assume it does not and skip
 * `simctl` probing.
 */
function isIOSSimulatorConfig() {
  const detoxConfig = readDetoxConfigName();
  if (detoxConfig !== undefined) {
    return detoxConfig.includes('ios.sim');
  }
  // No configuration name surfaced (indirect invocation) - scan argv instead.
  return process.argv.some(runtimeArg => runtimeArg.includes('ios.sim'));
}

/**
 * Maps a CoreSimulator runtime identifier to a bare iOS version string.
 * "com.apple.CoreSimulator.SimRuntime.iOS-26-2" -> "26.2"
 * @param {string} runtimeId
 * @return {string | undefined}
 */
function runtimeIdToIOSVersion(runtimeId) {
  const match = /SimRuntime\.iOS-(\d+(?:-\d+)*)$/.exec(runtimeId);
  if (!match) {
    return undefined;
  }
  return match[1].replace(/-/g, '.');
}

/**
 * @typedef {{ name: string, os: string, booted: boolean }} InstalledSimulator
 */

/** @type {InstalledSimulator[] | undefined} */
let cachedSimulators;

/**
 * Queries `simctl` once (memoized) for created, available simulator instances.
 *
 * Only existing instances are returned: Detox finds devices via `applesimutils`,
 * which matches existing simulators and never creates new ones from a device
 * type + runtime pairing.
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
 * Compares two bare "x.y[.z]" version strings numerically. Returns a positive
 * number when `a` is newer than `b`.
 * @param {string} a
 * @param {string} b
 * @return {number}
 */
function compareIOSVersions(a, b) {
  const toParts = (/** @type {string} */ value) =>
    value.split('.').map(part => Number.parseInt(part, 10) || 0);
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
 * Lists installed OS versions for a device name (for validation errors).
 * @param {InstalledSimulator[]} simulators
 * @param {string} name
 * @return {string}
 */
function describeAvailabilityForName(simulators, name) {
  const versions = [
    ...new Set(simulators.filter(sim => sim.name === name).map(sim => sim.os)),
  ].sort((a, b) => compareIOSVersions(a, b));
  if (versions.length > 0) {
    return `"${name}" is installed with: ${versions.join(', ')}.`;
  }
  return `No installed simulator is named "${name}".`;
}

/**
 * @typedef {{ name: string, os: string }} SimulatorTarget
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
 * 2. An already-booted simulator (the newest version when several are booted).
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

  // Non-iOS config: values are unused, so skip `simctl` and echo defaults/env.
  if (!isIOSSimulatorConfig()) {
    return {
      name: envName ?? DEFAULT_APPLE_SIMULATOR_NAME,
      os: envVersion ?? DEFAULT_IOS_VERSION,
    };
  }

  const simulators = listInstalledSimulators();

  // 1a. Both provided - validate the exact device + OS instance exists.
  if (envName && envVersion) {
    const exists = simulators.some(
      sim => sim.name === envName && sim.os === envVersion,
    );
    if (!exists) {
      if (simulators.length === 0) {
        // simctl failed or no simulators are installed, so we cannot validate.
        // Warn and proceed rather than swallowing the problem silently - Detox
        // will surface an error if the target does not exist.
        console.warn(
          `Could not validate simulator "${envName}" (${envVersion}): ` +
            `simctl returned no simulators. Proceeding anyway.`,
        );
      } else {
        throw new Error(
          `Requested simulator "${envName}" (${envVersion}) is not installed. ` +
            `${describeAvailabilityForName(simulators, envName)} ` +
            `List devices with: xcrun simctl list devices available`,
        );
      }
    }
    return { name: envName, os: envVersion };
  }

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

  // 2. An already-booted simulator. When several are booted, use the one with
  // the newest iOS version (preferring iPhone on a tie) - a newer booted
  // simulator wins even over the default.
  const booted = simulators.filter(sim => sim.booted);
  if (booted.length > 0) {
    const chosen = pickPreferredSimulator(booted);
    const isDefault =
      chosen.name === DEFAULT_APPLE_SIMULATOR_NAME &&
      chosen.os === DEFAULT_IOS_VERSION;
    if (!isDefault) {
      console.log(
        `Using booted simulator "${chosen.name}" (${chosen.os}).`,
      );
    }
    return { name: chosen.name, os: chosen.os };
  }

  // 3. The default hardcoded device/version, when an instance of it exists.
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
 * @return {string} bare iOS version (e.g. "26.2"), or default if not specified.
 * Used directly as Detox's `device.os`, which `applesimutils --byOS` matches
 * against a bare version.
 */
function getIOSVersion() {
  return resolveSimulatorTarget().os;
}

/**
 * @return {string} iOS version number (e.g. "26.2"). Kept as a named accessor
 * for the e2e specs that read it for version comparisons; identical to
 * {@link getIOSVersion} now that versions are stored without the "iOS " prefix.
 */
function getIOSVersionNumber() {
  return getIOSVersion();
}

module.exports = {
  resolveAppleSimulatorName,
  getIOSVersion,
  getIOSVersionNumber,
};
