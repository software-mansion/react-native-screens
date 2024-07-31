import React from 'react';
import { Text, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const stack = createNativeStackNavigator();
const tabs = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <stack.Navigator screenOptions={{ headerLargeTitle: true }}>
          <stack.Screen name="Tabs" component={Tabs} />
        </stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

function DummyScreen() {
  return (
    <ScrollView
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}>
      <Text>Text</Text>
    </ScrollView>
  );
}

export function Tabs() {
  return (
    <tabs.Navigator screenOptions={{ headerShown: false }}>
      <tabs.Screen name="First" component={DummyScreen} />
      <tabs.Screen name="Second" component={DummyScreen} />
    </tabs.Navigator>
  );
}
