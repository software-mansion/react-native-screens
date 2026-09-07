import React from 'react';
import { Button, Text, View } from 'react-native';
import {
  StackContainer,
  type StackRouteConfig,
  useStackNavigationContext,
} from '@apps/shared/containers/stack';

function TemplateScreen() {
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

const ROUTE_CONFIGS: StackRouteConfig[] = [
  {
    name: 'A',
    element: <TemplateScreen />,
    options: { headerConfig: { title: 'A' } },
  },
  {
    name: 'B',
    element: <TemplateScreen />,
    options: { headerConfig: { title: 'B' } },
  },
  {
    name: 'C',
    element: <TemplateScreen />,
    options: { headerConfig: { title: 'C' } },
  },
];

export default function Test9999() {
  return (
    <StackContainer
      routeConfigs={ROUTE_CONFIGS}
      initialRouteNames={['C', 'B', 'A', 'C', 'B', 'A']}
    />
  );
}
