import { ScenarioGroup } from '../../shared/helpers';
import TestSvmActiveScrollViewForTabs from './test-svm-active-scroll-view-for-tabs';
import TestSvmConfiguresScrollView from './test-svm-configures-scroll-view';

const ScrollViewMarkerScenarioGroup: ScenarioGroup = {
  name: 'ScrollViewMarker scenarios',
  details: 'Scenarios related to ScrollViewMarker component',
  scenarios: [TestSvmConfiguresScrollView, TestSvmActiveScrollViewForTabs],
};

export default ScrollViewMarkerScenarioGroup;
