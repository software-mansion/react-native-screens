import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Stack Layout Direction',
  key: 'test-stack-layout-direction',
  details:
    'Test the direction prop on StackHost: the header and back button lay ' +
    'out against it and push and pop mirror on both platforms; on iOS ' +
    '`inherit` follows the system direction, not React Native',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'android-phone'],
  osVersions: {
    iphone: {
      createdOn: ['iOS 18.6', 'iOS 27.2'],
      testOn: ['iOS 18.6', 'iOS 27.2'],
    },
    'android-phone': { createdOn: ['API Level 37'], testOn: ['API Level 37'] },
  },
  deviceSetup: {
    iphone:
      'System RTL: an RTL system language (Arabic, Hebrew) with an RTL localization in the app (e.g. an empty `ar.lproj/InfoPlist.strings`), or launch the app with the arguments `-AppleTextDirection YES -NSForceRightToLeftWritingDirection YES` (Xcode: scheme → Run → Options → App Language → Right-to-Left Pseudolanguage). System LTR: English, launched without those arguments.',
    'android-phone':
      'API 33 or newer for the push and pop steps (below API 33 the `default` animation is a zoom with no sideways motion).',
  },
  e2eCoverage: 'tbd',
  e2eCoverageDetails:
    'The probe and title bounds are readable with Detox, the back button side and the transition direction are not; not implemented yet.',
  smokeTest: false,
};
