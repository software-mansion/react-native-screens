import { Scenario } from "../../shared/helpers";
import StackInTabs from "./StackInTabs";
import TabsInStack from "./TabsInStack";

const OrientationScenarios: Scenario[] = [
  { name: "StackInBottomTabs", details: "Configuration in Stack contained within TabScreen always takes precedence", key: "StackInBottomTabs", screen: StackInTabs, platforms: ['ios'] },
  { name: "BottomTabsInStack", details: "Configuration in BottomTabs contained within StackScreen should have precedence over configuraton in Stack contained within TabScreen", key: "BottomTabsInStack", screen: TabsInStack, platforms: ['ios'] },
];

export default OrientationScenarios;