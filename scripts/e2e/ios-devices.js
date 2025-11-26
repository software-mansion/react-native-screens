const DEFAULT_APPLE_SIMULATOR_NAME = 'iPhone 17';
const DEFAULT_IOS_VERSION = 'iOS 26.2';

/**
 * @return {string}
 */
function resolveAppleSimulatorName() {
  const envVariableKey = 'RNS_APPLE_SIM_NAME';
  const passedDevice = process.env[envVariableKey];
  if (passedDevice) {
    if (/^(iPhone|iPad)\s.+/.test(passedDevice)) {
      return passedDevice;
    } else {
      throw new Error(
        `Environment variable ${envVariableKey} should be "iPhone xyz" or "iPad xyz".`,
      );
    }
  }
  return DEFAULT_APPLE_SIMULATOR_NAME;
}
/**
 * @return {`iOS ${string}`} requested version of ios, or default if not specified
 */
function getIOSVersion() {
  const envVariableKey = 'RNS_IOS_VERSION';
  const passedVersion = process.env[envVariableKey];
  if (passedVersion) {
    if (/^(iOS)\s.+/.test(passedVersion)) {
      return /** @type {`iOS ${string}`} */ (passedVersion);
    } else {
      throw new Error(
        `Environment variable ${envVariableKey} should be "iOS xyz".`,
      );
    }
  }
  return DEFAULT_IOS_VERSION;
}

module.exports = {
  resolveAppleSimulatorName,
  getIOSVersion,
};
