import { createContext, Dispatch } from 'react';
import {
  StaticTabsContainerProps,
  TabConfigUpdate,
} from '../tabs-config.types';

export const ConfigContext = createContext<StaticTabsContainerProps<any>>({
  routeConfigs: [],
});

export const ConfigDispatchContext = createContext<
  Dispatch<TabConfigUpdate<any>>
>(() => {});
