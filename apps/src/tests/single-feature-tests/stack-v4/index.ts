import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestStackV4Orientation from './stack-v4-orientation';
import TestStackV4DeferSystemGestures from './stack-v4-defer-system-gestures';

export { default as TestStackV4Orientation } from './stack-v4-orientation';
export { default as TestStackV4DeferSystemGestures } from './stack-v4-defer-system-gestures';

const scenarios = { TestStackV4Orientation, TestStackV4DeferSystemGestures };

const StackV4ScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Stack v4',
  details: 'Single feature tests for Stack v4',
  scenarios,
};

export default StackV4ScenarioGroup;
