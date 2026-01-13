import { Scenario } from "../../shared/helpers";
import Orientation from "./Orientation";

const BottomTabsScreenScenarios: Scenario[] = [
  { name: "orientation", key: "orientation", screen: Orientation, platforms: ['ios', 'android'] },
];

export default BottomTabsScreenScenarios;