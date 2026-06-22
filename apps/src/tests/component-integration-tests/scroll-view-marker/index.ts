import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestSvmTabsEdgeEffects from './test-svm-tabs-edge-effects';
import TestStackSvmTabsSpecialEffects from './test-stack-svm-tabs-special-effects';

const scenarios = { TestSvmTabsEdgeEffects, TestStackSvmTabsSpecialEffects };

const TestSvmScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'ScrollViewMarker integration cases',
  details: 'Test interaction between ScrollViewMarker and various components',
  scenarios,
};

export default TestSvmScenarioGroup;
