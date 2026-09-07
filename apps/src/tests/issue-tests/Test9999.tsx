import React from 'react';
import { Button, Text, View } from 'react-native';
import {
  defineStackRouteConfigs,
  StackContainer,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';
import {
  DEFAULT_TAB_ROUTE_OPTIONS,
  defineTabRouteConfigs,
  TabsContainer,
  useTabsNavigationContext,
} from '@apps/shared/containers/tabs';
import { CenteredLayoutView } from '@apps/shared/CenteredLayoutView';

function TabScreen() {
  const { routeKey } = useTabsNavigationContext();

  return (
    <CenteredLayoutView>
      <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
        {routeKey}
      </Text>
    </CenteredLayoutView>
  );
}

function StackScreen() {
  const navigation = useStackNavigationContext();

  return (
    <View
      style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
      <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>
        {navigation.routeKey}
      </Text>
      <Button title="Push A" onPress={() => navigation.push('A')} />
      <Button title="Push B" onPress={() => navigation.push('B')} />
      <Button title="Push C" onPress={() => navigation.push('C')} />
      <Button title="Pop" onPress={() => navigation.pop(navigation.routeKey)} />
    </View>
  );
}

const STACK_ROUTE_CONFIGS = defineStackRouteConfigs([
  {
    name: 'A',
    element: <StackScreen />,
    options: { headerConfig: { title: 'A' } },
  },
  {
    name: 'B',
    element: <StackScreen />,
    options: { headerConfig: { title: 'B' } },
  },
  {
    name: 'C',
    element: <StackScreen />,
    options: { headerConfig: { title: 'C' } },
  },
]);

function StackTab() {
  return (
    <StackContainer
      routeConfigs={STACK_ROUTE_CONFIGS}
      initialRouteNames={['A', 'B', 'C', 'A', 'B', 'C']}
    />
  );
}

const TAB_ROUTE_CONFIGS = defineTabRouteConfigs([
  {
    name: 'Tab1',
    element: <TabScreen />,
    options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'Tab1' },
  },
  {
    name: 'Tab2',
    element: <StackTab />,
    options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'Tab2' },
  },
  {
    name: 'Tab3',
    element: <TabScreen />,
    options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'Tab3' },
  },
  {
    name: 'Tab4',
    element: <TabScreen />,
    options: { ...DEFAULT_TAB_ROUTE_OPTIONS, title: 'Tab4' },
  },
]);

export default function Test9999() {
  return (
    <TabsContainer routeConfigs={TAB_ROUTE_CONFIGS} defaultRouteName="Tab2" />
  );
}
