import React from 'react';
import { ScrollView } from 'react-native';
import { SettingsPicker } from '@apps/shared/SettingsPicker';
import { DummyScreen } from '@apps/tests/shared/DummyScreens';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
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

const scenarioDescription: ScenarioDescription = {
  name: 'StackInTabs',
  details:
    'Configuration in Stack contained within TabScreen always takes precedence',
  key: 'cit-orientation-stack-in-tabs',
  platforms: ['ios'],
};

function ConfigScreen() {
  const {
    routeKey: tabRouteKey,
    routeOptions: tabRouteOptions,
    setRouteOptions: setTabRouteOptions,
  } = useTabsNavigationContext();
  const {
    routeKey: stackRouteKey,
    routeOptions: stackRouteOptions,
    setRouteOptions: setStackRouteOptions,
  } = useStackNavigationContext();

  return (
    <ScrollView style={{ padding: 40 }}>
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
    </ScrollView>
  );
}

const STACK_ROUTE_CONFIGS: StackRouteConfig[] = [
  {
    name: 'Screen1',
    Component: ConfigScreen,
    options: {},
  },
];

function StackScreen() {
  return <StackContainer routeConfigs={STACK_ROUTE_CONFIGS} />;
}

const TAB_ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Tab1',
    Component: StackScreen,
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

export function App() {
  return <TabsContainer routeConfigs={TAB_ROUTE_CONFIGS} />;
}

export default createScenario(App, scenarioDescription);
