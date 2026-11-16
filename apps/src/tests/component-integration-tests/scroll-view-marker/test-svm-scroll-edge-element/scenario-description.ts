import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'SVM with ScrollEdgeElement',
  key: 'test-svm-scroll-edge-element',
  details:
    'A custom floating header and pinned footer over a marked ScrollView. ' +
    'Wrapped in ScrollEdgeElement, they get the scroll edge effect of the ' +
    'marked ScrollView. Covers no container, Stack v4 (with a native header ' +
    'for reference), Stack v5, Tabs and JS bottom tabs.',
  platforms: ['ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
