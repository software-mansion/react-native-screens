import type { ScenarioGroup } from '@apps/tests/shared/helpers';

import BottomAccessoryScenario from './bottom-accessory-layout';
import OverrideScrollViewContentInsetScenario from './override-scroll-view-content-inset';
import TestTabsTabBarHidden from './test-tabs-tab-bar-hidden';
import TabsScreenOrientationScenario from './tabs-screen-orientation';
import TabBarAppearanceDefinedBySelectedTabScenario from './test-tabs-appearance-defined-by-selected-tab';
import TestTabsTabBarColorScheme from './test-tabs-tab-bar-color-scheme';
import TestTabsTabBarLayoutDirection from './test-tabs-tab-bar-layout-direction';
import TestTabsIMEInsets from './test-tabs-ime-insets';
import TestTabsSimpleNav from './test-tabs-simple-nav';
import TestTabsMoreNavigationController from './test-tabs-more-navigation-controller';
import TestTabsPreventNativeSelection from './test-tabs-prevent-native-selection';
import TestTabsStaleStateUpdateRejection from './test-tabs-stale-update-rejection';
import TestTabsTabBarMinimizeBehavior from './test-tabs-tab-bar-minimize-behavior-ios';
import TestTabsTabBarControllerMode from './test-tabs-tab-bar-controller-mode-ios';
import TestTabsSpecialEffectsScrollToTop from './test-tabs-special-effects-scroll-to-top';

const scenarios = {
  BottomAccessoryScenario,
  OverrideScrollViewContentInsetScenario,
  TabBarAppearanceDefinedBySelectedTabScenario,
  TestTabsTabBarHidden,
  TabsScreenOrientationScenario,
  TestTabsTabBarColorScheme,
  TestTabsTabBarLayoutDirection,
  TestTabsIMEInsets,
  TestTabsSimpleNav,
  TestTabsMoreNavigationController,
  TestTabsPreventNativeSelection,
  TestTabsStaleStateUpdateRejection,
  TestTabsTabBarMinimizeBehavior,
  TestTabsTabBarControllerMode,
  TestTabsSpecialEffectsScrollToTop,
};

const TabsScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Tabs',
  details: 'Single feature tests for tabs',
  scenarios,
};

export default TabsScenarioGroup;
