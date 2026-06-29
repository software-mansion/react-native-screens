import type { ScenarioGroup } from '@apps/tests/shared/helpers';

// Scenario objects (default exports) — carry metadata, used to build the
// scenario group consumed by the selection menu.
import TestStackPreventNativeDismissSingleStack from './prevent-native-dismiss-single-stack';
import TestStackPreventNativeDismissNestedStack from './prevent-native-dismiss-nested-stack';
import TestStackAnimationAndroid from './test-animation-android';
import TestStackSimpleNav from './test-stack-simple-nav';
import TestStackSubviewsAndroid from './test-stack-subviews-android';
import TestStackSubviewsIOS from './test-stack-subviews-ios';
import TestStackHeaderMenuIOS from './test-stack-header-menu-ios';
import TestStackBackButton from './test-stack-back-button-android';
import TestStackToolbarMenuCommands from './test-stack-toolbar-menu-commands-android';
import TestStackToolbarMenuShowAsAction from './test-stack-toolbar-menu-show-as-action-android';
import TestStackToolbarMenuIcon from './test-stack-toolbar-menu-icon-android';
import TestStackToolbarNestedMenu from './test-stack-toolbar-nested-menu-android';
import TestStackHeaderSubviewOnPress from './test-stack-header-subview-onpress-ios';

// Scenario entry-point components — each scenario's default export re-exported
// under a name for direct rendering (e.g. from App.tsx or e2e harnesses).
export { default as TestStackPreventNativeDismissSingleStack } from './prevent-native-dismiss-single-stack';
export { default as TestStackPreventNativeDismissNestedStack } from './prevent-native-dismiss-nested-stack';
export { default as TestStackAnimationAndroid } from './test-animation-android';
export { default as TestStackSimpleNav } from './test-stack-simple-nav';
export { default as TestStackSubviewsAndroid } from './test-stack-subviews-android';
export { default as TestStackSubviewsIOS } from './test-stack-subviews-ios';
export { default as TestStackHeaderMenuIOS } from './test-stack-header-menu-ios';
export { default as TestStackBackButton } from './test-stack-back-button-android';
export { default as TestStackToolbarMenuCommands } from './test-stack-toolbar-menu-commands-android';
export { default as TestStackToolbarMenuShowAsAction } from './test-stack-toolbar-menu-show-as-action-android';
export { default as TestStackToolbarMenuIcon } from './test-stack-toolbar-menu-icon-android';

const scenarios = {
  TestStackPreventNativeDismissSingleStack,
  TestStackPreventNativeDismissNestedStack,
  TestStackAnimationAndroid,
  TestStackSimpleNav,
  TestStackSubviewsAndroid,
  TestStackSubviewsIOS,
  TestStackHeaderMenuIOS,
  TestStackHeaderSubviewOnPress,
  TestStackBackButton,
  TestStackToolbarMenuCommands,
  TestStackToolbarMenuShowAsAction,
  TestStackToolbarMenuIcon,
  TestStackToolbarNestedMenu,
};

const StackScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Stack v5',
  details: 'Single feature tests for new stack implementation',
  scenarios,
};

export default StackScenarioGroup;
