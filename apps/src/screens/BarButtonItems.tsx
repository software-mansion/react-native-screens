// NOTE: The full native feature set (style, image, menu, etc.) is available, but the TS types in src/types.tsx need to be updated to match. This example uses only the currently typed props (title, icon, onPress, enabled).
import React from 'react';
import { View, Alert } from 'react-native';
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { ScrollView } from 'react-native-gesture-handler';

const Screen = () => {
  return (
    <ScrollView style={{ flex: 1}} contentInsetAdjustmentBehavior="automatic">
      <View style={{width: '100%', height: 200, backgroundColor: 'black'}} />
      <View style={{width: '100%', height: 200, backgroundColor: 'grey'}} />
      <View style={{width: '100%', height: 1000, backgroundColor: 'white'}} />
    </ScrollView>
  );
};

const Stack = createNativeStackNavigator();

export default function BarButtonItemsExample() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="BarButtonItems Demo"
        options={{
          headerTransparent: true,
          title: 'BarButtonItems Demo',
          // Example: Left bar button items (using only typed props)
          headerLeftBarButtonItems: [
            {
              title: 'Plain',
              onPress: () => Alert.alert('Plain pressed'),
            },
          ],
          // Example: Right bar button items (using only typed props)
          headerRightBarButtonItems: [
            {
              onPress: () => Alert.alert('Search pressed'),
              image: require('../assets/search_black.png'),
              style: 'Plain',
            },
            {
              onPress: () => Alert.alert('Button pressed 2'),
              image: require('../assets/search_black.png'),
              style: 'Prominent',
              tintColor: 'green',
            },
          ],
        }}
        component={Screen}
      />

    </Stack.Navigator>
  );
}
