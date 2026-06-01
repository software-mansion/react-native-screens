import { ScenarioGroup } from "@apps/tests/shared/helpers";
import TestSavTabsSafeAreaRespectsTabBar from "./test-sav-tabs-safe-area-respects-tab-bar";

const scenarios = {
  TestSavTabsSafeAreaRespectsTabBar,
};

const SafeAreaViewScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'SafeAreaView integration tests',
  details:
    'Test interaction between different components and SafeAreaView',
  scenarios,
};

export default SafeAreaViewScenarioGroup;
