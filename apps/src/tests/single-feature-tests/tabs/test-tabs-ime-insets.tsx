import { Platform, StyleSheet, Text, TextInput, View } from 'react-native';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import React, { useEffect, useState } from 'react';
import { SettingsSwitch } from '@apps/shared';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  useTabsNavigationContext,
  useTabsHostConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import { DummyScreen } from '@apps/tests/shared/DummyScreens';

const scenarioDescription: ScenarioDescription = {
  name: 'IME insets',
  key: 'test-tabs-ime-insets',
  details:
    'Tests prop that determines whether BottomNavigationView respects IME insets.',
  platforms: ['android'],
};

function ConfigScreen() {
  const { routeKey, routeOptions, setRouteOptions } =
    useTabsNavigationContext();
  const { hostConfig, updateHostConfig } = useTabsHostConfig();
  const [safeAreaViewBottomEdgeEnabled, setSafeAreaViewBottomEdgeEnabled] =
    useState(routeOptions.safeAreaConfiguration?.edges?.bottom ?? true);

  useEffect(() => {
    setRouteOptions(routeKey, {
      safeAreaConfiguration: {
        edges: {
          bottom: safeAreaViewBottomEdgeEnabled,
        },
      },
    });
  }, [routeKey, setRouteOptions, safeAreaViewBottomEdgeEnabled]);

  return (
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
          value={hostConfig.android?.tabBarRespectsIMEInsets ?? false}
          onValueChange={function (value: boolean): void {
            updateHostConfig({ android: { tabBarRespectsIMEInsets: value } });
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
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'Config',
    Component: ConfigScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Config',
      safeAreaConfiguration: {
        edges: {
          bottom: true,
        },
      },
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
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
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
