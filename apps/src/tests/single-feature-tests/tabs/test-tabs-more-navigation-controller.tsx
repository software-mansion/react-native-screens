import React from 'react';
import type { Scenario } from '../../shared/helpers';
import { Button, Text, View } from 'react-native';
import {
  TabsContainer,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
  useTabsNavigationContext,
} from '../../../shared/gamma/containers/tabs';
import { CenteredLayoutView } from '../../../shared/CenteredLayoutView';

const SCENARIO: Scenario = {
  name: 'More navigation controller',
  key: 'test-tabs-more-navigation-controller',
  details: 'Test navigation and interactions with "More Naviagation Controller"',
  platforms: ['ios'],
  AppComponent: App,
};

export default SCENARIO;

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
      <Button title="Select First" onPress={() => nav.changeTabTo('First')} />
      <Button title="Select Second" onPress={() => nav.changeTabTo('Second')} />
      <Button title="Select Third" onPress={() => nav.changeTabTo('Third')} />
      <Button title="Select Fourth" onPress={() => nav.changeTabTo('Fourth')} />
      <Button title="Select Fifth" onPress={() => nav.changeTabTo('Fifth')} />
      <Button title="Select Sixth" onPress={() => nav.changeTabTo('Sixth')} />
      <Button title="Select MoreTab" onPress={() => nav.changeTabTo('moreNavigationController')} />
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
  {
    name: 'Fourth',
    Component: ContentView,
    options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'Fourth' },
  },
  {
    name: 'Fifth',
    Component: ContentView,
    options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'Fifth' },
  },
  {
    name: 'Sixth',
    Component: ContentView,
    options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'Sixth' },
  },
];

export function App() {
  return <TabsContainer routeConfigs={ROUTE_CONFIGS} />;
}
