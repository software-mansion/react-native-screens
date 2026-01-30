import React from 'react';

import {
  StackContainer,
  StackRouteConfig,
  useStackNavigationContext,
} from '../../shared/gamma/containers/stack';
import { Button, Text, View } from 'react-native';

function TemplateScreen() {
  const navigation = useStackNavigationContext();

  return (
    <View
      style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
      <Text>Route: {navigation.routeKey}</Text>
      <Button title="Push A" onPress={() => navigation.push('A')} />
      <Button title="Push B" onPress={() => navigation.push('B')} />
      <Button
        title="Push NestedStack"
        onPress={() => navigation.push('NestedStack')}
      />
      <Button title="Pop" onPress={() => navigation.pop(navigation.routeKey)} />
      <Button title="Preload A" onPress={() => navigation.preload('A')} />
      <Button title="Preload B" onPress={() => navigation.preload('B')} />
    </View>
  );
}

function NestedTemplateScreen() {
  const navigation = useStackNavigationContext();

  return (
    <View
      style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
      <Text>Route: {navigation.routeKey}</Text>
      <Button title="Push NestedA" onPress={() => navigation.push('NestedA')} />
      <Button title="Push NestedB" onPress={() => navigation.push('NestedB')} />
      <Button title="Pop" onPress={() => navigation.pop(navigation.routeKey)} />
      <Button
        title="Preload NestedA"
        onPress={() => navigation.preload('NestedA')}
      />
      <Button
        title="Preload NestedB"
        onPress={() => navigation.preload('NestedB')}
      />
    </View>
  );
}

function NestedStackScreen() {
  return <StackContainer routeConfigs={ROUTE_CONFIGS_NESTED_STACK} />;
}

const ROUTE_CONFIGS: StackRouteConfig[] = [
  {
    name: 'A',
    Component: TemplateScreen,
    options: {},
  },
  {
    name: 'B',
    Component: TemplateScreen,
    options: {},
  },
  {
    name: 'NestedStack',
    Component: NestedStackScreen,
    options: {},
  },
];

const ROUTE_CONFIGS_NESTED_STACK: StackRouteConfig[] = [
  {
    name: 'NestedA',
    Component: NestedTemplateScreen,
    options: {},
  },
  {
    name: 'NestedB',
    Component: NestedTemplateScreen,
    options: {},
  },
];

export default function App() {
  return <StackContainer routeConfigs={ROUTE_CONFIGS} />;
}
