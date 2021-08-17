import React from 'react';
import 'react-native/tvos-types.d';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import HomeScreen from './src/HomeScreen';
import BottomTabsExample from './src/BottomTabsExample';
import ModalsExample from './src/ModalsExample';
import NativeStackExample from './src/NativeStackExample';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{title: '📺 React Native Screens'}}
        />
        <Stack.Screen name="Bottom Tabs" component={BottomTabsExample} />
        <Stack.Screen name="Modals" component={ModalsExample} />
        <Stack.Screen name="Native Stack" component={NativeStackExample} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
