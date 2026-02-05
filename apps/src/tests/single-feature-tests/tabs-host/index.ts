import { Scenario } from '../../shared/helpers';

import BottomAccessory from './BottomAccessory';
import TabBarHidden from './TabBarHidden';

const BottomTabsScenarios: Scenario[] = [
  {
    name: 'bottomAccessory',
    key: 'bottomAccessory',
    platforms: ['ios'],
    AppComponent: BottomAccessory,
  },
  {
    name: 'tabBarHidden',
    key: 'tabBarHidden',
    platforms: ['ios', 'android'],
    AppComponent: TabBarHidden,
  },
];

export default BottomTabsScenarios;
