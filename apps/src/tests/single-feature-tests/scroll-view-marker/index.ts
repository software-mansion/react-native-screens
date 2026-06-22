import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestSvmConfiguresScrollView from './test-svm-configures-scroll-view';

export { TestSvmConfiguresScrollView } from './test-svm-configures-scroll-view';

const scenarios = { TestSvmConfiguresScrollView };

const ScrollViewMarkerScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'ScrollViewMarker scenarios',
  details: 'Scenarios related to ScrollViewMarker component',
  scenarios,
};

export default ScrollViewMarkerScenarioGroup;
