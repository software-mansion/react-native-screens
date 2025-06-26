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
              style: 'prominent',
              tintColor: 'yellow',
            },
            {
              image: require('../assets/search_black.png'),
              onPress: () => Alert.alert('Search pressed'),
              accessibilityLabel: 'SÖK HÄR',
              accessibilityHint: 'Tryck för att söka',
            },
          ],
          headerRightBarButtonItems: [
            {
              style: 'prominent',
              title: 'Menu',
              tintColor: 'purple',
              menu: {
                items: [
                {
                  title: 'Search',
                  systemImage: 'magnifyingglass.circle.fill',
                  onPress: () => Alert.alert('Search pressed'),
                  state: 'mixed',
                },
                {
                  title: 'Search with long text that wraps',
                  onPress: () => Alert.alert('Search with long text pressed'),
                  attributes: 'keepsMenuPresented',
                },
                {
                  title: 'Submenu',
                  items: [
                    {
                      title: 'Submenu Item 1',
                      systemImage: 'magnifyingglass.circle.fill',
                      onPress: () => Alert.alert('Submenu Item 1 pressed'),
                    },
                    {
                      title: 'Submenu Item 2',
                      onPress: () => Alert.alert('Submenu Item 2 pressed'),
                    },
                  ],
                },
              ],
            }},
          ],
        }}
        component={Screen}
      />

    </Stack.Navigator>
  );
}
