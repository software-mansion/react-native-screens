import { Scenario } from '../../shared/helpers';
import StackInTabs from './StackInTabs';
import TabsInStack from './TabsInStack';

const OrientationScenarios: Scenario[] = [
  {
    name: 'StackInTabs',
    details:
      'Configuration in Stack contained within TabScreen always takes precedence',
    key: 'StackInTabs',
    screen: StackInTabs,
    platforms: ['ios'],
  },
  {
    name: 'TabsInStack',
    details:
      'Configuration in Tabs contained within StackScreen should have precedence over configuraton in Stack contained within TabScreen',
    key: 'TabsInStack',
    screen: TabsInStack,
    platforms: ['ios'],
  },
];

export default OrientationScenarios;
