const RNS_SYNCHRONOUS_SCREEN_STATE_UPDATES_DEFAULT = false;
const RNS_SYNCHRONOUS_HEADER_CONFIG_STATE_UPDATES_DEFAULT = false;
const RNS_SYNCHRONOUS_HEADER_SUBVIEW_STATE_UPDATES_DEFAULT = false;
const RNS_ANDROID_LEGACY_TOP_INSET_BEHAVIOR_DEFAULT = false;
const RNS_ANDROID_RESET_SCREEN_SHADOW_STATE_ON_ORIENTATION_CHANGE_DEFAULT =
  true;
const RNS_IOS_PREVENT_REATTACHMENT_OF_DISMISSED_SCREENS = true;
const RNS_IOS_PREVENT_REATTACHMENT_OF_DISMISSED_MODALS = true;
const RNS_IOS_26_ALLOW_INTERACTIONS_DURING_TRANSITION = true;
const RNS_DEBUG_LOGGING = false;

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

  /**
   * Numerous "breaking changes" in the yet-experimental Tabs API have been
   * introduced with version 4.25.0 of the library.
   *
   * This flag marks the shape of the API that's meant for stabilisation, and
   * enables downstream to detect these changes.
   *
   * See:
   * * https://github.com/software-mansion/react-native-screens/pull/3888
   * * https://github.com/software-mansion/react-native-screens/pull/3776
   * * https://github.com/software-mansion/react-native-screens/pull/3781
   * * https://github.com/software-mansion/react-native-screens/pull/3756
   * * https://github.com/software-mansion/react-native-screens/pull/3808
   * * https://github.com/software-mansion/react-native-screens/pull/3785
   * * https://github.com/software-mansion/react-native-screens/pull/3789
   * * https://github.com/software-mansion/react-native-screens/pull/3794
   * * https://github.com/software-mansion/react-native-screens/pull/3863
   * * https://github.com/software-mansion/react-native-screens/pull/3875
   * * https://github.com/software-mansion/react-native-screens/pull/3895
   * * https://github.com/software-mansion/react-native-screens/pull/3918
   */
  usesStableTabsApi: true,
} as const;

const _featureFlags = {
  experiment: {
    synchronousScreenUpdatesEnabled:
      RNS_SYNCHRONOUS_SCREEN_STATE_UPDATES_DEFAULT,
    synchronousHeaderConfigUpdatesEnabled:
      RNS_SYNCHRONOUS_HEADER_CONFIG_STATE_UPDATES_DEFAULT,
    synchronousHeaderSubviewUpdatesEnabled:
      RNS_SYNCHRONOUS_HEADER_SUBVIEW_STATE_UPDATES_DEFAULT,
    androidLegacyTopInsetBehavior:
      RNS_ANDROID_LEGACY_TOP_INSET_BEHAVIOR_DEFAULT,
    androidResetScreenShadowStateOnOrientationChangeEnabled:
      RNS_ANDROID_RESET_SCREEN_SHADOW_STATE_ON_ORIENTATION_CHANGE_DEFAULT,
    iosPreventReattachmentOfDismissedScreens:
      RNS_IOS_PREVENT_REATTACHMENT_OF_DISMISSED_SCREENS,
    iosPreventReattachmentOfDismissedModals:
      RNS_IOS_PREVENT_REATTACHMENT_OF_DISMISSED_MODALS,
    ios26AllowInteractionsDuringTransition:
      RNS_IOS_26_ALLOW_INTERACTIONS_DURING_TRANSITION,
  },
  stable: {
    debugLogging: RNS_DEBUG_LOGGING,
  },
};

type EXPERIMENTAL_FF = keyof typeof _featureFlags.experiment;
type STABLE_FF = keyof typeof _featureFlags.stable;

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

const createStableFeatureFlagAccessor = <T extends STABLE_FF>(
  key: T,
  defaultValue: (typeof _featureFlags.stable)[T],
) => {
  return {
    get() {
      return _featureFlags.stable[key];
    },
    set(value: (typeof _featureFlags.stable)[T]) {
      if (
        value !== _featureFlags.stable[key] &&
        _featureFlags.stable[key] !== defaultValue
      ) {
        console.error(
          `[RNScreens] ${key} feature flag modified for a second time; this might lead to unexpected effects`,
        );
      }
      _featureFlags.stable[key] = value;
    },
  };
};

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
const androidLegacyTopInsetBehaviorAccessor =
  createExperimentalFeatureFlagAccessor(
    'androidLegacyTopInsetBehavior',
    RNS_ANDROID_LEGACY_TOP_INSET_BEHAVIOR_DEFAULT,
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
const iosPreventReattachmentOfDismissedModalsAccessor =
  createExperimentalFeatureFlagAccessor(
    'iosPreventReattachmentOfDismissedModals',
    RNS_IOS_PREVENT_REATTACHMENT_OF_DISMISSED_MODALS,
  );
const ios26AllowInteractionsDuringTransitionAccessor =
  createExperimentalFeatureFlagAccessor(
    'ios26AllowInteractionsDuringTransition',
    RNS_IOS_26_ALLOW_INTERACTIONS_DURING_TRANSITION,
  );
const rnsDebugLoggingAccessor = createStableFeatureFlagAccessor(
  'debugLogging',
  RNS_DEBUG_LOGGING,
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
    get androidLegacyTopInsetBehavior() {
      return androidLegacyTopInsetBehaviorAccessor.get();
    },
    set androidLegacyTopInsetBehavior(value: boolean) {
      androidLegacyTopInsetBehaviorAccessor.set(value);
    },
    get androidResetScreenShadowStateOnOrientationChangeEnabled() {
      return androidResetScreenShadowStateOnOrientationChangeAccessor.get();
    },
    set androidResetScreenShadowStateOnOrientationChangeEnabled(
      value: boolean,
    ) {
      androidResetScreenShadowStateOnOrientationChangeAccessor.set(value);
    },
    /**
     * Enables the fix for native / JS state desynchronization in Stack. On by default.
     * PR: https://github.com/software-mansion/react-native-screens/pull/3584
     */
    get iosPreventReattachmentOfDismissedScreens() {
      return iosPreventReattachmentOfDismissedScreensAccessor.get();
    },
    set iosPreventReattachmentOfDismissedScreens(value: boolean) {
      iosPreventReattachmentOfDismissedScreensAccessor.set(value);
    },
    /**
     * Enables the fix for native / JS state desynchronization for Modals. On by default.
     * PR: https://github.com/software-mansion/react-native-screens/pull/3760
     */
    get iosPreventReattachmentOfDismissedModals() {
      return iosPreventReattachmentOfDismissedModalsAccessor.get();
    },
    set iosPreventReattachmentOfDismissedModals(value: boolean) {
      iosPreventReattachmentOfDismissedModalsAccessor.set(value);
    },
    /**
     * Disables the behavior that blocks interactions during Stack Screen transition.
     * The application should immediately react to user gestures, dismissing more screens at once, etc.
     * Use only with `iosPreventReattachmentOfDismissedScreens = true` to enable the fix
     * for native / JS state desynchronization. On by default.
     * PR: https://github.com/software-mansion/react-native-screens/pull/3631
     */
    get ios26AllowInteractionsDuringTransition() {
      return ios26AllowInteractionsDuringTransitionAccessor.get();
    },
    set ios26AllowInteractionsDuringTransition(value: boolean) {
      ios26AllowInteractionsDuringTransitionAccessor.set(value);
    },
  },
  /**
   * Section for stable flags, which can be used to configure library behaviour.
   */
  stable: {
    get debugLogging() {
      return rnsDebugLoggingAccessor.get();
    },
    set debugLogging(value: boolean) {
      rnsDebugLoggingAccessor.set(value);
    },
  },
};

export default featureFlags;
