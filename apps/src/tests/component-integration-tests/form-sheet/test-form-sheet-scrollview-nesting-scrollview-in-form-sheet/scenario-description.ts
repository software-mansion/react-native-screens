import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'ScrollView In Sheet',
  key: 'test-form-sheet-scrollview-nesting-scrollview-in-form-sheet',
  details:
    'ScrollView inside a two-detent sheet: scrolling expands/collapses the sheet.',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'android-phone'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
