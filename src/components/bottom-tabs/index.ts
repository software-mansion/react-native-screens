import TabsHost from './TabsHost';
import TabsScreen from './BottomTabsScreen';

export type * from './TabsHost.types';
export type * from './BottomTabsScreen.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
const Tabs = {
  Host: TabsHost,
  Screen: TabsScreen,
};

export default Tabs;
