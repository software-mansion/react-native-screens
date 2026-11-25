import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Native Container Style',
  key: 'test-tabs-native-container-style',
  details:
    'Tests the nativeContainerStyle prop with backgroundColor variations on TabsHost.',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.5'],
      testOn: ['iOS 18.6', 'iOS 26.5'],
    },
    'android-phone': {
      createdOn: ['API Level 36'],
      testOn: ['API Level 36'],
    },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Not automated. Detox cannot assert native background-color attributes on either platform, so visual verification must be done manually.',
  smokeTest: false,
};
