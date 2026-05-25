import { ScenarioDescription } from "@apps/tests/shared/helpers";

export const scenarioDescription: ScenarioDescription = {
  name: 'SafeAreaView respects tab bar',
  key: 'test-sav-respects-window-insets',
  details: 'SafeAreaView should allow avoiding tab bar',
  platforms: ['android', 'ios'],
  e2eCoverage: 'tbd',
  smokeTest: false,
};
