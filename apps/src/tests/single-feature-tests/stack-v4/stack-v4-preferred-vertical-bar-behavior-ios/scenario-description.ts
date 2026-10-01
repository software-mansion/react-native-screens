import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Preferred Vertical Bar Behavior',
  key: 'stack-v4-preferred-vertical-bar-behavior-ios',
  details:
    'Test opting a presented form sheet out of the vertical bar on iPhone Duo (iOS 27.1+).',
  platforms: ['ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
