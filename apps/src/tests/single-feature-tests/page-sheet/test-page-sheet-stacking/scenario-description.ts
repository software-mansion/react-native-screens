import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Mixed Stacking (PageSheet & FormSheet)',
  key: 'test-page-sheet-stacking',
  details:
    'PageSheet over FormSheet over PageSheet: dismissing the top, middle and bottom sheet of a mixed-style stack.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
