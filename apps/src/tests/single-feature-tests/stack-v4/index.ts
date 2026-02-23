import type { ScenarioGroup } from '../../shared/helpers';
import Orientation from './stack-v4-orientation';

const scenarios = { Orientation };

const StackV4ScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Stack v4',
  details: 'Single feature tests for Stack v4',
  scenarios,
};

export default StackV4ScenarioGroup;
