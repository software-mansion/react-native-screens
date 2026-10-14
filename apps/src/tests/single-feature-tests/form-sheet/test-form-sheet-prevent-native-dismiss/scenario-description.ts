import type { ScenarioDescription } from '@apps/tests/shared/helpers';

export const scenarioDescription: ScenarioDescription = {
  name: 'Prevent Native Dismiss',
  key: 'test-form-sheet-prevent-native-dismiss',
  details:
    'preventNativeDismiss + onNativeDismissPrevented: swipe-down and backdrop tap are blocked, JS dismiss works.',
  platforms: ['android', 'ios'],
  devices: ['iphone', 'ipad', 'android-phone'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
