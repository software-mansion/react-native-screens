import { SettingsPicker } from '@apps/shared/SettingsPicker';
import React from 'react';
import { ScrollView } from 'react-native';
import { DummyScreen } from '@apps/tests/shared/DummyScreens';
import type { Scenario } from '@apps/tests/shared/helpers';
import {
  StackContainer,
  type StackRouteConfig,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import {
  TabsContainer,
  type TabRouteConfig,
  useTabsNavigationContext,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';

const SCENARIO: Scenario = {
  name: 'TabsInStack',
  details:
    'Configuration in Tabs contained within StackScreen should have precedence over configuraton in Stack contained within TabScreen',
  key: 'cit-orientation-tabs-in-stack',
  AppComponent: Apps,
  platforms: ['ios'],
};

export default SCENARIO;

function ConfigScreen() {
  const {
    routeKey: stackRouteKey,
    routeOptions: stackRouteOptions,
    setRouteOptions: setStackRouteOptions,
  } = useStackNavigationContext();
  const {
    routeKey: tabRouteKey,
    routeOptions: tabRouteOptions,
    setRouteOptions: setTabRouteOptions,
  } = useTabsNavigationContext();

  return (
    <ScrollView style={{ padding: 40 }}>
      <SettingsPicker
        label="Stack Screen orientation"
        items={['portrait', 'landscape', 'undefined']}
        value={stackRouteOptions.orientation ?? 'undefined'}
        onValueChange={value =>
          setStackRouteOptions(stackRouteKey, {
            orientation: value === 'undefined' ? undefined : value,
          })
        }
      />
      <SettingsPicker
        label="Tab Screen orientation"
        items={['portrait', 'landscape', 'undefined']}
        value={tabRouteOptions.orientation ?? 'undefined'}
        onValueChange={value =>
          setTabRouteOptions(tabRouteKey, {
            orientation: value === 'undefined' ? undefined : value,
          })
        }
      />
    </ScrollView>
  );
}

const TAB_ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Tab1',
    Component: ConfigScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab1',
    },
  },
  {
    name: 'Tab2',
    Component: DummyScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab2',
    },
  },
];

function TabsScreen() {
  return <TabsContainer routeConfigs={TAB_ROUTE_CONFIGS} />;
}

const STACK_ROUTE_CONFIGS: StackRouteConfig[] = [
  {
    name: 'Screen1',
    Component: TabsScreen,
    options: {},
  },
];

export function Apps() {
  return <StackContainer routeConfigs={STACK_ROUTE_CONFIGS} />;
}
