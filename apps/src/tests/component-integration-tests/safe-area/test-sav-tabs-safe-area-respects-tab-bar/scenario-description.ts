import { ScenarioDescription } from "@apps/tests/shared/helpers";

export const scenarioDescription: ScenarioDescription = {
  name: 'SaveAreaView and window insets',
  key: 'test-sav-respects-window-insets',
  details: 'SafeAreaView should allow avoiding window insets',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
