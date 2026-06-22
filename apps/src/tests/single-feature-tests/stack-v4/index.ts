import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestStackV4Orientation from './stack-v4-orientation';

export { TestStackV4Orientation } from './stack-v4-orientation';

const scenarios = { TestStackV4Orientation };

const StackV4ScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Stack v4',
  details: 'Single feature tests for Stack v4',
  scenarios,
};

export default StackV4ScenarioGroup;
