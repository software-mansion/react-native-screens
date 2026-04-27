import React, { useCallback, useMemo } from 'react';
import { StyleSheet, Text } from 'react-native';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import {
  TabsContainer,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
  useTabsNavigationContext,
} from '@apps/shared/gamma/containers/tabs';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { ToastProvider, useToast } from '@apps/shared/';
import { Colors } from '@apps/shared/styling';

const scenarioDescription: ScenarioDescription = {
  name: 'Tabs lifecycle events',
  key: 'test-tabs-events',
  details:
    'Verify lifecycle events (onWillAppear, etc.) fire on tab switch',
  platforms: ['ios', 'android'],
};

function TabScreen() {
  const { routeKey } = useTabsNavigationContext();

  return (
    <CenteredLayoutView testID={`tabContent-${routeKey}`}>
      <Text style={styles.tabLabel} testID={`tabLabel-${routeKey}`}>
        {routeKey}
      </Text>
      <Text style={styles.tabHint}>Switch tabs to trigger lifecycle events</Text>
    </CenteredLayoutView>
  );
}

function AppContents() {
  const toast = useToast();

  const makeCallbacks = useCallback(
    (tabName: string) => ({
      onWillAppear: () =>
        toast.push({
          message: `${tabName}: onWillAppear`,
          backgroundColor: Colors.GreenLight100,
        }),
      onDidAppear: () =>
        toast.push({
          message: `${tabName}: onDidAppear`,
          backgroundColor: Colors.BlueLight100,
        }),
      onWillDisappear: () =>
        toast.push({
          message: `${tabName}: onWillDisappear`,
          backgroundColor: Colors.NavyLight60,
        }),
      onDidDisappear: () =>
        toast.push({
          message: `${tabName}: onDidDisappear`,
          backgroundColor: Colors.NavyLight100,
        }),
    }),
    [toast],
  );

  const TAB_CONFIGS = useMemo<TabRouteConfig[]>(
    () => [
      {
        name: 'TabA',
        Component: TabScreen,
        options: {
          ...DEFAULT_TAB_ROUTE_OPTIONS,
          tabBarItemTestID: 'tab-a-item',
          tabBarItemAccessibilityLabel: 'Tab A',
          title: 'Tab A',
          ...makeCallbacks('TabA'),
        },
      },
      {
        name: 'TabB',
        Component: TabScreen,
        options: {
          ...DEFAULT_TAB_ROUTE_OPTIONS,
          tabBarItemTestID: 'tab-b-item',
          tabBarItemAccessibilityLabel: 'Tab B',
          title: 'Tab B',
          ...makeCallbacks('TabB'),
        },
      },
      {
        name: 'TabC',
        Component: TabScreen,
        options: {
          ...DEFAULT_TAB_ROUTE_OPTIONS,
          tabBarItemTestID: 'tab-c-item',
          tabBarItemAccessibilityLabel: 'Tab C',
          title: 'Tab C',
          ...makeCallbacks('TabC'),
        },
      },
    ],
    [makeCallbacks],
  );

  return <TabsContainer routeConfigs={TAB_CONFIGS} />;
}

export function App() {
  return (
    <ToastProvider>
      <AppContents />
    </ToastProvider>
  );
}

export default createScenario(App, scenarioDescription);

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  tabHint: {
    color: '#666',
    fontSize: 13,
    textAlign: 'center',
  },
});
