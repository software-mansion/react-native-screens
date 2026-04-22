import React from 'react';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { Button, Text, View } from 'react-native';
import {
  TabsContainer,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
  useTabsNavigationContext,
} from '@apps/shared/gamma/containers/tabs';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';

const scenarioDescription: ScenarioDescription = {
  name: 'Test simple navigation',
  key: 'test-tabs-simple-nav',
  details: 'Test basic navigation scenarios',
  platforms: ['android', 'ios'],
};

function ContentView() {
  const { routeKey } = useTabsNavigationContext();
  return (
    <CenteredLayoutView>
      <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
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
      <Button title="Select First" onPress={() => nav.selectTab('First')} />
      <Button title="Select Second" onPress={() => nav.selectTab('Second')} />
      <Button title="Select Third" onPress={() => nav.selectTab('Third')} />
    </View>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'First',
    Component: ContentView,
    options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'First' },
  },
  {
    name: 'Second',
    Component: ContentView,
    options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'Second' },
  },
  {
    name: 'Third',
    Component: ContentView,
    options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'Third' },
  },
];

export function App() {
  return <TabsContainer routeConfigs={ROUTE_CONFIGS} />;
}

export default createScenario(App, scenarioDescription);
