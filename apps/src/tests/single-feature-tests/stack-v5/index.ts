import type { ScenarioGroup } from '../../shared/helpers';
import PreventNativeDismissSingleStack from './prevent-native-dismiss-single-stack';
import PreventNativeDismissNestedStack from './prevent-native-dismiss-nested-stack';
import AnimationAndroid from './test-animation-android';

const scenarios = {
  PreventNativeDismissSingleStack,
  PreventNativeDismissNestedStack,
  AnimationAndroid,
};

const StackScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Stack v5',
  details: 'Single feature tests for new stack implementation',
  scenarios,
};

export default StackScenarioGroup;
