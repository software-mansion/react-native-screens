import React from 'react';

// import { generateStackWithNames } from './helper';
// import { StackContainer } from '../../shared/gamma/containers/stack/StackContainer-legacy';
import { StackContainer, StackRouteConfig, useStackNavigationContext } from '../../shared/gamma/containers/stack';
import { Button, Text, View } from 'react-native';

// export default function App() {
//   return (
//     <StackContainer pathConfigs={generateStackWithNames(['A', 'B', 'C'])} />
//   );
// }

function TemplateScreen() {
  const navigation = useStackNavigationContext();

  return (
    <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
      <Text>Route: {navigation.routeKey}</Text>
      <Button title='Push A' onPress={() => navigation.push('A')} />
      <Button title='Push B' onPress={() => navigation.push('B')} />
      <Button title='Pop' onPress={() => navigation.pop(navigation.routeKey)} />
    </View>
  )
}

const ROUTE_CONFIGS: StackRouteConfig[] = [
  {
    name: 'A',
    Component: TemplateScreen,
    options: {}
  },
  {
    name: 'B',
    Component: TemplateScreen,
    options: {}
  }
]

export default function App() {
  return (
    <StackContainer routeConfigs={ROUTE_CONFIGS} />
  );
}
