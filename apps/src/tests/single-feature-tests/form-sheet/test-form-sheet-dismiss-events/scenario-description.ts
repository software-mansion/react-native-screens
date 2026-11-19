import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Dismiss Events',
  key: 'test-form-sheet-dismiss-events',
  details:
    'onDismiss vs onNativeDismiss: which event fires for JS and native dismissal.',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'ipad', 'android-phone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 26.5'],
      testOn: ['iOS 18.6', 'iOS 26.5'],
    },
    ipad: { createdOn: ['iPadOS 26.5'], testOn: ['iPadOS 26.5'] },
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  deviceSetup: {
    ipad: 'App in full-screen mode (regular width and regular height size classes).',
  },
  e2eCoverage: 'full',
  e2eCoverageDetails:
    'Covers all manual scenario steps on iPhone, iPad and Android phone. The system back step runs on Android only.',
  smokeTest: false,
};
