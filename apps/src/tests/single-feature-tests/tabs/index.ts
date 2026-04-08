import type { ScenarioGroup } from '@apps/tests/shared/helpers';

import BottomAccessoryScenario from './bottom-accessory-layout';
import OverrideScrollViewContentInsetScenario from './override-scroll-view-content-inset';
import TestTabsTabBarHidden from './test-tabs-tab-bar-hidden';
import TabsScreenOrientationScenario from './tabs-screen-orientation';
import TabBarAppearanceDefinedBySelectedTabScenario from './test-tabs-appearance-defined-by-selected-tab';
import TestTabsColorScheme from './test-tabs-color-scheme';
import TestTabsLayoutDirection from './test-tabs-layout-direction';
import TestTabsIMEInsets from './test-tabs-ime-insets';
import TestTabsSimpleNav from './test-tabs-simple-nav';
import TestTabsMoreNavigationController from './test-tabs-more-navigation-controller';
import TestTabsStaleStateUpdateRejection from './test-tabs-stale-update-rejection';
import TestTabsTabBarMinimizeBehavior from './test-tabs-tab-bar-minimize-behavior-ios';
import TestTabsTabBarControllerMode from './test-tabs-tab-bar-controller-mode-ios';

const scenarios = {
  BottomAccessoryScenario,
  OverrideScrollViewContentInsetScenario,
  TabBarAppearanceDefinedBySelectedTabScenario,
  TestTabsTabBarHidden,
  TabsScreenOrientationScenario,
  TestTabsColorScheme,
  TestTabsLayoutDirection,
  TestTabsIMEInsets,
  TestTabsSimpleNav,
  TestTabsMoreNavigationController,
  TestTabsStaleStateUpdateRejection,
  TestTabsTabBarMinimizeBehavior,
  TestTabsTabBarControllerMode,
};

const TabsScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Tabs',
  details: 'Single feature tests for tabs',
  scenarios,
};

export default TabsScenarioGroup;
