import React from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import {
  StackContainer,
  type StackRouteConfig,
  useStackNavigationContext,
} from '@apps/shared/gamma/containers/stack';
import {
  TabsContainer,
  type TabRouteConfig,
  useTabsNavigationContext,
  DEFAULT_TAB_ROUTE_OPTIONS,
} from '@apps/shared/gamma/containers/tabs';
import { createScenario } from '@apps/tests/shared/helpers';
import { scenarioDescription } from './scenario-description';

function FirstScreen() {
  const { push } = useStackNavigationContext();

  return (
    <View style={[styles.centered, styles.firstScreen]}>
      <Text style={styles.title}>First stack screen</Text>
      <Button title="Go to nested tabs" onPress={() => push('NestedTabs')} />
    </View>
  );
}

function TabContent({ name }: { name: string }) {
  const { routeKey } = useTabsNavigationContext();

  return (
    <View style={styles.centered}>
      <Text style={styles.title}>{name}</Text>
      <Text style={styles.subtitle}>tab routeKey: {routeKey}</Text>
    </View>
  );
}

function HomeTab() {
  return <TabContent name="Home tab" />;
}

function SettingsTab() {
  return <TabContent name="Settings tab" />;
}

const TAB_ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'HomeTab',
    Component: HomeTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Home',
      android: {
        standardAppearance: {
          tabBarItemLabelVisibilityMode: 'selected',
        },
      },
    },
  },
  {
    name: 'SettingsTab',
    Component: SettingsTab,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Settings',
      android: {
        standardAppearance: {
          tabBarItemLabelVisibilityMode: 'selected',
        },
      },
    },
  },
];

function NestedTabsScreen() {
  return <TabsContainer routeConfigs={TAB_ROUTE_CONFIGS} />;
}

const STACK_ROUTE_CONFIGS: StackRouteConfig[] = [
  {
    name: 'First',
    Component: FirstScreen,
    options: {
      headerConfig: { title: 'First' },
    },
  },
  {
    name: 'NestedTabs',
    Component: NestedTabsScreen,
    options: {
      headerConfig: { title: 'Nested Tabs' },
    },
  },
];

function TestTabsInStackStableEnterTransition() {
  return <StackContainer routeConfigs={STACK_ROUTE_CONFIGS} />;
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    backgroundColor: 'white',
  },
  firstScreen: {
    backgroundColor: '#e6f0ff',
  },
  title: {
    color: 'black',
    fontSize: 22,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#444',
    fontSize: 16,
  },
});

export default createScenario(
  TestTabsInStackStableEnterTransition,
  scenarioDescription,
);
