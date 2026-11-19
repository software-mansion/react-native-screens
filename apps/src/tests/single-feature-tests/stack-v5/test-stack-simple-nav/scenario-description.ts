import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Simple stack navigation',
  key: 'test-stack-simple-nav',
  details: 'Test simple push and pop operations',
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
    'android-phone':
      'Gesture navigation enabled (Settings → Navigation mode → Gesture navigation), needed for the system gesture-back steps.',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'iOS: all steps except Rapid tapping (edge case), including the native header back button (Native header back button step 1); for Edge-swipe / system gesture-back step 1, only the edge-swipe pop gesture is automated. Android (describeIfAndroid): all steps of Baseline, Push navigation, Re-pushing an already-present route, Pop via the on-screen button and Route key uniqueness (edge case) only. Manual only: on Android, Native header back button step 1 and Edge-swipe / system gesture-back step 1; on iOS, Edge-swipe / system gesture-back step 1 (canceling the swipe gesture before the halfway threshold cannot be automated with Detox); on both platforms, all steps of Rapid tapping (edge case), because Detox synchronizes on UI idle states between actions and cannot dispatch taps mid-animation.',
  smokeTest: true,
};
