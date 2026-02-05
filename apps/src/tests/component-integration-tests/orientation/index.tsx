import { ScenarioGroup } from '../../shared/helpers';
import StackInTabs from './orientation-stack-in-tabs';
import TabsInStack from './orientation-tabs-in-stack';

const OrientationScenarios: ScenarioGroup = {
  name: 'Orientation tests',
  details:
    'Test interaction between different components when orientation changes',
  scenarios: [StackInTabs, TabsInStack],
};

export default OrientationScenarios;
