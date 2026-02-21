import { ScenarioGroup } from '../../shared/helpers';
import TestSvmDetectsScrollView from './test-svm-detects-scroll-view';

const ScrollViewMarkerScenarioGroup: ScenarioGroup = {
  name: 'ScrollViewMarker scenarios',
  details: 'Scenarios related to ScrollViewMarker component',
  scenarios: [TestSvmDetectsScrollView],
};

export default ScrollViewMarkerScenarioGroup;
