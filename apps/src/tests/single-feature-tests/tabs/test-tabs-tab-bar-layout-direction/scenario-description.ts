import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Layout Direction',
  key: 'test-tabs-tab-bar-layout-direction',
  details:
    'Tests how tabs handle system, React Native and prop layout direction.',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.5'],
      testOn: ['iOS 18.6', 'iOS 26.5'],
    },
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  deviceSetup: {
    iphone:
      'An RTL language (Arabic or Hebrew) available as a system language. Start with an LTR system language (e.g. English); switch to the RTL language for the System RTL sections.',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Covers all scenarios for LTR/RTL configurations. iOS: the system RTL direction is set by the app configuration settings AppleTextDirection, NSForceRightToLeftWritingDirection and I18NIsRTL set to YES during the app launch sequence. Android: via React Native - RTL direction must be triggered using the forceRTL toggle located within the Layout Direction screen. Scenarios where RTL is enabled at the device level by setting a system-wide RTL language are NOT covered by E2E tests.',
  smokeTest: false,
};
