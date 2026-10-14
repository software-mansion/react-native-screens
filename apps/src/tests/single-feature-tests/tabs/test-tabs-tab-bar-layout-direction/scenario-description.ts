import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Layout Direction',
  key: 'test-tabs-tab-bar-layout-direction',
  details:
    'Tests how tabs handle system, React Native and prop layout direction.',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'android-phone'],
  e2eCoverage: 'full',
  smokeTest: false,
};
