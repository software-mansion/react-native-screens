import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Prevent native dismiss - tabs in stack',
  key: 'test-stack-prevent-native-dismiss-tabs-in-stack',
  details:
    'System back with a preventNativeDismiss screen inside a stack nested in a tab, itself nested in a stack',
  platforms: ['android'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
