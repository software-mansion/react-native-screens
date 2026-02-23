import type { ScenarioGroup } from '../../shared/helpers';
import PreventNativeDismissSingleStack from './prevent-native-dismiss-single-stack';
import PreventNativeDismissNestedStack from './prevent-native-dismiss-nested-stack';
import AnimationAndroid from './test-animation-android';

const StackScenarioGroup: ScenarioGroup = {
  name: 'Stack v5',
  details: 'Single feature tests for new stack implementation',
  scenarios: [
    PreventNativeDismissSingleStack,
    PreventNativeDismissNestedStack,
    AnimationAndroid,
  ],
};

export default StackScenarioGroup;
