import { SettingsSwitch } from '@apps/shared/SettingsSwitch';
import React from 'react';
import { ScrollView, Text } from 'react-native';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  useTabsHostConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';

const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Hidden',
  key: 'test-tabs-tab-bar-hidden',
  platforms: ['ios', 'android'],
};

function ConfigScreen() {
  const { hostConfig, updateHostConfig } = useTabsHostConfig();

  return (
    <ScrollView style={{ padding: 40 }} testID="tab-bar-hidden-scrollview">
      <Text style={{ textAlign: 'center' }}>
        Change flag value by clicking on button.
      </Text>
      <SettingsSwitch
        style={{ marginTop: 20, marginBottom: 15 }}
        label="tabBarHidden"
        value={hostConfig.tabBarHidden ?? false}
        onValueChange={value => updateHostConfig({ tabBarHidden: value })}
        testID="tab-bar-hidden-switch"
      />
    </ScrollView>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Tab1',
    Component: ConfigScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      tabBarItemTestID: 'tab-bar-item-1-id',
      tabBarItemAccessibilityLabel: 'First Tab Item',
      title: 'Tab1',
    },
  },
];

export function App() {
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
}

export default createScenario(App, scenarioDescription);
