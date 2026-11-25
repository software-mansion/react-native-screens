import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stale update rejection',
  key: 'test-tabs-stale-update-rejection',
  details: 'Test stale update rejection mechanism',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.4'],
      testOn: ['iOS 18.6', 'iOS 26.4'],
    },
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'All steps of Baseline and Stale rejection triggered by heavy render (rejectStaleNavStateUpdates: true) and steps 1-2 of Disabling rejectStaleNavStateUpdates at runtime (rejectStaleNavStateUpdates: false) are covered as separate test suites, each preceded by a reloadReactNative to guarantee a clean baseline. Not covered: testing changes to rejectStaleNavStateUpdates within the same session - including switching from false back to true - is not automated. Due to inconsistent behavior in Detox when toggling this setting at runtime, the only reliable way to verify the logic for both states is to restart the app between tests.',
  smokeTest: true,
};
