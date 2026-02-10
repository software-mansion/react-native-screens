import TabsHost from './TabsHost';
import TabsScreen from './TabsScreen';
import { BottomTabBarHeightContext } from './BottomTabBarHeightContext';
import { useBottomTabBarHeight } from './useBottomTabBarHeight';

export type * from './TabsHost.types';
export type * from './TabsScreen.types';
export type { TabsAccessoryEnvironment } from './TabsAccessory.types';
export { BottomTabBarHeightContext, useBottomTabBarHeight };

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
const Tabs = {
  Host: TabsHost,
  Screen: TabsScreen,
};

export default Tabs;
