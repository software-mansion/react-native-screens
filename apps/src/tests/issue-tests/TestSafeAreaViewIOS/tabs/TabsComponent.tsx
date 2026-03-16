import {
  TabsContainer,
  TabConfiguration,
} from '../../../../shared/gamma/containers/tabs/TabsContainer';
import ConfigWrapperContext, {
  Configuration,
  DEFAULT_GLOBAL_CONFIGURATION,
} from '../../../../shared/gamma/containers/tabs/ConfigWrapperContext';
import React from 'react';
import { useState } from 'react';
import TestTab from './TestTab';
import { useTabsSAVExampleContext } from './TabsSAVExampleContext';
import ConfigTab from './ConfigTab';

export default function TabsComponent() {
  const { config } = useTabsSAVExampleContext();

  const TAB_CONFIGS: TabConfiguration[] = [
    {
      options: {
        screenKey: 'config',
        title: 'Config',
        ios: {
          icon: {
            type: 'sfSymbol',
            name: 'gear',
          },
        },
      },
      component: ConfigTab,
    },
    {
      options: {
        screenKey: 'test',
        title: 'Test',
        ios: {
          icon: {
            type: 'sfSymbol',
            name: 'uiwindow.split.2x1',
          },
          systemItem:
            config.tabBarItemSystemItem !== 'disabled'
              ? config.tabBarItemSystemItem
              : undefined,
        },
      },
      component: TestTab,
      safeAreaConfiguration: {
        edges: {
          top: config.safeAreaTopEdge,
          bottom: config.safeAreaBottomEdge,
          left: config.safeAreaLeftEdge,
          right: config.safeAreaRightEdge,
        },
      },
    },
  ];

  const [tabsConfig, setTabsConfig] = useState<Configuration>(
    DEFAULT_GLOBAL_CONFIGURATION,
  );

  return (
    <ConfigWrapperContext.Provider
      value={{
        config: tabsConfig,
        setConfig: setTabsConfig,
      }}>
      <TabsContainer
        tabConfigs={TAB_CONFIGS}
        ios={{
          tabBarMinimizeBehavior: config.tabBarMinimizeBehavior,
        }}
      />
    </ConfigWrapperContext.Provider>
  );
}
