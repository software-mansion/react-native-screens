import type { ScenarioGroup } from '../../shared/helpers';

import BottomAccessoryScenario from './bottom-accessory-layout';
import OverrideScrollViewContentInsetScenario from './override-scroll-view-content-inset';
import TabBarHiddenScenario from './test-tabs-hidden';
import TabsScreenOrientationScenario from './tabs-screen-orientation';
import TabBarAppearanceDefinedBySelectedTabScenario from './test-tabs-appearance-defined-by-selected-tab';
import TestTabsColorScheme from './test-tabs-color-scheme';
import TestTabsLayoutDirection from './test-tabs-layout-direction';
import TestTabsIMEInsets from './test-tabs-ime-insets';
import TestTabsSimpleNav from './test-tabs-simple-nav';
import TestTabsMoreNavigationController from './test-tabs-more-navigation-controller';
import TestTabsControllerMode from './test-tabs-controller-mode-ios';
import TestTabBarMinimizeBehavior from './test-tabs-minimize-behavior-ios';
import TestTabBarDarkExperimentalUserInterfaceStyle from './test-tabs-dark-experimental-userInterfaceStyle-ios';
import TestTabBarLightExperimentalUserInterfaceStyle from './test-tabs-light-experimental-userInterfaceStyle-ios';

const scenarios = {
  BottomAccessoryScenario,
  OverrideScrollViewContentInsetScenario,
  TabBarAppearanceDefinedBySelectedTabScenario,
  TabBarHiddenScenario,
  TabsScreenOrientationScenario,
  TestTabsColorScheme,
  TestTabsLayoutDirection,
  TestTabsIMEInsets,
  TestTabsSimpleNav,
  TestTabsMoreNavigationController,
  TestTabsControllerMode,
  TestTabBarMinimizeBehavior,
  TestTabBarDarkExperimentalUserInterfaceStyle,
  TestTabBarLightExperimentalUserInterfaceStyle,
};

const TabsScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Tabs',
  details: 'Single feature tests for tabs',
  scenarios,
};

export default TabsScenarioGroup;
