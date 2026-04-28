import { TabsHost } from './host';
import { TabsScreen } from './screen';

export type {
  TabsHostNavStateRequest,
  TabSelectedEvent,
  TabSelectionRejectedEvent,
  TabSelectionRejectionReason,
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
  TabsHostPropsIOS,
} from './host';

export type {
  TabsScreenEventHandler,
  TabsScreenOrientation,
  TabsScreenPropsBase,
  TabsScreenProps,
  // Android
  TabBarItemLabelVisibilityMode,
  TabsScreenItemStateAppearanceAndroid,
  TabsScreenAppearanceAndroid,
  TabsScreenPropsAndroid,
  // iOS
  TabsScreenBlurEffect,
  TabsScreenSystemItem,
  TabsScreenAppearanceIOS,
  TabsScreenItemAppearanceIOS,
  TabsScreenItemStateAppearanceIOS,
  TabsScreenPropsIOS,
} from './screen';

export type { TabsBottomAccessoryEnvironment } from './bottom-accessory';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
export const Tabs = {
  Host: TabsHost,
  Screen: TabsScreen,
};
