import React, { ComponentType, useReducer } from 'react';
import { ViewProps } from 'react-native';
import {
  ConfigContext,
  ConfigDispatchContext,
} from '../../contexts/tabs-config';
import {
  StaticTabsContainerProps,
  TabConfigUpdate,
} from '../../tabs-config.types';

export function TabsConfigProvider(props: {
  children: ViewProps['children'];
  tabs: Record<string, ComponentType>;
}) {
  const [config, dispatch] = useReducer(reduce, makeInitialConfig(props.tabs));

  return (
    <ConfigContext.Provider value={config}>
      <ConfigDispatchContext.Provider value={dispatch}>
        {props.children}
      </ConfigDispatchContext.Provider>
    </ConfigContext.Provider>
  );
}

function reduce(
  config: StaticTabsContainerProps<any>,
  action: TabConfigUpdate<any>,
) {
  switch (action.type) {
    case 'tabBar':
      config = { ...config, ...action.config };
      break;
    case 'tabScreen':
      const tabIndex = config.tabConfigs.findIndex(
        c => c.tabScreenProps.tabKey === action.tabKey,
      );
      if (tabIndex >= 0) {
        config.tabConfigs[tabIndex] = {
          ...config.tabConfigs[tabIndex],
          ...action.config,
          tabScreenProps: {
            ...config.tabConfigs[tabIndex].tabScreenProps,
            ...action.config.tabScreenProps,
          },
        };
        config = { ...config };
      }
      break;
  }

  return config;
}

function makeInitialConfig(
  tabs: Record<string, ComponentType>,
): StaticTabsContainerProps<any> {
  return {
    tabConfigs: Object.entries(tabs).map(([k, C]) => ({
      tabScreenProps: {
        tabKey: k,
        title: k,
        icon: {
          shared: {
            type: 'imageSource',
            imageSource: require('../../../../../assets/variableIcons/icon.png'),
          },
        },
      },
      component: C,
    })),
  };
}
