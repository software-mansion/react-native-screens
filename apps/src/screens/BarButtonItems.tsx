// NOTE: The full native feature set (style, image, menu, etc.) is available, but the TS types in src/types.tsx need to be updated to match. This example uses only the currently typed props (title, icon, onPress, enabled).
import React, { useCallback } from 'react';
import { View, Text, Alert, Image } from 'react-native';
import {
  createNativeStackNavigator,
} from '@react-navigation/native-stack';

const Screen = () => {
  return         <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
  <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 16 }}>
    UIBarButtonItem Features Demo
  </Text>
  <Text style={{ marginBottom: 8 }}>• Title, icon, enabled/disabled, ergonomic onPress</Text>
  <Text style={{ marginBottom: 8 }}>• Full feature set (style, image, menu, etc.) available natively</Text>
  <Text style={{ marginBottom: 8 }}>• Update src/types.tsx to use all features in your app</Text>
</View>;
};

const Stack = createNativeStackNavigator();

export default function BarButtonItemsExample() {
  // Handlers for demonstration
  return (
    <Stack.Navigator>
        <Stack.Screen
          name="BarButtonItems Demo"
          options={{
          title: 'BarButtonItems Demo',
          // Example: Left bar button items (using only typed props)
          headerLeftBarButtonItems: [
            {
              title: 'Plain',
              onPress: () => Alert.alert('Plain pressed'),
              tintColor: 'red',
              style: 2,
            },
          ],
          // Example: Right bar button items (using only typed props)
          headerRightBarButtonItems: [
            {
              onPress: () => Alert.alert('Search pressed'),
              image: require('../assets/search_black.png'),
              style: 1,
              enabled: false,
            },
            {
              onPress: () => Alert.alert('Search pressed'),
              image: require('../assets/search_black.png'),
              style: 2,
            },
          ],
        }}
        component={Screen}
        />

    </Stack.Navigator>
  );
}
