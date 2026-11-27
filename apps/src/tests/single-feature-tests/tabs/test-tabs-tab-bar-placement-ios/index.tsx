import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  useTabsHostConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/containers/tabs';
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { SettingsPicker } from '@apps/shared';
import { TabBarPlacement } from 'react-native-screens';

function ConfigScreen() {
  const { hostConfig, updateHostConfig } = useTabsHostConfig();
  return (
    <ScrollView style={{ padding: 40 }}>
      <View>
        <Text style={styles.description}>
          Controls where the tab bar is placed in a regular width.{'\n'}
          Test on iPad, on iPhone the tab bar is already at the bottom.
        </Text>
        <SettingsPicker<TabBarPlacement>
          testID="tab-bar-placement-picker"
          label="tabBarPlacement"
          value={hostConfig.ios?.tabBarPlacement ?? 'automatic'}
          onValueChange={value =>
            updateHostConfig({ ios: { tabBarPlacement: value } })
          }
          items={['automatic', 'bottom']}
        />
      </View>
    </ScrollView>
  );
}

function TestScreen() {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior="automatic"
      testID="test-screen-scroll">
      {Array.from({ length: 40 }, (_, i) => (
        <View key={i} style={styles.scrollItem}>
          <Text>Row {i + 1}, the last row must clear the tab bar</Text>
        </View>
      ))}
    </ScrollView>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Tab1',
    element: <ConfigScreen />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab1',
    },
  },
  {
    name: 'Tab2',
    element: <TestScreen />,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab2',
    },
  },
];

function TestTabsTabBarPlacement() {
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
}

const styles = StyleSheet.create({
  description: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    marginTop: 12,
    textAlign: 'center',
  },
  scrollItem: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
});

export default createScenario(TestTabsTabBarPlacement, scenarioDescription);
