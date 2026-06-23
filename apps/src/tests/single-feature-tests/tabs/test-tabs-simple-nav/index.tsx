import React from 'react';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Button, Text, View } from 'react-native';
import {
  TabsContainer,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
  useTabsNavigationContext,
} from '@apps/shared/gamma/containers/tabs';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';

function ContentView() {
  const { routeKey } = useTabsNavigationContext();
  return (
    <CenteredLayoutView>
      <Text
        style={{ fontWeight: 'bold', textAlign: 'center' }}
        testID="route-key-label">
        {routeKey}
      </Text>
      <TabsNavigationButtons />
    </CenteredLayoutView>
  );
}

function TabsNavigationButtons() {
  const nav = useTabsNavigationContext();

  return (
    <View>
      <Button
        title="Select First"
        onPress={() => nav.selectTab('First')}
        testID="select-first-button"
      />
      <Button
        title="Select Second"
        onPress={() => nav.selectTab('Second')}
        testID="select-second-button"
      />
      <Button
        title="Select Third"
        onPress={() => nav.selectTab('Third')}
        testID="select-third-button"
      />
    </View>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'First',
    Component: ContentView,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'First',
      tabBarItemTestID: 'tab-bar-item-first',
      tabBarItemAccessibilityLabel: 'FirstTab',
    },
  },
  {
    name: 'Second',
    Component: ContentView,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Second',
      tabBarItemTestID: 'tab-bar-item-second',
    },
  },
  {
    name: 'Third',
    Component: ContentView,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Third',
      tabBarItemTestID: 'tab-bar-item-third',
    },
  },
];

export function TestTabsSimpleNav() {
  return <TabsContainer routeConfigs={ROUTE_CONFIGS} />;
}

export default createScenario(TestTabsSimpleNav, scenarioDescription);
