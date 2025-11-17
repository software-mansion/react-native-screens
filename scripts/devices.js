const APPLE_MODELS = /** @type {const} */ (['iPhone 16', 'iPhone 16 Pro', 'iPhone 17', 'iPhone 17 Pro']);
const DEFEAULT_APPLE_MODEL = APPLE_MODELS[3];
/**
 * @typedef {typeof APPLE_MODELS[number]} AppleDeviceModel An Apple Inc. hardware
 */
/**
 * @param {unknown} deviceModel
 * @returns {asserts deviceModel is AppleDeviceModel}
 */
function assertAppleDeviceModelIsSupported(deviceModel) {
  if (APPLE_MODELS.includes(/** @type {AppleDeviceModel} */ (deviceModel))) return;
  throw TypeError(`Device "${deviceModel}" not supported.\nSupported models:\n${APPLE_MODELS.join(', ')}`);
}

/**
 * @return {AppleDeviceModel} requested version of ios, or default if not specified
 */
function getDeviceModel() {
    const passedDeviceModel = process.env.E2E_APPLE_DEVICE;
    if (passedDeviceModel) {
        assertAppleDeviceModelIsSupported(passedDeviceModel);
        return passedDeviceModel;
    }
    return DEFEAULT_APPLE_MODEL;
}

const IOS_VERSIONS = /** @type {const} */ (['18.6', '26.1', '26.2']);
const DEFEAULT_IOS_VERSION = IOS_VERSIONS[2];
/**
 * @typedef {typeof IOS_VERSIONS[number]} IOSVersion
 */
/**
 * @param {unknown} version
 * @returns {asserts version is IOSVersion} 
 */
function assertiOSVersionIsSupported(version) {
  if (IOS_VERSIONS.includes(/** @type {IOSVersion} */ (version))) return;
  throw TypeError(`Version "${version}" not supported.\nSupported versions:\n${IOS_VERSIONS.join(', ')}`);
}

/**
 * @return {IOSVersion} requested version of ios, or default if not specified
 */
function getiosVersion() {
    const passedVersion = process.env.E2E_IOS_VERSION;
    if (passedVersion) {
        assertiOSVersionIsSupported(passedVersion);
        return passedVersion;
    }
    return DEFEAULT_IOS_VERSION;
}


/**
 * @typedef {Object} AppleDevice - creates a new type named 'SpecialType'
 * @property {AppleDeviceModel} type - a string which represents a model of an iPhone
 * @property {`iOS ${IOSVersion}`} os - operation system version
 */

/** 
 * @satisfies {AppleDevice}
 * @readonly
 * */
const iosDevice = {
  type: getDeviceModel(),
  os: `iOS ${getiosVersion()}`,
};

module.exports = {
  appleModels: APPLE_MODELS,
  iosVersions: IOS_VERSIONS,
  iosDevice,
  getiosVersion,
};
