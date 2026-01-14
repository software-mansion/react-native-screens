import TabsHost from './TabsHost';
import BottomTabsScreen from './BottomTabsScreen';

export type * from './BottomTabs.types';
export type * from './BottomTabsScreen.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
const Tabs = {
  Host: TabsHost,
  Screen: BottomTabsScreen,
};

export default Tabs;
