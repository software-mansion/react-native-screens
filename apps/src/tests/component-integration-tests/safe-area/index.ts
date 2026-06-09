import { ScenarioGroup } from "@apps/tests/shared/helpers";
import TestSavTabsSafeAreaRespectsTabBar from "./test-sav-tabs-safe-area-respects-tab-bar";
import TestSavTabsSafeAreaRespectsBottomAccessory from "./test-sav-tabs-safe-area-respects-bottom-accessory";

const scenarios = {
  TestSavTabsSafeAreaRespectsTabBar,
  TestSavTabsSafeAreaRespectsBottomAccessory,
};

const SafeAreaViewScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'SafeAreaView integration tests',
  details:
    'Test interaction between different components and SafeAreaView',
  scenarios,
};

export default SafeAreaViewScenarioGroup;
