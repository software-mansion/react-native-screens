import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestSvmConfiguresScrollView from './test-svm-configures-scroll-view';
import TestSvmNestedScrollView from './test-svm-nested-scroll-view';

export { default as TestSvmConfiguresScrollView } from './test-svm-configures-scroll-view';
export { default as TestSvmNestedScrollView } from './test-svm-nested-scroll-view';

const scenarios = { TestSvmConfiguresScrollView, TestSvmNestedScrollView };

const ScrollViewMarkerScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'ScrollViewMarker scenarios',
  details: 'Scenarios related to ScrollViewMarker component',
  scenarios,
};

export default ScrollViewMarkerScenarioGroup;
