import { ScenarioGroup } from "@apps/tests/shared/helpers";
import TestSAVRespectsWindowInsets from "./test-sav-respects-window-insets";

const scenarios = {
  TestSAVRespectsWindowInsets
};

const SAVScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Safe Area View',
  details: 'Single feature tests for the SafeAreaView component',
  scenarios,
};

export default SAVScenarioGroup;
