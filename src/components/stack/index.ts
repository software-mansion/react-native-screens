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
  StackHeaderMode,
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

/**
 * Native stack of screens, pushed and popped with platform transitions.
 *
 * @remarks
 * {@link Stack.Host} presents the screens declared with {@link Stack.Screen},
 * and each screen configures its header with {@link Stack.HeaderConfig}.
 *
 * @namespace
 */
export const Stack = {
  /**
   * Container that presents its {@link Stack.Screen} children as a native
   * stack.
   *
   * @platform android, ios
   */
  Host: StackHost,
  /**
   * A screen of {@link Stack.Host}.
   *
   * @platform android, ios
   */
  Screen: StackScreen,
  /**
   * Configures the native header of the {@link Stack.Screen} it is rendered
   * in.
   *
   * @remarks
   * On Android, it must be the last child of the screen.
   *
   * @platform android, ios
   */
  HeaderConfig: StackHeaderConfig,
};
