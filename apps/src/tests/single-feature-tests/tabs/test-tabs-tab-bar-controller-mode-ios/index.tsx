import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  useTabsHostConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { SettingsPicker } from '@apps/shared';
import { TabBarControllerMode } from 'react-native-screens';

const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Controller Mode',
  key: 'test-tabs-tab-bar-controller-mode-ios',
  details: 'Test different tab bar modes.',
  platforms: ['ios'],
};

export function ConfigScreen() {
  const { hostConfig, updateHostConfig } = useTabsHostConfig();
  return (
    <ScrollView style={{ padding: 40 }}>
      <View>
        <Text style={styles.description}>
          Controls whether the tab bar is displayed as a bar or sidebar.{'\n'}
          Test tabSidebar on iPad — on iPhone it collapses back to a tab bar
          automatically.
        </Text>
        <SettingsPicker<TabBarControllerMode>
          label="tabBarControllerMode"
          value={hostConfig.ios?.tabBarControllerMode ?? 'automatic'}
          onValueChange={value =>
            updateHostConfig({ ios: { tabBarControllerMode: value } })
          }
          items={['automatic', 'tabBar', 'tabSidebar']}
        />
      </View>
    </ScrollView>
  );
}

export function TestScreen() {
  return (
    <ScrollView
      style={{ flex: 1 }}
      contentInsetAdjustmentBehavior="automatic"
      testID="test-screen-scroll">
      {Array.from({ length: 40 }, (_, i) => (
        <View key={i} style={styles.scrollItem}>
          <Text>Row {i + 1} — scroll to test tabBarMinimizeBehavior</Text>
        </View>
      ))}
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
  {
    name: 'Tab2',
    Component: TestScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Tab2',
    },
  },
];

export function App() {
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
}

const styles = StyleSheet.create({
  sectionHeader: {
    fontSize: 13,
    fontWeight: '600',
    textTransform: 'uppercase',
    color: '#888',
    letterSpacing: 0.5,
    marginTop: 24,
    marginBottom: 4,
  },
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
  centeredScreen: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    gap: 12,
  },
  screenLabel: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  screenHint: {
    fontSize: 14,
    color: '#555',
    textAlign: 'center',
    lineHeight: 20,
  },
});

export default createScenario(App, scenarioDescription);
