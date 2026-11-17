import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'iPad Layout (PageSheet vs FormSheet)',
  key: 'test-page-sheet-ipad-layout-ios',
  details:
    'PageSheet and FormSheet with the same props side by side: on iPad the page sheet is a wide bottom-anchored card, the form sheet a centered panel; on iPhone they are identical.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
