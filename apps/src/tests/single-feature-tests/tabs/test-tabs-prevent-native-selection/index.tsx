import React from 'react';
import type { ScenarioDescription } from '../../../shared/helpers';
import { createScenario } from '../../../shared/helpers';
import { Button, Text, View } from 'react-native';
import {
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
  useTabsNavigationContext,
  TabsContainerWithHostConfigContext,
  TabRouteOptions,
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
    <CenteredLayoutView
      testID='tab-bar-prevent-native-selection-view'>
      <Text style={{ fontWeight: 'bold', textAlign: 'center' }}
        testID='screen-name-label'>
        {nav.routeKey}
      </Text>
      <Text style={{ textAlign: 'center' }}
        testID='prevent-native-selection-state'>
        preventNativeSelection: {JSON.stringify(preventNativeSelection)}
      </Text>
      <Button
        title="Toggle preventNativeSelection"
        onPress={() =>
          nav.setRouteOptions(nav.routeKey, {
            preventNativeSelection: !preventNativeSelection,
          })
        }
        testID='prevent-native-selection-button'
      />
      <TabsNavigationButtons />
    </CenteredLayoutView>
  );
}

function TabsNavigationButtons() {
  const nav = useTabsNavigationContext();

  return (
    <View>
      <Button title="Select First" onPress={() => nav.selectTab('First')} testID='first-button' />
      <Button title="Select Second" onPress={() => nav.selectTab('Second')}
        testID='second-button' />
      <Button title="Select Third" onPress={() => nav.selectTab('Third')}
        testID='third-button' />
      <Button title="Select Fourth" onPress={() => nav.selectTab('Fourth')}
        testID='fourth-button' />
      <Button title="Select Fifth" onPress={() => nav.selectTab('Fifth')}
        testID='fifth-button' />
      <Button title="Select Sixth" onPress={() => nav.selectTab('Sixth')}
        testID='sixth-button' />
    </View>
  );
}
const ROUTE_OPTIONS: TabRouteOptions = {
  ...DEFAULT_TAB_ROUTE_OPTIONS,
  android: {
    ...DEFAULT_TAB_ROUTE_OPTIONS.android,
    standardAppearance: {
      // Without 'labeled', Android hides labels on all unselected tabs (auto mode with 6 tabs),
      // making it hard to identify tabs when executing the scenario.
      tabBarItemLabelVisibilityMode: 'labeled'
    },
  },
};

const ROUTE_CONFIGS: TabRouteConfig[] = [
  {
    name: 'First',
    Component: ContentView,
    options: { ...ROUTE_OPTIONS, title: 'First', tabBarItemTestID: 'First' },
  },
  {
    name: 'Second',
    Component: ContentView,
    options: { ...ROUTE_OPTIONS, title: 'Second', tabBarItemTestID: 'Second' },
  },
  {
    name: 'Third',
    Component: ContentView,
    options: { ...ROUTE_OPTIONS, title: 'Third', tabBarItemTestID: 'Third' },
  },
  {
    name: 'Fourth',
    Component: ContentView,
    options: { ...ROUTE_OPTIONS, title: 'Fourth', tabBarItemTestID: 'Fourth' },
  },
  {
    name: 'Fifth',
    Component: ContentView,
    options: { ...ROUTE_OPTIONS, title: 'Fifth', tabBarItemTestID: 'Fifth' },
  },
  {
    name: 'Sixth',
    Component: ContentView,
    options: { ...ROUTE_OPTIONS, title: 'Sixth', tabBarItemTestID: 'Sixth' },
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
