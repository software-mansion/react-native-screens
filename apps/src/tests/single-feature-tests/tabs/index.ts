import type { ScenarioGroup } from '../../shared/helpers';

import BottomAccessoryScenario from './bottom-accessory-layout';
import OverrideScrollViewContentInsetScenario from './override-scroll-view-content-inset';
import TabBarHiddenScenario from './tab-bar-hidden';
import TabsScreenOrientationScenario from './tabs-screen-orientation';

const TabsScenarioGroup: ScenarioGroup = {
  name: 'Tabs',
  details: 'Single feature tests for tabs',
  scenarios: [
    BottomAccessoryScenario,
    OverrideScrollViewContentInsetScenario,
    TabBarHiddenScenario,
    TabsScreenOrientationScenario,
  ],
};

export default TabsScenarioGroup;
