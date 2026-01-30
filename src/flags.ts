const RNS_CONTROLLED_BOTTOM_TABS_DEFAULT = false;
const RNS_SYNCHRONOUS_SCREEN_STATE_UPDATES_DEFAULT = false;
const RNS_SYNCHRONOUS_HEADER_CONFIG_STATE_UPDATES_DEFAULT = false;
const RNS_SYNCHRONOUS_HEADER_SUBVIEW_STATE_UPDATES_DEFAULT = false;
const RNS_ANDROID_RESET_SCREEN_SHADOW_STATE_ON_ORIENTATION_CHANGE_DEFAULT =
  true;
const RNS_IOS_PREVENT_REATTACHMENT_OF_DISMISSED_SCREENS = false;

// TODO: Migrate freeze here

/**
 * Exposes information useful for downstream navigation library implementers,
 * so they can keep reasonable backward compatibility, if desired.
 *
 * We don't mean for this object to only grow in number of fields, however at the same time
 * we won't be very hasty to reduce it. Expect gradual changes.
 */
export const compatibilityFlags = {
  /**
   * Because of a bug introduced in https://github.com/software-mansion/react-native-screens/pull/1646
   * react-native-screens v3.21 changed how header's backTitle handles whitespace strings in https://github.com/software-mansion/react-native-screens/pull/1726
   * To allow for backwards compatibility in @react-navigation/native-stack we need a way to check if this version or newer is used.
   * See https://github.com/react-navigation/react-navigation/pull/11423 for more context.
   */
  isNewBackTitleImplementation: true,

  /**
   * With version 4.0.0 the header implementation has been changed. To allow for backward compat
   * with native-stack@v6 we want to expose a way to check whether the new implementation
   * is in use or not.
   *
   * See:
   * * https://github.com/software-mansion/react-native-screens/pull/2325
   * * https://github.com/react-navigation/react-navigation/pull/12125
   */
  usesHeaderFlexboxImplementation: true,

  /**
   * In https://github.com/software-mansion/react-native-screens/pull/3402, we fix values
   * reported in `onHeaderHeightChange` event on Android. To allow backward compatibility in
   * `@react-navigation/native-stack`, we expose a way to check whether the new implementation
   * is in use or not.
   */
  usesNewAndroidHeaderHeightImplementation: true,
} as const;

const _featureFlags = {
  experiment: {
    controlledBottomTabs: RNS_CONTROLLED_BOTTOM_TABS_DEFAULT,
    synchronousScreenUpdatesEnabled:
      RNS_SYNCHRONOUS_SCREEN_STATE_UPDATES_DEFAULT,
    synchronousHeaderConfigUpdatesEnabled:
      RNS_SYNCHRONOUS_HEADER_CONFIG_STATE_UPDATES_DEFAULT,
    synchronousHeaderSubviewUpdatesEnabled:
      RNS_SYNCHRONOUS_HEADER_SUBVIEW_STATE_UPDATES_DEFAULT,
    androidResetScreenShadowStateOnOrientationChangeEnabled:
      RNS_ANDROID_RESET_SCREEN_SHADOW_STATE_ON_ORIENTATION_CHANGE_DEFAULT,
    iosPreventReattachmentOfDismissedScreens:
      RNS_IOS_PREVENT_REATTACHMENT_OF_DISMISSED_SCREENS,
  },
  stable: {},
};

type EXPERIMENTAL_FF = keyof typeof _featureFlags.experiment;

const createExperimentalFeatureFlagAccessor = <T extends EXPERIMENTAL_FF>(
  key: T,
  defaultValue: (typeof _featureFlags.experiment)[T],
) => {
  return {
    get() {
      return _featureFlags.experiment[key];
    },
    set(value: (typeof _featureFlags.experiment)[T]) {
      if (
        value !== _featureFlags.experiment[key] &&
        _featureFlags.experiment[key] !== defaultValue
      ) {
        console.error(
          `[RNScreens] ${key} feature flag modified for a second time; this might lead to unexpected effects`,
        );
      }
      _featureFlags.experiment[key] = value;
    },
  };
};

const controlledBottomTabsAccessor = createExperimentalFeatureFlagAccessor(
  'controlledBottomTabs',
  RNS_CONTROLLED_BOTTOM_TABS_DEFAULT,
);
const synchronousScreenUpdatesAccessor = createExperimentalFeatureFlagAccessor(
  'synchronousScreenUpdatesEnabled',
  RNS_SYNCHRONOUS_SCREEN_STATE_UPDATES_DEFAULT,
);
const synchronousHeaderConfigUpdatesAccessor =
  createExperimentalFeatureFlagAccessor(
    'synchronousHeaderConfigUpdatesEnabled',
    RNS_SYNCHRONOUS_HEADER_CONFIG_STATE_UPDATES_DEFAULT,
  );
const synchronousHeaderSubviewUpdatesAccessor =
  createExperimentalFeatureFlagAccessor(
    'synchronousHeaderSubviewUpdatesEnabled',
    RNS_SYNCHRONOUS_HEADER_SUBVIEW_STATE_UPDATES_DEFAULT,
  );
const androidResetScreenShadowStateOnOrientationChangeAccessor =
  createExperimentalFeatureFlagAccessor(
    'androidResetScreenShadowStateOnOrientationChangeEnabled',
    RNS_ANDROID_RESET_SCREEN_SHADOW_STATE_ON_ORIENTATION_CHANGE_DEFAULT,
  );
const iosPreventReattachmentOfDismissedScreensAccessor =
  createExperimentalFeatureFlagAccessor(
    'iosPreventReattachmentOfDismissedScreens',
    RNS_IOS_PREVENT_REATTACHMENT_OF_DISMISSED_SCREENS,
  );

/**
 * Exposes configurable global behaviour of the library.
 *
 * Most of these can be overridden on particular component level, these are global switches.
 */
export const featureFlags = {
  /**
   *  Flags to enable experimental features. These might be removed w/o notice or moved to stable.
   */
  experiment: {
    get controlledBottomTabs() {
      return controlledBottomTabsAccessor.get();
    },
    set controlledBottomTabs(value: boolean) {
      controlledBottomTabsAccessor.set(value);
    },
    get synchronousScreenUpdatesEnabled() {
      return synchronousScreenUpdatesAccessor.get();
    },
    set synchronousScreenUpdatesEnabled(value: boolean) {
      synchronousScreenUpdatesAccessor.set(value);
    },
    get synchronousHeaderConfigUpdatesEnabled() {
      return synchronousHeaderConfigUpdatesAccessor.get();
    },
    set synchronousHeaderConfigUpdatesEnabled(value: boolean) {
      synchronousHeaderConfigUpdatesAccessor.set(value);
    },
    get synchronousHeaderSubviewUpdatesEnabled() {
      return synchronousHeaderSubviewUpdatesAccessor.get();
    },
    set synchronousHeaderSubviewUpdatesEnabled(value: boolean) {
      synchronousHeaderSubviewUpdatesAccessor.set(value);
    },
    get androidResetScreenShadowStateOnOrientationChangeEnabled() {
      return androidResetScreenShadowStateOnOrientationChangeAccessor.get();
    },
    set androidResetScreenShadowStateOnOrientationChangeEnabled(
      value: boolean,
    ) {
      androidResetScreenShadowStateOnOrientationChangeAccessor.set(value);
    },
    get iosPreventReattachmentOfDismissedScreens() {
      return iosPreventReattachmentOfDismissedScreensAccessor.get();
    },
    set iosPreventReattachmentOfDismissedScreens(value: boolean) {
      iosPreventReattachmentOfDismissedScreensAccessor.set(value);
    },
  },
  /**
   * Section for stable flags, which can be used to configure library behaviour.
   */
  stable: {},
};

export default featureFlags;
