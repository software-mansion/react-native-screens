import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Expand On Scroll To Edge (iOS)',
  key: 'test-form-sheet-expand-scroll-view-ios',
  details:
    'prefersScrollingExpandsWhenScrolledToEdge with a nested ScrollView: does scrolling expand the sheet.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
