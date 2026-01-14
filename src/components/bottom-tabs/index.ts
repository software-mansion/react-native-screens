import TabsHost from './TabsHost';
import TabsScreen from './TabsScreen';

export type * from './TabsHost.types';
export type * from './TabsScreen.types';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
const Tabs = {
  Host: TabsHost,
  Screen: TabsScreen,
};

export default Tabs;
