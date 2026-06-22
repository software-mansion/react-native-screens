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

// Scenario entry-point components (named exports) — re-exported for direct
// rendering (e.g. from App.tsx or e2e harnesses).
export { TestStackPreventNativeDismissSingleStack } from './prevent-native-dismiss-single-stack';
export { TestStackPreventNativeDismissNestedStack } from './prevent-native-dismiss-nested-stack';
export { TestStackAnimationAndroid } from './test-animation-android';
export { TestStackSimpleNav } from './test-stack-simple-nav';
export { TestStackSubviewsAndroid } from './test-stack-subviews-android';
export { TestStackSubviewsIOS } from './test-stack-subviews-ios';
export { TestStackHeaderMenuIOS } from './test-stack-header-menu-ios';
export { TestStackBackButton } from './test-stack-back-button-android';
export { TestStackToolbarMenuCommands } from './test-stack-toolbar-menu-commands-android';
export { TestStackToolbarMenuShowAsAction } from './test-stack-toolbar-menu-show-as-action-android';
export { TestStackToolbarMenuIcon } from './test-stack-toolbar-menu-icon-android';

const scenarios = {
  TestStackPreventNativeDismissSingleStack,
  TestStackPreventNativeDismissNestedStack,
  TestStackAnimationAndroid,
  TestStackSimpleNav,
  TestStackSubviewsAndroid,
  TestStackSubviewsIOS,
  TestStackHeaderMenuIOS,
  TestStackBackButton,
  TestStackToolbarMenuCommands,
  TestStackToolbarMenuShowAsAction,
  TestStackToolbarMenuIcon,
};

const StackScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Stack v5',
  details: 'Single feature tests for new stack implementation',
  scenarios,
};

export default StackScenarioGroup;
