import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Basic Functionality',
  key: 'test-form-sheet-base',
  details:
    'Single sheet with two detents: open, drag between detents, check content layout, dismiss.',
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
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    "Covers steps 1-6 on iPhone, Android phone and iPadOS 26+ (`@ipad` suite). On iPad detents are checked relatively, by the panel's height change instead of exact detent values. Not automated: content centering and anchoring, for Android: dimming and system back in step 7.",
  smokeTest: false,
};
