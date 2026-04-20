import React from 'react';
import type { Scenario } from '@apps/tests/shared/helpers';
import { Button, Text, View, type NativeSyntheticEvent } from 'react-native';
import {
  TabsContainerWithHostConfigContext,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
  useTabsNavigationContext,
} from '@apps/shared/gamma/containers/tabs';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { ToastProvider, useToast } from '@apps/shared/';
import { Colors } from '@apps/shared/styling';
import type { MoreTabSelectedEvent, TabSelectedEvent } from 'react-native-screens';

const SCENARIO: Scenario = {
  name: 'More navigation controller',
  key: 'test-tabs-more-navigation-controller',
  details: 'Test navigation and interactions with "More Navigation Controller"',
  platforms: ['ios'],
  AppComponent: App,
};

export default SCENARIO;

function ContentView() {
  const { routeKey } = useTabsNavigationContext();
  return (
    <CenteredLayoutView>
      <Text style={{ fontWeight: 'bold', textAlign: 'center' }} testID={`${routeKey}-content-view`}>
        {routeKey}
      </Text>
      <TabsNavigationButtons />
    </CenteredLayoutView>
  );
}

function TabsNavigationButtons() {
  const nav = useTabsNavigationContext();

  return (
    <View
      testID='test-tabs-more-navigation-controller-view'>
      <Button title="Select First" onPress={() => nav.selectTab('First')} />
      <Button title="Select Second" onPress={() => nav.selectTab('Second')} />
      <Button title="Select Third" onPress={() => nav.selectTab('Third')} />
      <Button title="Select Fourth" onPress={() => nav.selectTab('Fourth')} />
      <Button title="Select Fifth" onPress={() => nav.selectTab('Fifth')} />
      <Button title="Select Sixth" onPress={() => nav.selectTab('Sixth')} />
    </View>
  );
}

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'First',
    Component: ContentView,
    options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'First', tabBarItemTestID: 'First' },
  },
  {
    name: 'Second',
    Component: ContentView,
    options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'Second', tabBarItemTestID: 'Second' },
  },
  {
    name: 'Third',
    Component: ContentView,
    options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'Third', tabBarItemTestID: 'Third' },
  },
  {
    name: 'Fourth',
    Component: ContentView,
    options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'Fourth', tabBarItemTestID: 'Fourth' },
  },
  {
    name: 'Fifth',
    Component: ContentView,
    options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'Fifth', tabBarItemTestID: 'Fifth' },
  },
  {
    name: 'Sixth',
    Component: ContentView,
    options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'Sixth', tabBarItemTestID: 'Sixth' },
  },
];

export function App() {
  return (
    <ToastProvider>
      <AppContents />
    </ToastProvider>
  );
}

function AppContents() {
  const toast = useToast();

  return (
    <TabsContainerWithHostConfigContext
      routeConfigs={ROUTE_CONFIGS}
      ios={{
        onMoreTabSelected: (event: NativeSyntheticEvent<MoreTabSelectedEvent>) => {
          const message = `onMoreTabSelected: ${JSON.stringify(event.nativeEvent, undefined, 2)}`;
          console.warn(message);
          toast.push({ message: 'onMoreTabSelected', backgroundColor: Colors.GreenLight60 });
        },
      }}
      onTabSelected={(event: NativeSyntheticEvent<TabSelectedEvent>) => {
        toast.push({
          backgroundColor: Colors.BlueLight100,
          message: `onTabSelected: ${JSON.stringify(event.nativeEvent.selectedScreenKey)}`,
        });
      }}
    />
  );
}
