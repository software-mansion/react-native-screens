import type { ScenarioGroup } from '@apps/tests/shared/helpers';

import BottomAccessoryScenario from './bottom-accessory-layout';
import OverrideScrollViewContentInsetScenario from './override-scroll-view-content-inset';
import TestTabsTabBarHidden from './test-tabs-tab-bar-hidden';
import TabsScreenOrientationScenario from './tabs-screen-orientation';
import TabBarAppearanceDefinedBySelectedTabScenario from './test-tabs-appearance-defined-by-selected-tab';
import TestTabsColorScheme from './test-tabs-color-scheme';
import TestTabsTabBarLayoutDirection from './test-tabs-tab-bar-layout-direction';
import TestTabsIMEInsets from './test-tabs-ime-insets';
import TestTabsSimpleNav from './test-tabs-simple-nav';
import TestTabsMoreNavigationController from './test-tabs-more-navigation-controller';
import TestTabsStaleStateUpdateRejection from './test-tabs-stale-update-rejection';

const scenarios = {
  BottomAccessoryScenario,
  OverrideScrollViewContentInsetScenario,
  TabBarAppearanceDefinedBySelectedTabScenario,
  TestTabsTabBarHidden,
  TabsScreenOrientationScenario,
  TestTabsColorScheme,
  TestTabsTabBarLayoutDirection,
  TestTabsIMEInsets,
  TestTabsSimpleNav,
  TestTabsMoreNavigationController,
  TestTabsStaleStateUpdateRejection,
};

const TabsScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Tabs',
  details: 'Single feature tests for tabs',
  scenarios,
};

export default TabsScenarioGroup;
