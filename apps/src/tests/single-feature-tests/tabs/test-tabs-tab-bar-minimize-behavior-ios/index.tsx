import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { SettingsPicker } from '@apps/shared';
import { Tabs, TabBarMinimizeBehavior } from 'react-native-screens';

const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Minimize Behavior',
  key: 'test-tabs-tab-bar-minimize-behavior-ios',
  details: 'Test tab bar minimize behavior for iOS 26+.',
  platforms: ['ios'],
};

const DEFAULT_ICON = {
  icon: {
    type: 'imageSource' as const,
    imageSource: require('@assets/variableIcons/icon.png'),
  },
};

function ConfigScreen({
  tabBarMinimizeBehavior,
  setTabBarMinimizeBehavior,
}: {
  tabBarMinimizeBehavior: TabBarMinimizeBehavior;
  setTabBarMinimizeBehavior: (value: TabBarMinimizeBehavior) => void;
}) {
  return (
    <ScrollView style={{ padding: 40 }}>
      <View>
        <Text style={styles.description}>
          Controls when the tab bar minimizes. Switch to Tab2 and scroll up/down
          to observe the behaviour. Requires iOS 26+.
        </Text>
        <SettingsPicker<TabBarMinimizeBehavior>
          label="tabBarMinimizeBehavior"
          value={tabBarMinimizeBehavior}
          onValueChange={value => setTabBarMinimizeBehavior(value)}
          items={['automatic', 'onScrollDown', 'onScrollUp', 'never']}
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
          <Text>Row {i + 1} — scroll to test tabBarMinimizeBehavior</Text>
        </View>
      ))}
    </ScrollView>
  );
}

export function App() {
  const [tabBarMinimizeBehavior, setTabBarMinimizeBehavior] =
    React.useState<TabBarMinimizeBehavior>('automatic');

  return (
    <Tabs.Host
      navState={{ selectedScreenKey: 'Tab1', provenance: 0 }}
      ios={{ tabBarMinimizeBehavior }}>
      <Tabs.Screen
        screenKey="Tab1"
        title="Tab1"
        ios={DEFAULT_ICON}
        android={DEFAULT_ICON}>
        <ConfigScreen
          tabBarMinimizeBehavior={tabBarMinimizeBehavior}
          setTabBarMinimizeBehavior={setTabBarMinimizeBehavior}
        />
      </Tabs.Screen>
      <Tabs.Screen
        screenKey="Tab2"
        title="Tab2"
        ios={DEFAULT_ICON}
        android={DEFAULT_ICON}>
        <TestScreen />
      </Tabs.Screen>
    </Tabs.Host>
  );
}

const styles = StyleSheet.create({
  description: {
    fontSize: 13,
    color: '#555',
    marginBottom: 6,
    marginTop: 12,
  },
  scrollItem: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
});

export default createScenario(App, scenarioDescription);
