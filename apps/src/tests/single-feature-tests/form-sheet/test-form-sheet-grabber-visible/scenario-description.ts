import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Grabber Visibility',
  key: 'test-form-sheet-grabber-visible',
  details:
    'prefersGrabberVisible: toggled before presenting and while the sheet is presented.',
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
    'Covers grabber visibility in all steps and the lower detent on presentation, on iPhone and Android phone. Not automated: Android content position relative to the drag handle; on iOS, the grabber hiding in "Toggling from inside the sheet" step 2 (UIKit keeps _UIGrabber in the hierarchy at alpha 0, which Detox still reports visible).',
  smokeTest: false,
};
