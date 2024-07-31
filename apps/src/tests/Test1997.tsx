import React from 'react';
import { Text, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const stack = createNativeStackNavigator();
const tabs = createBottomTabNavigator();

export default function App() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <NavigationContainer>
        <stack.Navigator
          screenOptions={{
            statusBarColor: 'white',
            statusBarStyle: 'dark',
            headerTopInsetEnabled: false,
            headerShown: true,
            headerTranslucent: true,
            headerLargeTitle: true,
          }}>
          <stack.Screen name="tabbar" component={Tabbar} />
        </stack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}

function DummyScreen() {
  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={{
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
      }}>
      <Text>Text</Text>
    </ScrollView>
  );
}

export function Tabbar({ navigation }: any) {
  return (
    <tabs.Navigator screenOptions={{ headerShown: false }}>
      <tabs.Screen
        name="First"
        component={DummyScreen}
        listeners={{ focus: () => navigation.setOptions({ title: 'First' }) }}
      />
      <tabs.Screen
        name="Second"
        component={DummyScreen}
        listeners={{ focus: () => navigation.setOptions({ title: 'Second' }) }}
      />
    </tabs.Navigator>
  );
}
