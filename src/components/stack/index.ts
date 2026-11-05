import { StackHost } from './host';
import { StackScreen } from './screen';
import { StackHeaderConfig } from './header';

export type { StackHostProps, StackColorScheme, StackDirection } from './host';

export type {
  OnDismissEventPayload,
  StackScreenActivityMode,
  StackScreenReplaceAnimation,
  StackScreenDismissHandler,
  StackScreenProps,
  StackScreenAnimation,
  StackScreenAnimationPresetName,
  StackScreenAnimationFadeFromEdgePresetName,
  StackScreenAnimationTimedPresetName,
  StackScreenAnimationUntimedPresetName,
  StackScreenAnimationPresetRef,
  StackScreenAnimationFadeFromEdgePresetRef,
  StackScreenAnimationTimedPresetRef,
  StackScreenAnimationUntimedPresetRef,
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
  StackHeaderSafeAreaAdjustmentIOS,
  StackHeaderItemVisibilityPriorityIOS,
  StackHeaderConfigPropsIOS,
  StackHeaderAppearanceIOS,
  StackHeaderButtonAppearanceIOS,
  StackHeaderButtonStateAppearanceIOS,
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
  /**
   * @platform android, ios
   * @experimental
   */
  Host: StackHost,
  /**
   * @platform android, ios
   * @experimental
   */
  Screen: StackScreen,
  /**
   * @platform android, ios
   * @experimental
   */
  HeaderConfig: StackHeaderConfig,
};
