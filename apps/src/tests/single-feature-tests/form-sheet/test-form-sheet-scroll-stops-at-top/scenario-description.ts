import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Scroll Stops At Top',
  key: 'test-form-sheet-scroll-stops-at-top',
  details:
    'Nested ScrollView in a sheet: a drag that starts on a scrolled list stops at its top instead of moving the sheet; a drag that starts at the top moves the sheet.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
