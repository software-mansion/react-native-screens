import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Split Color Scheme',
  key: 'test-split-color-scheme',
  details:
    'Tests how Split handles system, React Native and prop color scheme.',
  platforms: ['ios'],
  devices: ['iphone', 'ipad'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.3'],
      testOn: ['iOS 18.6', 'iOS 26.3'],
    },
    ipad: {
      createdOn: ['iOS 18.6', 'iOS 26.3'],
      testOn: ['iOS 18.6', 'iOS 26.3'],
    },
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails:
    'Detox does not have access to native color attributes of experimental components, making it impossible to verify if the native split view color has changed in response to a style update.',
  smokeTest: false,
};
