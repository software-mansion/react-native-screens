import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Color Scheme',
  key: 'test-tabs-tab-bar-color-scheme',
  details: 'Tests how tabs handle system, React Native and prop color scheme.',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.2'],
      testOn: ['iOS 18.6', 'iOS 26.2'],
    },
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Not automated. Detox does not have access to color attributes, so it is impossible to verify if the color has changed in response to a style update.',
  smokeTest: true,
};
