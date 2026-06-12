import React, { createContext, useContext, useState, useEffect } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';

import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { SettingsSwitch } from '@apps/shared';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  useTabsHostConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import {
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import { Colors } from '@apps/shared/styling';

const TestConfigContext = createContext({
  syncInsets: true,
  setSyncInsets: (_: boolean) => {},
});

export function SetupScreen() {
  const { syncInsets, setSyncInsets } = useContext(TestConfigContext);
  const { push } = useStackNavigationContext();

  return (
    <View style={styles.centerContainer}>
      <Text style={styles.heading}>Test Configuration</Text>

      <View style={styles.section}>
        <SettingsSwitch
          label="shouldApplyInsetsSynchronously"
          value={syncInsets}
          onValueChange={setSyncInsets}
        />
      </View>

      <Button
        title="Push Tabs Screen"
        color={Colors.primary}
        onPress={() => push('TabsScreen')}
      />
    </View>
  );
}

export function DummyTabScreen() {
  const { syncInsets } = useContext(TestConfigContext);
  const { updateHostConfig } = useTabsHostConfig();

  useEffect(() => {
    updateHostConfig({
      android: { tabBarShouldApplyInsetsSynchronously: syncInsets },
    });
  }, [syncInsets, updateHostConfig]);

  return (
    <View style={styles.centerContainer}>
      <Text style={styles.heading}>Inside Tabs</Text>
      <Text style={styles.info}>
        Synchronous Insets: {syncInsets ? 'ENABLED' : 'DISABLED'}
      </Text>
    </View>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'MainTab',
    Component: DummyTabScreen,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Main',
    },
  },
  {
    name: 'SecondaryTab',
    Component: () => (
      <View style={styles.centerContainer}>
        <Text style={styles.text}>Another tab</Text>
      </View>
    ),
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Secondary',
    },
  },
];

export function TabsScreen() {
  return <TabsContainerWithHostConfigContext routeConfigs={ROUTE_CONFIGS} />;
}

export function App() {
  const [syncInsets, setSyncInsets] = useState(true);

  return (
    <TestConfigContext.Provider value={{ syncInsets, setSyncInsets }}>
      <StackContainer
        routeConfigs={[
          {
            name: 'SetupScreen',
            Component: SetupScreen,
            options: {},
          },
          {
            name: 'TabsScreen',
            Component: TabsScreen,
            options: {},
          },
        ]}
      />
    </TestConfigContext.Provider>
  );
}

const styles = StyleSheet.create({
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    backgroundColor: Colors.background,
  },
  heading: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: Colors.text,
  },
  info: {
    fontSize: 16,
    color: Colors.NavyLight60,
    marginTop: 10,
  },
  text: {
    fontSize: 16,
    color: Colors.text,
  },
  section: {
    marginBottom: 30,
    width: '100%',
    backgroundColor: Colors.cardBackground,
    borderColor: Colors.cardBorder,
    borderWidth: 1,
    borderRadius: 8,
    padding: 16,
  },
});

export default createScenario(App, scenarioDescription);
