import TabsHost from './TabsHost';
import TabsScreen from './TabsScreen';

export type * from './TabsHost.types';
export type * from './TabsScreen.types';

// Namespace the Host platform-specific types
export type * as TabsHostPropsAndroid from './TabsHost.android.types';
export type * as TabsHostPropsIOS from './TabsHost.ios.types';

// Namespace the Screen platform-types
export type * as TabsScreenPropsAndroid from './TabsScreen.android.types';
export type * as TabsScreenPropsIOS from './TabsScreen.ios.types';

export type { TabsBottomAccessoryEnvironment } from './TabsBottomAccessory.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
const Tabs = {
  Host: TabsHost,
  Screen: TabsScreen,
};

export default Tabs;
