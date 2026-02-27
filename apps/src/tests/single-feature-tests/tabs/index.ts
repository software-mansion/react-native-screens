import type { ScenarioGroup } from '../../shared/helpers';

import BottomAccessoryScenario from './bottom-accessory-layout';
import OverrideScrollViewContentInsetScenario from './override-scroll-view-content-inset';
import TabBarHiddenScenario from './tab-bar-hidden';
import TabsScreenOrientationScenario from './tabs-screen-orientation';
import UserInterfaceStyleScenario from './user-interface-style';

const TabsScenarioGroup: ScenarioGroup = {
  name: 'Tabs',
  details: 'Single feature tests for tabs',
  scenarios: [
    BottomAccessoryScenario,
    OverrideScrollViewContentInsetScenario,
    TabBarHiddenScenario,
    TabsScreenOrientationScenario,
    UserInterfaceStyleScenario,
  ],
};

export default TabsScenarioGroup;
