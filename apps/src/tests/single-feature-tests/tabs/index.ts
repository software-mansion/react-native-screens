import type { ScenarioGroup } from '../../shared/helpers';

import BottomAccessoryScenario from './bottom-accessory-layout';
import OverrideScrollViewContentInsetScenario from './override-scroll-view-content-inset';
import TabBarHiddenScenario from './tab-bar-hidden';
import TabsScreenOrientationScenario from './tabs-screen-orientation';
import TabBarAppearanceDefinedBySelectedTabScenario from './test-tabs-appearance-defined-by-selected-tab';
import TestTabsColorScheme from './test-tabs-color-scheme';
import TestTabsLayoutDirection from './test-tabs-layout-direction';
import TestTabsIMEInsets from './test-tabs-ime-insets';
import TestTabsSimpleNav from './test-tabs-simple-nav';
import TestTabsMoreNavigationController from './test-tabs-more-navigation-controller';
import TestTabsVisibility from './test-tab-bar-visibility';
import TestTabsControllerMode from './test-tab-bar-controller-mode-ios';
import TestTabBarMinimizeBehavior from './test-tab-bar-minimize-behavior-ios';
import TestTabBarDarkExperimentalUserInterfaceStyle from './test-tab-bar-dark-experimental-userInterfaceStyle-ios';
import TestTabBarLightExperimentalUserInterfaceStyle from './test-tab-bar-light-experimental-userInterfaceStyle-ios';

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
  TestTabsVisibility,
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
