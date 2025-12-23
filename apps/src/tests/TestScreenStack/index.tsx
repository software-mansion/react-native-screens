import React from 'react';

import { generateStackWithNames } from './helper';
// import { StackContainer } from '../../shared/gamma/containers/stack/StackContainer-legacy';
import { StackContainer, StackRouteConfig, useStackNavigationContext } from '../../shared/gamma/containers/stack';
import { Button, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-screens/experimental';

// export default function App() {
//   return (
//     <StackContainer pathConfigs={generateStackWithNames(['A', 'B', 'C'])} />
//   );
// }

function TemplateScreen() {
  const navigation = useStackNavigationContext();

  return (
    <View style={{ flex: 1, backgroundColor: 'white', justifyContent: 'center' }}>
      <Text>TemplateScreen</Text>
      <Button title='Push B' onPress={() => navigation.push('B')} />
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
