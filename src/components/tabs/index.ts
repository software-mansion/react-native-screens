import { TabsHost } from './host';
import { TabsScreen } from './screen';

export type {
  TabsHostNavStateRequest,
  TabSelectedEvent,
  TabSelectionRejectedEvent,
  TabSelectionRejectionReason,
  TabSelectionPreventedEvent,
  TabsHostColorScheme,
  TabsHostDirection,
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
  TabsScreenOrientation,
  TabsScreenStyleProps,
  TabsScreenSpecialEffects,
  TabsScreenRepeatedTabSelectionEffects,
  TabsScreenPropsBase,
  TabsScreenProps,
  // Android
  TabsScreenIconAndroid,
  TabsScreenIconDrawableResourceAndroid,
  TabsScreenIconImageSourceAndroid,
  TabsScreenIconTintingAndroid,
  TabBarItemLabelVisibilityMode,
  TabsScreenItemStateAppearanceAndroid,
  TabsScreenAppearanceAndroid,
  TabsScreenPropsAndroid,
  // iOS
  TabsScreenIconIOS,
  TabsScreenIconSfSymbolIOS,
  TabsScreenIconImageSourceIOS,
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

export const Tabs = {
  Host: TabsHost,
  /**
   * A single tab of {@link Tabs.Host}: its tab bar item and the content shown
   * when the tab is selected.
   *
   * @platform android, ios
   */
  Screen: TabsScreen,
};
