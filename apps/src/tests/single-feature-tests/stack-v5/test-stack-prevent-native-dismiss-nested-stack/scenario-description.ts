import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Prevent native dismiss - nested stack',
  key: 'test-stack-prevent-native-dismiss-nested-stack',
  details:
    'Observe behavior of prevent native dismiss depending on configuration of nested stack hosting screen',
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
    "Where a manual step's trigger cannot be driven by Detox, the e2e asserts the same behavior with the Pop button instead. Covered: push navigation, the buttons each screen offers, and the per-route flag labels in both stacks, including the default flag restored on a fresh nested root; the header back chevron intercepted while preventNativeDismiss is Enabled, on B and on NestedB, including repeated presses firing one toast each; runtime toggling of the flag, with a chevron press honoring the latest value; pop actions triggered by the Pop button, including out of the nested stack and back onto B rather than A; only the topmost screen intercepting while B and NestedHome below it also prevent. Manual only: pop actions triggered by the system back gesture (edge swipe); pop actions triggered by the header back chevron when preventNativeDismiss is Disabled; interception after the app is backgrounded and foregrounded (issue #1775); screen and toast colors, and that NestedHome shows no header at all.",
  smokeTest: true,
};
