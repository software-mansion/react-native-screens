const DEFEAULT_APPLE_MODEL = 'iPhone 17';
const DEVICE_MODEL = process.env.E2E_APPLE_DEVICE || DEFEAULT_APPLE_MODEL
const DEFEAULT_IOS_VERSION = 'iOS 26.2';

/**
 * @return {`iOS ${string}`} requested version of ios, or default if not specified
 */
function getiosVersion() {
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
  type: DEVICE_MODEL,
  os: getiosVersion(),
};

module.exports = {
  iosDevice,
  getiosVersion,
};
