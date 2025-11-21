const DEFAULT_APPLE_SIMULATOR_NAME = 'iPhone 17';
const DEFAULT_IOS_VERSION = 'iOS 26.2';

/**
 * @return {string}
 */
function resolveAppleSimulatorName() {
  return process.env.RNS_APPLE_SIM_NAME ?? DEFAULT_APPLE_SIMULATOR_NAME;
}
/**
 * @return {`iOS ${string}`} requested version of ios, or default if not specified
 */
function getIOSVersion() {
  const passedVersion = process.env.RNS_IOS_VERSION;
  if (passedVersion) {
    if (passedVersion.startsWith('iOS ')) {
      return /** @type {`iOS ${string}`} */ (passedVersion);
    }
    return `iOS ${passedVersion}`;
  }
  return DEFAULT_IOS_VERSION;
}

module.exports = {
  resolveAppleSimulatorName,
  getIOSVersion,
};

