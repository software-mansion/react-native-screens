import React from 'react';
import { Button, Text, ScrollView } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

function HomeScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={{padding: 10, paddingTop: 160, height: 1500}} testID="main-scrollview">
      <Text style={{ fontSize: 30 }}>This is the home screen!</Text>
      <Button
        onPress={() => navigation.navigate('Details')}
        title="Go to Details"
        testID="home-button-go-to-details"
      />
      <Button
        onPress={() => navigation.navigate('Second')}
        title="Go to Second"
        testID="home-button-go-to-second"
      />
    </ScrollView>
  );
}

function DetailsScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={{padding: 10, paddingTop: 160, height: 1500}}>
      <Button
        onPress={() => navigation.navigate('Settings')}
        title="Go to Settings"
        testID="details-button-go-to-settings"
      />
      <Text>Some text.</Text>
    </ScrollView>
  );
}

function SettingsScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={{padding: 10, paddingTop: 160, height: 1500}}>
      <Button
        onPress={() => navigation.popTo('Main', { screen: 'Home' })}
        title="Go to Home"
        testID="settings-button-go-to-home"
      />
      <Text>Some text.</Text>
    </ScrollView>
  );
}

function SecondScreen({ navigation }) {
  return (
    <ScrollView contentContainerStyle={{padding: 10, paddingTop: 160, height: 1500}}>
      <Text style={{ fontSize: 30 }}>This is a second screen!</Text>
      <Button onPress={() => navigation.goBack()} title="go back" testID="second-button-go-back" />
    </ScrollView>
  );
}

const MainStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator screenOptions={{ headerLargeTitle: true }}>
      <MainStack.Screen name="Main" component={TabsScreen} />
      <MainStack.Screen name="Details" component={DetailsScreen} />
      <MainStack.Screen name="Settings" component={SettingsScreen} />
    </MainStack.Navigator>
  );
}

function TabsScreen() {
  return (
    <Tabs.Navigator detachInactiveScreens={true} screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="Home" component={HomeScreen} />
      <Tabs.Screen name="Second" component={SecondScreen} />
    </Tabs.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <MainStackScreen />
    </NavigationContainer>
  );
}
