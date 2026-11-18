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
  TabBarPlacement,
  TabsHostPropsIOS,
} from './host';

export type {
  TabsScreenEventHandler,
  TabsScreenOrientation,
  TabsScreenPropsBase,
  TabsScreenProps,
  // Android
  TabsScreenIconAndroid,
  TabsScreenIconTintingAndroid,
  TabBarItemLabelVisibilityMode,
  TabsScreenItemStateAppearanceAndroid,
  TabsScreenAppearanceAndroid,
  TabsScreenPropsAndroid,
  // iOS
  TabsScreenIconIOS,
  TabsScreenIconImageRenderingModeIOS,
  TabsScreenIconSymbolRenderingModeIOS,
  TabsScreenBlurEffect,
  TabsScreenRole,
  TabsScreenSystemItem,
  TabsScreenAppearanceIOS,
  TabsScreenItemAppearanceIOS,
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
  Screen: TabsScreen,
};
