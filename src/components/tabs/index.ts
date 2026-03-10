import { TabsHost } from './host';
import { TabsScreen } from './screen';

export type * from './host';
export type * from './screen';

export type { TabsBottomAccessoryEnvironment } from './bottom-accessory';

/**
 * EXPERIMENTAL API, MIGHT CHANGE W/O ANY NOTICE
 */
const Tabs = {
  Host: TabsHost,
  Screen: TabsScreen,
};

export default Tabs;
