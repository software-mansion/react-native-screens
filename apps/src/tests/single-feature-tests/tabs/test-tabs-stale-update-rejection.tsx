import React from 'react';
import type { ScenarioDescription } from '@apps/tests/shared/helpers';
import { createScenario } from '@apps/tests/shared/helpers';
import { Button, Text, View } from 'react-native';
import {
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
  useTabsNavigationContext,
  TabsContainerWithHostConfigContext,
  useTabsHostConfig,
} from '../../../shared/gamma/containers/tabs';
import { CenteredLayoutView } from '../../../shared/CenteredLayoutView';
import { ToastProvider, useToast } from '../../../shared/';
import { Colors } from '@apps/shared/styling';

const scenarioDescription: ScenarioDescription = {
  name: 'Stale update rejection',
  key: 'test-tabs-stale-update-rejection',
  details: 'Test stale update rejection mechanism',
  platforms: ['android', 'ios'],
};

export function ContentView() {
  const { routeKey } = useTabsNavigationContext();
  const { hostConfig, updateHostConfig } = useTabsHostConfig();

  console.log(`ContentView - render for key ${routeKey}`);

  const [heavyRenderEnabled, setHeavyRenderEnabled] = React.useState(false);

  return (
    <CenteredLayoutView>
      <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
        {routeKey}
      </Text>
      <Text style={{ textAlign: 'center' }}>
        heavyRender: {JSON.stringify(heavyRenderEnabled)}
      </Text>
      <Text style={{ textAlign: 'center' }}>
        rejectStaleNavStateUpdates:{' '}
        {JSON.stringify(hostConfig.rejectStaleNavStateUpdates)}
      </Text>
      <HeavyRenderHierarchy enabled={heavyRenderEnabled} timeMs={3000} />
      <TabsNavigationButtons />
      <Button
        title="Toggle heavyRender"
        onPress={() => setHeavyRenderEnabled(prev => !prev)}
      />
      <Button
        title="Toggle rejectStaleNavStateUpdates"
        onPress={() =>
          updateHostConfig({
            rejectStaleNavStateUpdates: !hostConfig.rejectStaleNavStateUpdates,
          })
        }
      />
    </CenteredLayoutView>
  );
}

export function TabsNavigationButtons() {
  const nav = useTabsNavigationContext();

  return (
    <View>
      <Button title="Select First" onPress={() => nav.selectTab('First')} />
      <Button title="Select Second" onPress={() => nav.selectTab('Second')} />
      <Button title="Select Third" onPress={() => nav.selectTab('Third')} />
      <Button title="Select Fourth" onPress={() => nav.selectTab('Fourth')} />
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
];

export function App() {
  return (
    <ToastProvider>
      <AppContents />
    </ToastProvider>
  );
}

export function AppContents() {
  const toast = useToast();

  return (
    <TabsContainerWithHostConfigContext
      routeConfigs={ROUTE_CONFIGS}
      rejectStaleNavStateUpdates={true}
      onTabSelectionRejected={event => {
        const message = `onTabSelectionRejected: ${JSON.stringify(
          event.nativeEvent,
          undefined,
          2,
        )}`;
        console.warn(message);
        toast.push({ message: message, backgroundColor: Colors.GreenLight60 });
      }}
    />
  );
}

export function HeavyRenderHierarchy({
  enabled,
  timeMs = 5000,
}: {
  enabled: boolean;
  timeMs: number;
}) {
  if (enabled) {
    console.log('HeavyRenderHierarchy computation BEGIN');
    blockThread(timeMs);
    console.log('HeavyRenderHierarchy computation END');
  }
  return (
    <View>
      <Text>HeavyRenderHierarchy</Text>
    </View>
  );
}

function blockThread(ms: number) {
  const end = Date.now() + ms;
  while (Date.now() < end) {}
}

export default createScenario(App, scenarioDescription);
