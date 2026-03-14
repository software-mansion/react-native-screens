import type { TabRouteOptions } from './TabsContainer.types';

export const DEFAULT_TAB_ROUTE_OPTIONS: Pick<TabRouteOptions, 'android' | 'ios'> = {
  android: {
    icon: {
      type: 'imageSource',
      imageSource: require('../../../../../assets/variableIcons/icon.png'),
    },
  },
  ios: {
    icon: {
      type: 'imageSource',
      imageSource: require('../../../../../assets/variableIcons/icon.png'),
    },
  },
};
