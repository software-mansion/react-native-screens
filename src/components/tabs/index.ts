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
  TabsScreenIconTemplateIOS,
  TabsScreenBlurEffect,
  TabsScreenSystemItem,
  TabsScreenAppearanceIOS,
  TabsScreenItemAppearanceIOS,
  TabsScreenItemStateAppearanceIOS,
  TabsScreenPropsIOS,
} from './screen';

export type { TabsBottomAccessoryEnvironment } from './bottom-accessory';

export const Tabs = {
  Host: TabsHost,
  Screen: TabsScreen,
};
