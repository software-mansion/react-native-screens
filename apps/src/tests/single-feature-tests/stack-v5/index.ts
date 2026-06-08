import type { ScenarioGroup } from '@apps/tests/shared/helpers';
import PreventNativeDismissSingleStack from './prevent-native-dismiss-single-stack';
import PreventNativeDismissNestedStack from './prevent-native-dismiss-nested-stack';
import AnimationAndroid from './test-animation-android';
import TestStackSimpleNav from './test-stack-simple-nav';
import TestStackSubviewsAndroid from './test-stack-subviews-android';
import TestStackSubviewsIOS from './test-stack-subviews-ios';
import TestStackBackButton from './test-stack-back-button-android';
import TestStackToolbarMenuCommands from './test-stack-toolbar-menu-commands-android';
import TestStackToolbarMenuShowAsAction from './test-stack-toolbar-menu-show-as-action-android';

const scenarios = {
  PreventNativeDismissSingleStack,
  PreventNativeDismissNestedStack,
  AnimationAndroid,
  TestStackSimpleNav,
  TestStackSubviewsAndroid,
  TestStackSubviewsIOS,
  TestStackBackButton,
  TestStackToolbarMenuCommands,
  TestStackToolbarMenuShowAsAction,
};

const StackScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Stack v5',
  details: 'Single feature tests for new stack implementation',
  scenarios,
};

export default StackScenarioGroup;
