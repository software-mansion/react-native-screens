import React from 'react';
import { Button, Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  GestureHandlerRootView,
  RectButton,
} from 'react-native-gesture-handler';

function HomeScreen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>This is the home screen!</Text>
      <Button
        onPress={() => navigation.navigate('Second')}
        title="Go to Second"
      />
      <RectButton onPress={() => navigation.navigate('Second')}>
        <Text>Go to Second</Text>
      </RectButton>
    </View>
  );
}

function Screen({ navigation }: any) {
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Text style={{ fontSize: 30 }}>This is a screen!</Text>
      <Button onPress={() => navigation.goBack()} title="go back" />
      <RectButton onPress={() => navigation.goBack()}>
        <Text>Go back</Text>
      </RectButton>
    </View>
  );
}

const MainStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function TabsScreen() {
  return (
    <Tabs.Navigator detachInactiveScreens={true}>
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Second" component={Screen} />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <GestureHandlerRootView>
      <NavigationContainer>
        <MainStack.Navigator>
          <MainStack.Screen name="Tabs" component={TabsScreen} />
        </MainStack.Navigator>
      </NavigationContainer>
    </GestureHandlerRootView>
  );
}
