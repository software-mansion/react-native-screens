import { TabsHost } from './host';
import { TabsScreen } from './screen';

export type {
  TabsHostNavStateRequest,
  TabSelectedEvent,
  TabSelectionActionOrigin,
  TabSelectionRejectedEvent,
  TabSelectionRejectionReason,
  TabSelectionPreventedEvent,
  TabsColorScheme,
  TabsDirection,
  TabsHostNativeContainerStyleProps,
  TabsHostPropsBase,
  TabsHostProps,
  // Android
  TabsHostPropsAndroid,
  // iOS
  MoreTabSelectedEvent,
  TabsBottomAccessoryComponentFactory,
  TabBarMinimizeBehavior,
  TabBarControllerMode,
  TabBarSidebarPreferredPlacement,
  TabsHostPropsIOS,
} from './host';

export type {
  TabsOrientation,
  TabsScreenStyleProps,
  TabsScreenSpecialEffects,
  TabsScreenRepeatedTabSelectionEffects,
  TabsScreenPropsBase,
  TabsScreenProps,
  // Android
  TabsScreenIconAndroid,
  TabsScreenIconDrawableResourceAndroid,
  TabsScreenIconImageSourceAndroid,
  TabsPlatformIconTintingAndroid,
  TabBarItemLabelVisibilityMode,
  TabsScreenItemStateAppearanceAndroid,
  TabsScreenAppearanceAndroid,
  TabsScreenPropsAndroid,
  // iOS
  TabsScreenIconIOS,
  TabsScreenIconSfSymbolIOS,
  TabsScreenIconImageSourceIOS,
  TabsPlatformIconImageRenderingModeIOS,
  TabsPlatformIconSymbolRenderingModeIOS,
  TabsScreenBlurEffect,
  TabsScreenRole,
  TabsScreenSystemItem,
  TabsScreenAppearanceIOS,
  TabsScreenItemAppearanceIOS,
  TabsScreenItemTitlePositionAdjustmentIOS,
  TabsScreenItemStateAppearanceIOS,
  TabsScreenPropsIOS,
} from './screen';

export type { TabsBottomAccessoryEnvironment } from './bottom-accessory';

/**
 * Native tab navigation, with a platform tab bar that switches between
 * screens.
 *
 * @remarks
 * {@link Tabs.Host} hosts the tab bar and shows the selected
 * {@link Tabs.Screen}; each screen configures its own tab bar item.
 *
 * @namespace
 */
export const Tabs = {
  /**
   * Container that shows a native tab bar and the content of the selected
   * {@link Tabs.Screen}.
   *
   * @platform android, ios
   */
  Host: TabsHost,
  /**
   * A single tab of {@link Tabs.Host}: its tab bar item and the content shown
   * when the tab is selected.
   *
   * @platform android, ios
   */
  Screen: TabsScreen,
};
