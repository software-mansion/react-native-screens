const RNS_CONTROLLED_BOTTOM_TABS_DEFAULT = true;

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
} as const;

const _featureFlags = {
  experiment: {
    controlledBottomTabs: RNS_CONTROLLED_BOTTOM_TABS_DEFAULT,
  },
  stable: {},
};

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
      return _featureFlags.experiment.controlledBottomTabs;
    },
    set controlledBottomTabs(value: boolean) {
      if (
        value !== _featureFlags.experiment.controlledBottomTabs &&
        _featureFlags.experiment.controlledBottomTabs !==
          RNS_CONTROLLED_BOTTOM_TABS_DEFAULT
      ) {
        console.error(
          `[RNScreens] controlledBottomTabs feature flag modified for a second time; this might lead to unexpected effects`,
        );
      }
      _featureFlags.experiment.controlledBottomTabs = value;
    },
  },
  /**
   * Section for stable flags, which can be used to configure library behaviour.
   */
  stable: {},
};

export default featureFlags;
