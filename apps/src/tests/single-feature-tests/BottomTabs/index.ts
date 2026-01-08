import { Scenario } from "../../shared/helpers";

import BottomAccessory from './BottomAccessory';
import TabBarHidden from './TabBarHidden';

const BottomTabsScenarios: Scenario[] = [
  { name: 'bottomAccessory', key: 'bottomAccessory', platforms: ['ios'], screen: BottomAccessory },
  { name: 'tabBarHidden', key: 'tabBarHidden', platforms: ['ios', 'android'], screen: TabBarHidden },
];

export default BottomTabsScenarios;