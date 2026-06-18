import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import TestSvmTabsEdgeEffects from './test-svm-tabs-edge-effects';

const scenarios = { TestSvmTabsEdgeEffects };

const TestSvmScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'ScrollViewMarker integration cases',
  details: 'Test interaction between ScrollViewMarker and various components',
  scenarios,
};

export default TestSvmScenarioGroup;
