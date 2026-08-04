import { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'OnDetentChanged',
  key: 'test-form-sheet-on-detent-changed',
  details:
    'Allows testing the onDetentChanged event, verifying that the correct detent index is reported when swiping.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
