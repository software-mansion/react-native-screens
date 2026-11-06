import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestSvmConfiguresScrollView from './test-svm-configures-scroll-view';
import TestSvmWrappedScrollView from './test-svm-wrapped-scroll-view';

export { default as TestSvmConfiguresScrollView } from './test-svm-configures-scroll-view';
export { default as TestSvmWrappedScrollView } from './test-svm-wrapped-scroll-view';

const scenarios = { TestSvmConfiguresScrollView, TestSvmWrappedScrollView };

const ScrollViewMarkerScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'ScrollViewMarker scenarios',
  details: 'Scenarios related to ScrollViewMarker component',
  scenarios,
};

export default ScrollViewMarkerScenarioGroup;
