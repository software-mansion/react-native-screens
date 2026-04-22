import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import PreventNativeDismissSingleStack from './prevent-native-dismiss-single-stack';
import PreventNativeDismissNestedStack from './prevent-native-dismiss-nested-stack';
import AnimationAndroid from './test-animation-android';
import TestStackSimpleNav from './test-stack-simple-nav';
import TestStackSubviews from './test-stack-subviews-android';
import TestStackBackButton from './test-stack-back-button-android';

const scenarios = {
  PreventNativeDismissSingleStack,
  PreventNativeDismissNestedStack,
  AnimationAndroid,
  TestStackSimpleNav,
  TestStackSubviews,
  TestStackBackButton,
};

const StackScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Stack v5',
  details: 'Single feature tests for new stack implementation',
  scenarios,
};

export default StackScenarioGroup;
