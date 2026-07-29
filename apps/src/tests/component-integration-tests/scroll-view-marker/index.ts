import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestSvmTabsScrollEdgeEffects from './test-svm-tabs-scroll-edge-effects';
import TestStackSvmTabsSpecialEffects from './test-stack-svm-tabs-special-effects';
import TestStackSvmLiftOnScroll from './test-stack-svm-lift-on-scroll';

export { default as TestSvmTabsScrollEdgeEffects } from './test-svm-tabs-scroll-edge-effects';
export { default as TestStackSvmTabsSpecialEffects } from './test-stack-svm-tabs-special-effects';
export { default as TestStackSvmLiftOnScroll } from './test-stack-svm-lift-on-scroll';

const scenarios = {
  TestSvmTabsScrollEdgeEffects,
  TestStackSvmTabsSpecialEffects,
  TestStackSvmLiftOnScroll,
};

const TestSvmScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'ScrollViewMarker Integration Tests',
  details: 'Test interaction between ScrollViewMarker and various components',
  scenarios,
};

export default TestSvmScenarioGroup;
