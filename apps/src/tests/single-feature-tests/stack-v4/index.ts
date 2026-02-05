import type { ScenarioGroup } from '../../shared/helpers';
import Orientation from './stack-v4-orientation';

const StackV4ScenarioGroup: ScenarioGroup = {
  name: 'Stack v4',
  details: 'Single feature tests for Stack v4',
  scenarios: [Orientation],
};

export default StackV4ScenarioGroup;
