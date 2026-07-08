import { StyleSheet, Text, TextInput, View } from 'react-native';
import { scenarioDescription } from './scenario-description';
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
        <SettingsSwitch
          label={'safeAreaViewBottomEdgeEnabled'}
          value={safeAreaViewBottomEdgeEnabled}
          onValueChange={function (value: boolean): void {
            setSafeAreaViewBottomEdgeEnabled(value);
          }}
          testID="safe-area-bottom-edge-switch"
        />
      </View>
      <View style={styles.section}>
        <SettingsSwitch
          label={'tabBarRespectsIMEInsets'}
          value={hostConfig.android?.tabBarRespectsIMEInsets ?? false}
          onValueChange={function (value: boolean): void {
            updateHostConfig({ android: { tabBarRespectsIMEInsets: value } });
          }}
          testID="tab-bar-respects-ime-insets-switch"
        />
      </View>
      <View style={styles.section}>
        <TextInput
          placeholder="Focus TextInput to show IME..."
          style={styles.textInput}
          testID="ime-insets-text-input"
        />
      </View>
      <View style={styles.end}>
        <Text testID="tabs-screen-bottom-text">TabsScreen bottom</Text>
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
      tabBarItemTestID: 'ime-insets-config-tab-item',
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
      tabBarItemTestID: 'ime-insets-tab2-tab-item',
    },
  },
];

function TestTabsIMEInsets() {
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingTop: 70,
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

export default createScenario(TestTabsIMEInsets, scenarioDescription);
