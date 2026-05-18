import type { ScenarioDescription } from '@apps/tests/shared/helpers';

const scenarioDescription: ScenarioDescription = {
  name: 'Grabber visibility',
  key: 'test-form-sheet-grabber-visible-ios',
  details:
    'Allows to test the `prefersGrabberVisible` prop of the FormSheet component.',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};

export default scenarioDescription;
