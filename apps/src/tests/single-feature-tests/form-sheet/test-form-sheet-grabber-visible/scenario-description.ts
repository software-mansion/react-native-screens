import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Grabber visibility',
  key: 'test-form-sheet-grabber-visible',
  details:
    'Allows to test the `prefersGrabberVisible` prop of the FormSheet component.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
