const DEFAULT_APPLE_DEVICE = 'iPhone 17';
const DEFEAULT_IOS_VERSION = 'iOS 26.2';

/**
 * @return {string}
 */
function getAppleDevice() {
  return process.env.E2E_APPLE_DEVICE || DEFAULT_APPLE_DEVICE;
}
/**
 * @return {`iOS ${string}`} requested version of ios, or default if not specified
 */
function getIOSVersion() {
  const passedVersion = process.env.E2E_IOS_VERSION;
  if (passedVersion) {
    if (passedVersion.startsWith('iOS ')) {
      return /** @type {`iOS ${string}`} */ (passedVersion);
    }
    return `iOS ${passedVersion}`;
  }
  return DEFEAULT_IOS_VERSION;
}

/**
 * @typedef {Object} AppleDevice - creates a new type named 'SpecialType'
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
