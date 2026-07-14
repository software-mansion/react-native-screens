import type { ScenarioGroup } from '@apps/tests/shared/helpers';

// Scenario objects (default exports) — carry metadata, used to build the
// scenario group consumed by the selection menu.
import TestStackPreventNativeDismissSingleStack from './prevent-native-dismiss-single-stack';
import TestStackPreventNativeDismissNestedStack from './prevent-native-dismiss-nested-stack';
import TestStackAnimationAndroid from './test-stack-animation-android';
import TestStackSimpleNav from './test-stack-simple-nav';
import TestStackSubviewsAndroid from './test-stack-subviews-android';
import TestStackSubviewsIOS from './test-stack-subviews-ios';
import TestStackHeaderMenuIOS from './test-stack-header-menu-ios';
import TestStackHeaderIconIOS from './test-stack-header-icon-ios';
import TestStackBackButton from './test-stack-back-button-android';
import TestStackToolbarMenuCommands from './test-stack-toolbar-menu-commands-android';
import TestStackToolbarMenuDisabled from './test-stack-toolbar-menu-disabled-android';
import TestStackToolbarMenuShowAsAction from './test-stack-toolbar-menu-show-as-action-android';
import TestStackToolbarMenuTitle from './test-stack-toolbar-menu-title-android';
import TestStackToolbarMenuIcon from './test-stack-toolbar-menu-icon-android';
import TestStackToolbarMenuGroups from './test-stack-toolbar-menu-groups-android';
import TestStackToolbarNestedMenu from './test-stack-toolbar-nested-menu-android';
import TestStackToolbarMenuBatchCommands from './test-stack-toolbar-menu-batch-commands-android';
import TestStackHeaderSubviewOnPress from './test-stack-header-subview-onpress-ios';
import TestStackHeaderSelectiveUpdates from './test-stack-header-selective-updates-ios';
import TestStackHeaderMenuOptionsIOS from './test-stack-header-menu-options-ios';

// Scenario entry-point components — each scenario's default export re-exported
// under a name for direct rendering (e.g. from App.tsx or e2e harnesses).
export { default as TestStackPreventNativeDismissSingleStack } from './prevent-native-dismiss-single-stack';
export { default as TestStackPreventNativeDismissNestedStack } from './prevent-native-dismiss-nested-stack';
export { default as TestStackAnimationAndroid } from './test-stack-animation-android';
export { default as TestStackSimpleNav } from './test-stack-simple-nav';
export { default as TestStackSubviewsAndroid } from './test-stack-subviews-android';
export { default as TestStackSubviewsIOS } from './test-stack-subviews-ios';
export { default as TestStackHeaderIconIOS } from './test-stack-header-icon-ios';
export { default as TestStackHeaderMenuIOS } from './test-stack-header-menu-ios';
export { default as TestStackHeaderMenuOptionsIOS } from './test-stack-header-menu-options-ios';
export { default as TestStackHeaderSelectiveUpatesIOS } from './test-stack-header-selective-updates-ios';
export { default as TestStackHeaderSubviewOnPressIOS } from './test-stack-header-subview-onpress-ios';
export { default as TestStackBackButton } from './test-stack-back-button-android';
export { default as TestStackToolbarMenuCommands } from './test-stack-toolbar-menu-commands-android';
export { default as TestStackToolbarMenuDisabled } from './test-stack-toolbar-menu-disabled-android';
export { default as TestStackToolbarMenuGroups } from './test-stack-toolbar-menu-groups-android';
export { default as TestStackToolbarMenuShowAsAction } from './test-stack-toolbar-menu-show-as-action-android';
export { default as TestStackToolbarMenuTitle } from './test-stack-toolbar-menu-title-android';
export { default as TestStackToolbarMenuIcon } from './test-stack-toolbar-menu-icon-android';
export { default as TestStackToolbarNestedMenu } from './test-stack-toolbar-nested-menu-android';
export { default as TestStackToolbarMenuBatchCommands } from './test-stack-toolbar-menu-batch-commands-android';

const scenarios = {
  TestStackPreventNativeDismissSingleStack,
  TestStackPreventNativeDismissNestedStack,
  TestStackAnimationAndroid,
  TestStackSimpleNav,
  TestStackSubviewsAndroid,
  TestStackSubviewsIOS,
  TestStackHeaderMenuIOS,
  TestStackHeaderIconIOS,
  TestStackHeaderSubviewOnPress,
  TestStackHeaderSelectiveUpdates,
  TestStackHeaderMenuOptionsIOS,
  TestStackBackButton,
  TestStackToolbarMenuCommands,
  TestStackToolbarMenuDisabled,
  TestStackToolbarMenuGroups,
  TestStackToolbarMenuShowAsAction,
  TestStackToolbarMenuTitle,
  TestStackToolbarMenuIcon,
  TestStackToolbarNestedMenu,
  TestStackToolbarMenuBatchCommands,
};

const StackScenarioGroup: ScenarioGroup<keyof typeof scenarios> = {
  name: 'Stack v5',
  details: 'Single feature tests for new stack implementation',
  scenarios,
};

export default StackScenarioGroup;
