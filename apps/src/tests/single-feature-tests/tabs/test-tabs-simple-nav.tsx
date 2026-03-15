import React from 'react';
import type { Scenario } from '../../shared/helpers';
import { Text } from 'react-native';
import {
  TabsContainer,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
  useTabsNavigationContext,
} from '../../../shared/gamma/containers/tabs';
import { CenteredLayoutView } from '../../../shared/CenteredLayoutView';

const SCENARIO: Scenario = {
  name: 'Test simple navigation',
  key: 'test-tabs-simple-nav',
  details: 'Test basic navigation scenarios',
  platforms: ['android', 'ios'],
  AppComponent: App,
};

export default SCENARIO;

function ContentView() {
  const { routeKey } = useTabsNavigationContext();
  return (
    <CenteredLayoutView>
      <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>{routeKey}</Text>
    </CenteredLayoutView>
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
