import BottomTabs from './BottomTabs';
import BottomTabsScreen from './BottomTabsScreen';

export type * from './BottomTabs.types';
export type * from './BottomTabsScreen.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
const Tabs = {
  Host: BottomTabs,
  Screen: BottomTabsScreen,
};

export default Tabs;
