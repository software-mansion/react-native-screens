import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestSvmTabsScrollEdgeEffects from './test-svm-tabs-scroll-edge-effects';
import TestStackSvmTabsSpecialEffects from './test-stack-svm-tabs-special-effects';

const scenarios = {
  TestSvmTabsScrollEdgeEffects,
  TestStackSvmTabsSpecialEffects,
};

const TestSvmScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'ScrollViewMarker Integration Tests',
  details: 'Test interaction between ScrollViewMarker and various components',
  scenarios,
};

export default TestSvmScenarioGroup;
