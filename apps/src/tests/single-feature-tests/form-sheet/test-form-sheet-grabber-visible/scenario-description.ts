import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Grabber Visibility',
  key: 'test-form-sheet-grabber-visible',
  details:
    'prefersGrabberVisible: toggled before presenting and while the sheet is presented.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
