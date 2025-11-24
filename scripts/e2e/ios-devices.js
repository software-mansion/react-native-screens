const DEFAULT_APPLE_DEVICE = 'iPhone 17';
const DEFEAULT_IOS_VERSION = 'iOS 26.2';

/**
 * @return {string}
 */
function getAppleDevice() {
  const envVariableKey = 'RNS_E2E_APPLE_SIM_NAME';
  const passedDevice = process.env[envVariableKey];
  if (passedDevice) {
    if (/^(iPhone|iPad)\s.+/.test(passedDevice)) {
      return passedDevice;
    } else {
      throw new Error(`Environment variable ${envVariableKey} should be "iPhone xyz" or "iPad xyz".`);
    }
  }
  return process.env.RNS_E2E_APPLE_SIM_NAME || DEFAULT_APPLE_DEVICE;
}
/**
 * @return {`iOS ${string}`} requested version of ios, or default if not specified
 */
function getIOSVersion() {
  const envVariableKey = 'RNS_E2E_IOS_VERSION';
  const passedVersion = process.env[envVariableKey];
  if (passedVersion) {
    if (/^(iOS)\s.+/.test(passedVersion)) {
      return /** @type {`iOS ${string}`} */ (passedVersion);
    } else {
      throw new Error(`Environment variable ${envVariableKey} should be "iOS xyz".`);
    }
  }
  return DEFEAULT_IOS_VERSION;
}

/**
 * @typedef {Object} AppleDevice - represents Detox's config for an Apple device
 * @property {string} type - a string which represents a model of an iPhone
 * @property {`iOS ${string}`} os - operation system version
 */

/**
 * @satisfies {AppleDevice}
 * @readonly
 * */
const iosDevice = {
  type: getAppleDevice(),
  os: getIOSVersion(),
};

module.exports = {
  iosDevice,
};
