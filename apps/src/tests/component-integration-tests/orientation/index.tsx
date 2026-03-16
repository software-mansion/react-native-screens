import { ScenarioGroup } from '../../shared/helpers';
import StackInTabs from './orientation-stack-in-tabs';
import TabsInStack from './orientation-tabs-in-stack';

const scenarios = { StackInTabs, TabsInStack };

const OrientationScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Orientation tests',
  details:
    'Test interaction between different components when orientation changes',
  scenarios,
};

export default OrientationScenarioGroup;
