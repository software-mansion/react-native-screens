import React from 'react';
import {Button, Text, View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

function HomeScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 30}}>This is the home screen!</Text>
      <Button
        onPress={() => navigation.navigate('Details')}
        title="Go to Details"
      />
      <Button
        onPress={() => navigation.navigate('Second')}
        title="Go to Second"
      />
    </View>
  );
}

function DetailsScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button
        onPress={() => navigation.navigate('Settings')}
        title="Go to Settings"
      />
      <Text>Details</Text>
    </View>
  );
}

function SettingsScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Button onPress={() => navigation.navigate('Home')} title="Go to Home" />
      <Text>Details</Text>
    </View>
  );
}

function SecondScreen({navigation}) {
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Text style={{fontSize: 30}}>This is a second screen!</Text>
      <Button onPress={() => navigation.goBack()} title="go back"/>
    </View>
  );
}

const MainStack = createNativeStackNavigator();
const Tabs = createBottomTabNavigator();

function MainStackScreen() {
  return (
    <MainStack.Navigator screenOptions={{headerLargeTitle: true}}>
      <MainStack.Screen name="Main" component={TabsScreen} />
      <MainStack.Screen name="Details" component={DetailsScreen} />
      <MainStack.Screen name="Settings" component={SettingsScreen} />
    </MainStack.Navigator>
  );
}

function TabsScreen() {
  return (
    <Tabs.Navigator
      detachInactiveScreens={true}
      screenOptions={{detachPreviousScreen: false}}>
      <Tabs.Screen
        name="Home"
        component={HomeScreen}
      />
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
