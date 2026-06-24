import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestOrientationStackInTabs from './orientation-stack-in-tabs';
import TestOrientationTabsInStack from './orientation-tabs-in-stack';

export { default as TestOrientationStackInTabs } from './orientation-stack-in-tabs';
export { default as TestOrientationTabsInStack } from './orientation-tabs-in-stack';

const scenarios = { TestOrientationStackInTabs, TestOrientationTabsInStack };

const OrientationScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Orientation tests',
  details:
    'Test interaction between different components when orientation changes',
  scenarios,
};

export default OrientationScenarioGroup;
