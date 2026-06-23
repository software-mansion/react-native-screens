import type { ScenarioGroup } from '@apps/tests/shared/helpers';

import TestTabsSimpleNav from './test-tabs-simple-nav';
import TestTabsPreventNativeSelection from './test-tabs-prevent-native-selection';
import TestTabsStaleStateUpdateRejection from './test-tabs-stale-update-rejection';
import TestTabsAppearanceDefinedBySelectedTab from './test-tabs-appearance-defined-by-selected-tab';
import TestTabsTabBarColorScheme from './test-tabs-tab-bar-color-scheme';
import TestTabsOverrideScrollViewContentInset from './test-tabs-override-scroll-view-content-inset-ios';
import TestTabsTabBarHidden from './test-tabs-tab-bar-hidden';
import TestTabsTabBarLayoutDirection from './test-tabs-tab-bar-layout-direction';
import TestTabsIMEInsets from './test-tabs-ime-insets-android';
import TestTabsSpecialEffectsScrollToTop from './test-tabs-special-effects-scroll-to-top';
import TestTabsLifecycleEvents from './test-tabs-lifecycle-events';
import TestTabsNativeContainerStyle from './test-tabs-native-container-style';
import TestTabsGeneralAppearanceNoLiquidGlass from './test-tabs-general-appearance-no-liquid-glass-ios';
import TestTabsGeneralAppearance from './test-tabs-general-appearance-android';
import TestTabsLayoutAppearances from './test-tabs-layout-appearances-ios';
import TestTabsItemIcon from './test-tabs-item-icon';
import TestTabsItemTitle from './test-tabs-item-title';
import TestTabsItemBadge from './test-tabs-item-badge';
import TestTabsSystemItem from './test-tabs-system-item-ios';
import TestTabsMoreNavigationController from './test-tabs-more-navigation-controller-ios';
import TestTabsTabBarMinimizeBehavior from './test-tabs-tab-bar-minimize-behavior-ios';
import TestTabsTabBarControllerMode from './test-tabs-tab-bar-controller-mode-ios';
import TestTabsBottomAccessory from './test-tabs-bottom-accessory-layout-ios';
import TestTabsScreenOrientation from './test-tabs-screen-orientation';
import TestTabsTabBarExperimentalUserInterfaceStyle from './test-tabs-tab-bar-experimental-user-interface-style-ios';

export { TestTabsAppearanceDefinedBySelectedTab } from './test-tabs-appearance-defined-by-selected-tab';

const scenarios = {
  TestTabsSimpleNav,
  TestTabsPreventNativeSelection,
  TestTabsStaleStateUpdateRejection,
  TestTabsAppearanceDefinedBySelectedTab,
  TestTabsTabBarColorScheme,
  TestTabsOverrideScrollViewContentInset,
  TestTabsTabBarHidden,
  TestTabsTabBarLayoutDirection,
  TestTabsIMEInsets,
  TestTabsSpecialEffectsScrollToTop,
  TestTabsLifecycleEvents,
  TestTabsNativeContainerStyle,
  TestTabsGeneralAppearanceNoLiquidGlass,
  TestTabsGeneralAppearance,
  TestTabsLayoutAppearances,
  TestTabsItemIcon,
  TestTabsItemTitle,
  TestTabsItemBadge,
  TestTabsSystemItem,
  TestTabsMoreNavigationController,
  TestTabsTabBarMinimizeBehavior,
  TestTabsTabBarControllerMode,
  TestTabsBottomAccessory,
  TestTabsScreenOrientation,
  TestTabsTabBarExperimentalUserInterfaceStyle,
};

const TabsScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Tabs',
  details: 'Single feature tests for tabs',
  scenarios,
};

export default TabsScenarioGroup;
