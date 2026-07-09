/**
 * Shared registry of native component type names used across e2e tests.
 *
 * Keeping these in one place means a native symbol rename only has to be
 * applied here, not chased down across every test that queries by type.
 */

export const RNS_TABS_BOTTOM_ACCESSORY_TYPE =
  'RNSTabsBottomAccessoryComponentView';
