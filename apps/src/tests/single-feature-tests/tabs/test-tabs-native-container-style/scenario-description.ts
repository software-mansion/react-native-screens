import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Native Container Style',
  key: 'test-tabs-native-container-style',
  details: 'Tests the nativeContainerStyle prop with backgroundColor variations on the TabsContainer.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'incomplete',
  smokeTest: false,
};
