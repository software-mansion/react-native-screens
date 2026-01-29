import { Dispatch, useContext } from 'react';
import { KeyList } from '../helpers';
import {
  StaticTabsContainerProps,
  TabConfigUpdate,
} from '../tabs-config.types';
import { ConfigContext, ConfigDispatchContext } from '../contexts/tabs-config';

/**
 * Configuration for the Tabs.
 * Use within the Provider returned by createTabsConfig.
 * Template parameter with available Tab keys is required.
 */
export function useTabsConfig<
  S extends KeyList = {},
>(): StaticTabsContainerProps<S> {
  const config = useContext(ConfigContext);

  if (!config) {
    throw new Error('useTabsConfig must be used within a TabsConfigProvider');
  }

  return config as StaticTabsContainerProps<S>;
}

/**
 * Dispatcher for useReducer pattern for Tabs configuration.
 * Use within the Provider returned by createTabsConfig.
 * Template parameter with available Tab keys is required.
 */
export function useDispatchTabsConfig<S extends KeyList = {}>(): Dispatch<
  TabConfigUpdate<S>
> {
  const dispatch = useContext(ConfigDispatchContext);

  if (!dispatch) {
    throw new Error(
      'useDispatchTabsConfig must be used within a ConfigDispatchContext',
    );
  }

  return dispatch;
}

export default function useTabsConfigState<S extends KeyList = {}>(): [
  StaticTabsContainerProps<S>,
  Dispatch<TabConfigUpdate<S>>,
] {
  return [useTabsConfig(), useDispatchTabsConfig()];
}
