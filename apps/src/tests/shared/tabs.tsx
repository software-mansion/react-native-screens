import { ViewProps } from 'react-native';
import { KeyList } from './helpers';
import React from 'react';
import { TabsConfigProvider } from './components/tabs/TabsConfigProvider';
import { TabsAutoconfig } from './components/tabs/TabsAutoconfig';
import {
  StaticTabConfiguration,
  StaticTabsContainerProps,
} from './tabs-config.types';

/**
 * Creates a Provider and Autoconfig component for easy Tabs configuration.
 * Template parameter with available Tab keys is required.
 */
export function createAutoConfiguredTabs<S extends KeyList = {}>(
  tabs: {} extends S
    ? never
    : Record<Extract<keyof S, string>, React.ComponentType>,
) {
  return {
    Provider: (props: { children: ViewProps['children'] }) => (
      <TabsConfigProvider tabs={tabs}>{props.children}</TabsConfigProvider>
    ),
    Autoconfig: TabsAutoconfig,
  };
}

export function findTabScreenOptions<S extends KeyList>(
  config: StaticTabsContainerProps<S>,
  key: Extract<keyof S, string>,
): StaticTabConfiguration<S> | undefined {
  return config.tabConfigs.find(c => c.tabScreenProps.tabKey === key);
}
