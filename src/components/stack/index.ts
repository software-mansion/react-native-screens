import { StackHost } from './host';
import { StackScreen } from './screen';
import { StackHeaderConfig } from './header';

export type {
  StackHostProps,
  StackHostColorScheme,
  StackHostDirection,
} from './host';

export type {
  OnDismissEventPayload,
  OnDismissEvent,
  StackScreenActivityMode,
  StackScreenReplaceAnimation,
  StackScreenEventHandler,
  StackScreenProps,
  StackScreenAnimation,
  StackScreenAnimationPresetName,
  StackScreenAnimationPresetRef,
  StackScreenAnimationTimingOptions,
  StackScreenAnimationEasing,
  StackScreenAnimationEasingName,
  StackScreenAnimationBezier,
  StackScreenAnimationLength,
} from './screen';

export type {
  StackHeaderConfigPropsBase,
  StackHeaderConfigProps,
  StackHeaderConfigRef,
  // Android
  StackHeaderTypeAndroid,
  StackHeaderTitleHorizontalGravityAndroid,
  StackHeaderTitleVerticalGravityAndroid,
  StackHeaderCollapsedTitleGravityModeAndroid,
  StackHeaderBackgroundSubviewCollapseModeAndroid,
  StackHeaderToolbarSubviewAndroid,
  StackHeaderBackgroundSubviewAndroid,
  StackHeaderConfigPropsAndroid,
  StackHeaderConfigCommandsAndroid,
  StackHeaderToolbarMenuAndroid,
  StackHeaderToolbarMenuBaseAndroid,
  StackHeaderToolbarMenuElementAndroid,
  StackHeaderToolbarMenuGroupAndroid,
  StackHeaderToolbarMenuItemAndroid,
  StackHeaderToolbarMenuItemBaseAndroid,
  StackHeaderToolbarMenuElementOptionsAndroid,
  StackHeaderToolbarMenuElementUpdateAndroid,
  StackHeaderToolbarMenuItemShowAsActionAndroid,
  StackHeaderToolbarMenuItemTypeAndroid,
  // iOS
  StackHeaderBackButtonDisplayModeIOS,
  StackHeaderMinimizationBehaviorIOS,
  StackHeaderRestorationBehaviorIOS,
  StackHeaderItemVisibilityPriorityIOS,
  StackHeaderConfigPropsIOS,
  StackHeaderAppearanceIOS,
  StackHeaderItemVariantIOS,
  StackHeaderInlineItemIOS,
  StackHeaderInlineCustomItemIOS,
  StackHeaderTitleCustomItemIOS,
  StackHeaderSpacerItemIOS,
  StackHeaderConfigCommandsIOS,
  StackHeaderMenuIOS,
  StackHeaderMenuItemIOS,
  StackHeaderMenuElementIOS,
  StackHeaderMenuItemOptionsIOS,
  StackHeaderMenuOptionsIOS,
} from './header';

export const Stack = {
  Host: StackHost,
  Screen: StackScreen,
  HeaderConfig: StackHeaderConfig,
};
