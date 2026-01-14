import {
  BottomTabsContainer,
  TabConfiguration,
} from '../../../shared/gamma/containers/bottom-tabs/BottomTabsContainer';
import ConfigWrapperContext, {
  Configuration,
  DEFAULT_GLOBAL_CONFIGURATION,
} from '../../../shared/gamma/containers/bottom-tabs/ConfigWrapperContext';
import React from 'react';
import { useState } from 'react';
import TestTab from './TestTab';
import { useBottomTabsSAVExampleContext } from './BottomTabsSAVExampleContext';
import ConfigTab from './ConfigTab';

export default function BottomTabsComponent() {
  const { config } = useBottomTabsSAVExampleContext();

  const TAB_CONFIGS: TabConfiguration[] = [
    {
      tabScreenProps: {
        tabKey: 'config',
        title: 'Config',
        icon: {
          ios: {
            type: 'sfSymbol',
            name: 'gear',
          },
        },
      },
      component: ConfigTab,
    },
    {
      tabScreenProps: {
        tabKey: 'test',
        title: 'Test',
        icon: {
          ios: {
            type: 'sfSymbol',
            name: 'uiwindow.split.2x1',
          },
        },
        systemItem:
          config.tabBarItemSystemItem !== 'disabled'
            ? config.tabBarItemSystemItem
            : undefined,
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
      <BottomTabsContainer
        tabConfigs={TAB_CONFIGS}
        tabBarMinimizeBehavior={config.tabBarMinimizeBehavior}
      />
    </ConfigWrapperContext.Provider>
  );
}
