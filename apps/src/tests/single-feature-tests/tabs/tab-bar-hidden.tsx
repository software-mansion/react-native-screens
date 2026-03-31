import { SettingsSwitch } from '../../../shared/SettingsSwitch';
import React from 'react';
import { ScrollView, Text } from 'react-native';
import { Scenario } from '../../shared/helpers';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  useTabsHostConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '../../../shared/gamma/containers/tabs';

const SCENARIO: Scenario = {
  name: 'Tab Bar Hidden',
  key: 'tab-bar-hidden',
  platforms: ['ios', 'android'],
  AppComponent: App,
};

export default SCENARIO;

function ConfigScreen() {
  const { hostConfig, updateHostConfig } = useTabsHostConfig();

  return (
    <ScrollView style={{ padding: 40}}>
      <Text style={{textAlign: 'center'}}>Change flag value by clicking on button.</Text>
      <SettingsSwitch 
        style={{ marginTop: 20, marginBottom: 15 }}
        label="tabBarHidden"
        value={hostConfig.tabBarHidden ?? false}
        onValueChange={value => updateHostConfig({ tabBarHidden: value })}
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
      title: 'Tab1',
    },
  },
];

export function App() {
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
}
