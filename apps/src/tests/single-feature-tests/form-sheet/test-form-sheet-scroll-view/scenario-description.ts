import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'ScrollView In Sheet',
  key: 'test-form-sheet-scroll-view',
  details:
    'ScrollView inside a two-detent sheet: scrolling expands/collapses the sheet.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
