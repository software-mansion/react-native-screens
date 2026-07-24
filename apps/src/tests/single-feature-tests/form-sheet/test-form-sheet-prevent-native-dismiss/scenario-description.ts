import { ScenarioDescription } from "@apps/tests/shared/helpers";

export const scenarioDescription: ScenarioDescription = {
  name: 'PreventNativeDismiss',
  key: 'test-form-sheet-prevent-native-dismiss',
  details:
    'Allows testing the preventNativeDismiss property and firing the onNativeDismissPrevented event.',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
