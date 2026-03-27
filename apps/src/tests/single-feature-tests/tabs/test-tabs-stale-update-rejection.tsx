import React, { Suspense } from 'react';
import type { Scenario } from '../../shared/helpers';
import { Button, Text, View } from 'react-native';
import {
  TabsContainer,
  type TabRouteConfig,
  DEFAULT_TAB_ROUTE_OPTIONS,
  useTabsNavigationContext,
} from '../../../shared/gamma/containers/tabs';
import { CenteredLayoutView } from '../../../shared/CenteredLayoutView';
import { Rectangle } from 'apps/src/shared/Rectangle';
import Colors from 'apps/src/shared/styling/Colors';

const SCENARIO: Scenario = {
  name: 'Stale update rejection',
  key: 'test-tabs-stale-update-rejection',
  details: 'Test stale update rejection mechanism',
  platforms: ['android', 'ios'],
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

function SuspenseHierarchy({ promise }: { promise: Promise<string> }) {
  return (
    <Suspense fallback={<SuspenseFallback />}>
      <SuspendingComponent promise={promise} />
    </Suspense>
  );

}

function SuspendingComponent({ promise }: { promise: Promise<string> }) {
  const promiseValue = React.use(promise);
  return (
    <Rectangle color={Colors.GreenLight60} width={'100%'} height={128}>
      <Text>SuspendingComponent: {promiseValue}</Text>
    </Rectangle>
  );
}

function SuspenseFallback() {
  return (
    <Rectangle color={Colors.GreenLight60} width={'100%'} height={128}>
      <Text>Fallback</Text>
    </Rectangle>
  );
}

function createTimeoutPromise(timeout: number = 4000): Promise<string> {
  return new Promise((resolve, _) => {
    setTimeout(() => {
      resolve('Promise resolved');
    }, timeout);
  });
}
