import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Prevent native dismiss - single stack',
  key: 'test-stack-prevent-native-dismiss-single-stack',
  details:
    'Test prevent native dismiss behavior in simple single-stack scenario',
  platforms: ['android'],
  devices: ['android-phone'],
  osVersions: {
    'android-phone': { createdOn: ['API Level 36'], testOn: ['API Level 36'] },
  },
  deviceSetup: {
    'android-phone':
      'Gesture navigation enabled (Settings → Navigation mode → Gesture navigation), needed for the system gesture-back steps.',
  },
  e2eCoverage: 'incomplete',
  e2eCoverageDetails:
    'Covered: pop actions triggered by the Pop button; header back chevron/button behavior when preventNativeDismiss is Enabled; runtime toggling of the flag on B: the label flips in both directions, and a chevron press made immediately after a toggle honors the latest value. Manual only: pop actions triggered by the system back gesture (edge swipe); pop actions triggered by the header back chevron when preventNativeDismiss is Disabled, including the pop expected after toggling B to Disabled.',
  smokeTest: false,
};
