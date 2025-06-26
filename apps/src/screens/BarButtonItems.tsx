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
          headerLeftBarButtonItems: [
            {
              title: '+allt',
              onPress: () => Alert.alert('Plain pressed'),
              titleStyle: { fontFamily: 'Georgia', fontSize: 16, fontWeight: '800', color: 'black' },
              style: 'Prominent',
              tintColor: 'yellow',
            },
            {
              image: require('../assets/search_black.png'),
              onPress: () => Alert.alert('Search pressed'),
            },
          ],
          headerRightBarButtonItems: [
            {
              style: 'Prominent',
              title: 'Menu',
              menu: [
                {
                  title: 'Search',
                  onPress: () => Alert.alert('Search pressed'),
                },
                {
                  title: 'Search with long text that wraps',
                  onPress: () => Alert.alert('Search with long text pressed'),
                },
              ],
            },
          ],
        }}
        component={Screen}
      />

    </Stack.Navigator>
  );
}
