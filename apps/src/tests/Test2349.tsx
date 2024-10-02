import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { Text, View } from 'react-native';

function HomeScreen() {
  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      onLayout={e => {
        console.log('[HOME] screen onLayout layout:', e.nativeEvent.layout);
      }}>
      <Text>Home!</Text>
    </View>
  );
}

function SettingsScreen() {
  return (
    <View
      style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}
      onLayout={e => {
        console.log('[SETTINGS] screen onLayout', e.nativeEvent.layout);
      }}>
      <Text>Settings!</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ freezeOnBlur: true }}>
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
