import React from 'react';
import { scenarioDescription } from './scenario-description';
import { createScenario } from '@apps/tests/shared/helpers';
import { Button, Text, View } from 'react-native';
import {
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
  useTabsNavigationContext,
  TabsContainerWithHostConfigContext,
  useTabsHostConfig,
} from '@apps/shared/gamma/containers/tabs';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';
import { ToastProvider, useToast } from '@apps/shared';
import { Colors } from '@apps/shared/styling';

function ContentView() {
  const { routeKey } = useTabsNavigationContext();
  const { hostConfig, updateHostConfig } = useTabsHostConfig();

  console.log(`ContentView - render for key ${routeKey}`);

  const [heavyRenderEnabled, setHeavyRenderEnabled] = React.useState(false);

  return (
    <CenteredLayoutView>
      <Text
        testID={`${routeKey}-route-key-label`}
        style={{ fontWeight: 'bold', textAlign: 'center' }}>
        {routeKey}
      </Text>
      <Text
        testID={`${routeKey}-heavy-render-label`}
        style={{ textAlign: 'center' }}>
        heavyRender: {JSON.stringify(heavyRenderEnabled)}
      </Text>
      <Text
        testID={`${routeKey}-reject-stale-label`}
        style={{ textAlign: 'center' }}>
        rejectStaleNavStateUpdates:{' '}
        {JSON.stringify(hostConfig.rejectStaleNavStateUpdates)}
      </Text>
      <HeavyRenderHierarchy enabled={heavyRenderEnabled} timeMs={3000} />
      <TabsNavigationButtons />
      <Button
        testID={`${routeKey}-toggle-heavy-render`}
        title="Toggle heavyRender"
        onPress={() => setHeavyRenderEnabled(prev => !prev)}
      />
      <Button
        testID={`${routeKey}-toggle-reject-stale`}
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

function TabsNavigationButtons() {
  const { routeKey, selectTab } = useTabsNavigationContext();

  return (
    <View>
      <Button
        testID={`${routeKey}-select-first`}
        title="Select First"
        onPress={() => selectTab('First')}
      />
      <Button
        testID={`${routeKey}-select-second`}
        title="Select Second"
        onPress={() => selectTab('Second')}
      />
      <Button
        testID={`${routeKey}-select-third`}
        title="Select Third"
        onPress={() => selectTab('Third')}
      />
      <Button
        testID={`${routeKey}-select-fourth`}
        title="Select Fourth"
        onPress={() => selectTab('Fourth')}
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
      tabBarItemTestID: 'stale-rejection-tab-first',
      tabBarItemAccessibilityLabel: 'stale-rejection-tab-first-label',
    },
  },
  {
    name: 'Second',
    Component: ContentView,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Second',
      tabBarItemTestID: 'stale-rejection-tab-second',
      tabBarItemAccessibilityLabel: 'stale-rejection-tab-second-label',
    },
  },
  {
    name: 'Third',
    Component: ContentView,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Third',
      tabBarItemTestID: 'stale-rejection-tab-third',
      tabBarItemAccessibilityLabel: 'stale-rejection-tab-third-label',
    },
  },
  {
    name: 'Fourth',
    Component: ContentView,
    options: {
      ...DEFAULT_TAB_ROUTE_OPTIONS,
      title: 'Fourth',
      tabBarItemTestID: 'stale-rejection-tab-fourth',
      tabBarItemAccessibilityLabel: 'stale-rejection-tab-fourth-label',
    },
  },
];

function TestTabsStaleStateUpdateRejection() {
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
      rejectStaleNavStateUpdates={true}
      onTabSelectionRejected={event => {
        const message = `onTabSelectionRejected: ${JSON.stringify(
          event.nativeEvent,
          undefined,
          2,
        )}`;
        console.warn(message);
        toast.push({
          message: `onTabSelectionRejected: ${event.nativeEvent.rejectedScreenKey}`,
          backgroundColor: Colors.GreenLight60,
        });
      }}
    />
  );
}

function HeavyRenderHierarchy({
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

export default createScenario(
  TestTabsStaleStateUpdateRejection,
  scenarioDescription,
);
