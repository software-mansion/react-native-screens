import { SettingsSwitch } from '@apps/shared/SettingsSwitch';
import React from 'react';
import { ScrollView, Text } from 'react-native';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { Tabs } from 'react-native-screens';

const scenarioDescription: ScenarioDescription = {
  name: 'Tab Bar Hidden',
  key: 'test-tabs-tab-bar-hidden',
  platforms: ['ios', 'android'],
};

const DEFAULT_ICON = {
  icon: {
    type: 'imageSource' as const,
    imageSource: require('@assets/variableIcons/icon.png'),
  },
};

function ConfigScreen({
  tabBarHidden,
  setTabBarHidden,
}: {
  tabBarHidden: boolean;
  setTabBarHidden: (value: boolean) => void;
}) {
  return (
    <ScrollView style={{ padding: 40 }} testID="tab-bar-hidden-scrollview">
      <Text style={{ textAlign: 'center' }}>
        Change flag value by clicking on button.
      </Text>
      <SettingsSwitch
        style={{ marginTop: 20, marginBottom: 15 }}
        label="tabBarHidden"
        value={tabBarHidden}
        onValueChange={value => setTabBarHidden(value)}
        testID="tab-bar-hidden-switch"
      />
    </ScrollView>
  );
}

export function App() {
  const [tabBarHidden, setTabBarHidden] = React.useState(false);

  return (
    <Tabs.Host
      navState={{ selectedScreenKey: 'Tab1', provenance: 0 }}
      tabBarHidden={tabBarHidden}>
      <Tabs.Screen
        screenKey="Tab1"
        title="Tab1"
        tabBarItemTestID="tab-bar-item-1-id"
        tabBarItemAccessibilityLabel="First Tab Item"
        ios={DEFAULT_ICON}
        android={DEFAULT_ICON}>
        <ConfigScreen
          tabBarHidden={tabBarHidden}
          setTabBarHidden={setTabBarHidden}
        />
      </Tabs.Screen>
    </Tabs.Host>
  );
}

export default createScenario(App, scenarioDescription);
