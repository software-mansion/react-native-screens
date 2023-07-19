import * as React from 'react';
import { View, Text, Button } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function First({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>This is a first screen!</Text>
      <Button onPress={() => navigation.navigate('Modal')} title="Modal" />
    </View>
  );
}

function Modal({ navigation }) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>This is a modal screen!</Text>
      <Button onPress={() => navigation.navigate('Tab2')} title="Tab2" />
    </View>
  );
}

function Second() {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>This is a second screen!</Text>
    </View>
  );
}

function ModalStack() {
  return (
    <Stack.Navigator
      screenOptions={{
        stackPresentation: 'modal',
      }}>
      <Stack.Screen name="First" component={First} />
      <Stack.Screen name="Modal" component={Modal} />
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={{ unmountOnBlur: false }}>
        <Tab.Screen name="Tab1" component={ModalStack} />
        <Tab.Screen name="Tab2" component={Second} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
