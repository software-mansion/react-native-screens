import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Scenario } from '@apps/tests/shared/helpers';
import { SettingsPicker } from '@apps/shared';
import { Tabs, TabBarControllerMode } from 'react-native-screens';

const SCENARIO: Scenario = {
  name: 'Tab Bar Controller Mode',
  key: 'test-tabs-tab-bar-controller-mode-ios',
  details: 'Test different tab bar modes.',
  platforms: ['ios'],
  AppComponent: App,
};

export default SCENARIO;

const DEFAULT_ICON = {
  icon: {
    type: 'imageSource' as const,
    imageSource: require('@assets/variableIcons/icon.png'),
  },
};

function ConfigScreen({
  tabBarControllerMode,
  setTabBarControllerMode,
}: {
  tabBarControllerMode: TabBarControllerMode;
  setTabBarControllerMode: (value: TabBarControllerMode) => void;
}) {
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
          value={tabBarControllerMode}
          onValueChange={value => setTabBarControllerMode(value)}
          items={['automatic', 'tabBar', 'tabSidebar']}
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
  const [tabBarControllerMode, setTabBarControllerMode] =
    React.useState<TabBarControllerMode>('automatic');

  return (
    <Tabs.Host
      navState={{ selectedScreenKey: 'Tab1', provenance: 0 }}
      ios={{ tabBarControllerMode }}>
      <Tabs.Screen
        screenKey="Tab1"
        title="Tab1"
        ios={DEFAULT_ICON}
        android={DEFAULT_ICON}>
        <ConfigScreen
          tabBarControllerMode={tabBarControllerMode}
          setTabBarControllerMode={setTabBarControllerMode}
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
    textAlign: 'center',
  },
  scrollItem: {
    padding: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
});
