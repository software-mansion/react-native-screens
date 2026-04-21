import React from 'react';
import type { ScenarioDescription } from '../../../shared/helpers';
import { createScenario } from '../../../shared/helpers';
import { Button, Text, View } from 'react-native';
import {
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
  useTabsNavigationContext,
  TabsContainerWithHostConfigContext,
} from '../../../../shared/gamma/containers/tabs';
import { CenteredLayoutView } from '../../../../shared/CenteredLayoutView';
import { ToastProvider, useToast } from '../../../../shared/';
import { Colors } from '@apps/shared/styling';

const scenarioDescription: ScenarioDescription = {
  name: 'Prevent native selection',
  key: 'test-tabs-prevent-native-selection',
  details: 'Test preventNativeSelection prop on TabsScreen',
  platforms: ['android', 'ios'],
};

function ContentView() {
  const nav = useTabsNavigationContext();

  const preventNativeSelection =
    nav.routeOptions.preventNativeSelection ?? false;

  return (
    <CenteredLayoutView>
      <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
        {nav.routeKey}
      </Text>
      <Text style={{ textAlign: 'center' }}>
        preventNativeSelection: {JSON.stringify(preventNativeSelection)}
      </Text>
      <Button
        title="Toggle preventNativeSelection"
        onPress={() =>
          nav.setRouteOptions(nav.routeKey, {
            preventNativeSelection: !preventNativeSelection,
          })
        }
      />
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
      <Button title="Select Fourth" onPress={() => nav.selectTab('Fourth')} />
      <Button title="Select Fifth" onPress={() => nav.selectTab('Fifth')} />
      <Button title="Select Sixth" onPress={() => nav.selectTab('Sixth')} />
    </View>
  );
}
const ROUTE_OPTIONS = {
  ...DEFAULT_TAB_ROUTE_OPTIONS,
  android: {
    ...DEFAULT_TAB_ROUTE_OPTIONS.android,
    standardAppearance: {
      // Without 'labeled', Android hides labels on all unselected tabs (auto mode with 6 tabs),
      // making it hard to identify tabs when executing the scenario.
      tabBarItemLabelVisibilityMode: 'labeled' as const,
    },
  },
};

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'First',
    Component: ContentView,
    options: { ...ROUTE_OPTIONS, title: 'First' },
  },
  {
    name: 'Second',
    Component: ContentView,
    options: { ...ROUTE_OPTIONS, title: 'Second' },
  },
  {
    name: 'Third',
    Component: ContentView,
    options: { ...ROUTE_OPTIONS, title: 'Third' },
  },
  {
    name: 'Fourth',
    Component: ContentView,
    options: { ...ROUTE_OPTIONS, title: 'Fourth' },
  },
  {
    name: 'Fifth',
    Component: ContentView,
    options: { ...ROUTE_OPTIONS, title: 'Fifth' },
  },
  {
    name: 'Sixth',
    Component: ContentView,
    options: { ...ROUTE_OPTIONS, title: 'Sixth' },
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
      // 'tabSidebar' enables the sidebar layout on iPad, allowing the iPad-specific
      // section of the scenario to be executed.
      ios={{ tabBarControllerMode: 'tabSidebar' }}
      onTabSelectionPrevented={event => {
        const message = `onTabSelectionPrevented: ${event.nativeEvent.preventedScreenKey}`;
        console.warn(message);
        toast.push({
          message: message,
          backgroundColor: Colors.GreenLight60,
        });
      }}
    />
  );
}

export default createScenario(App, scenarioDescription);
