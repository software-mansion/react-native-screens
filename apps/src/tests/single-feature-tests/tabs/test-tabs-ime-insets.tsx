import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import React, { useState } from 'react';
import { SettingsSwitch } from '@apps/shared';
import { Tabs } from 'react-native-screens';
import { SafeAreaView } from 'react-native-screens/experimental';
import { DummyScreen } from '@apps/tests/shared/DummyScreens';

const scenarioDescription: ScenarioDescription = {
  name: 'IME insets',
  key: 'test-tabs-ime-insets',
  details:
    'Tests prop that determines whether BottomNavigationView respects IME insets.',
  platforms: ['android'],
};

const DEFAULT_ICON = {
  icon: {
    type: 'imageSource' as const,
    imageSource: require('@assets/variableIcons/icon.png'),
  },
};

function ConfigScreen({
  tabBarRespectsIMEInsets,
  setTabBarRespectsIMEInsets,
}: {
  tabBarRespectsIMEInsets: boolean;
  setTabBarRespectsIMEInsets: (value: boolean) => void;
}) {
  const [safeAreaViewBottomEdgeEnabled, setSafeAreaViewBottomEdgeEnabled] =
    useState(true);

  return (
    <SafeAreaView edges={{ bottom: safeAreaViewBottomEdgeEnabled }}>
      <View style={[styles.container, styles.content]}>
        <View style={styles.section}>
          <Text style={styles.heading}>Safe Area – Bottom Edge</Text>
          <SettingsSwitch
            label={'safeAreaViewBottomEdgeEnabled'}
            value={safeAreaViewBottomEdgeEnabled}
            onValueChange={function (value: boolean): void {
              setSafeAreaViewBottomEdgeEnabled(value);
            }}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>tabBarRespectsIMEInsets</Text>
          <SettingsSwitch
            label={'tabBarRespectsIMEInsets'}
            value={tabBarRespectsIMEInsets}
            onValueChange={function (value: boolean): void {
              setTabBarRespectsIMEInsets(value);
            }}
          />
        </View>
        <View style={styles.section}>
          <Text style={styles.heading}>TextInput</Text>
          <TextInput
            placeholder="Focus TextInput to show IME..."
            style={styles.textInput}
          />
        </View>
        <View style={styles.end}>
          <Text>TabsScreen bottom</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}

export function App() {
  const [tabBarRespectsIMEInsets, setTabBarRespectsIMEInsets] = useState(false);

  return (
    <Tabs.Host
      navState={{ selectedScreenKey: 'Config', provenance: 0 }}
      android={{ tabBarRespectsIMEInsets }}>
      <Tabs.Screen
        screenKey="Config"
        title="Config"
        ios={DEFAULT_ICON}
        android={DEFAULT_ICON}>
        <ConfigScreen
          tabBarRespectsIMEInsets={tabBarRespectsIMEInsets}
          setTabBarRespectsIMEInsets={setTabBarRespectsIMEInsets}
        />
      </Tabs.Screen>
      <Tabs.Screen
        screenKey="Tab2"
        title="Tab2"
        ios={DEFAULT_ICON}
        android={DEFAULT_ICON}>
        <DummyScreen />
      </Tabs.Screen>
    </Tabs.Host>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: Platform.OS === 'android' ? 60 : undefined,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  section: {
    marginBottom: 10,
  },
  end: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  textInput: {
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginHorizontal: 10,
  },
});

export default createScenario(App, scenarioDescription);
