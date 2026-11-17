import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Header Mode',
  key: 'test-stack-header-mode',
  details:
    'Tests `headerMode` - whether a screen uses the navigation bar shared by the stack (`float`) ' +
    'or renders a navigation bar of its own that moves together with the screen (`screen`).',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
