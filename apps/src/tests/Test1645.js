/* eslint-disable react-native/no-inline-styles */

import React, { useEffect, useState } from 'react';
import { Text, View } from 'react-native';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';

const TestBottomTabBar = createBottomTabNavigator();
const TestNativeStack1 = createNativeStackNavigator();
const TestNativeStack2 = createNativeStackNavigator();

const TestScreen1 = () => {
  const [t, setT] = useState(110);

  useEffect(() => {
    const interval = setInterval(() => {
      setT(lastT => lastT + 1);
    }, 100);

    return () => clearInterval(interval);
  }, []);
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000',
      }}>
      {Array.from({ length: 100 }).map((e, idx) => (
        <Text style={{ color: '#fff' }} key={idx}>
          T{idx}: {t}
        </Text>
      ))}
    </View>
  );
};

const TestScreen2 = () => {
  const [t, setT] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setT(lastT => lastT + 1);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: '#000',
      }}>
      {Array.from({ length: 100 }).map((e, idx) => (
        <Text style={{ color: 'red' }} key={idx}>
          T{idx}: {t}
        </Text>
      ))}
    </View>
  );
};
const TestScreenTab1 = () => {
  return (
    <TestNativeStack1.Navigator initialRouteName="screen1a">
      <TestNativeStack1.Screen name="screen1a" component={TestScreen1} />
      <TestNativeStack1.Screen name="screen1b" component={TestScreen2} />
    </TestNativeStack1.Navigator>
  );
};

const TestScreenTab2 = () => {
  return (
    <TestNativeStack2.Navigator initialRouteName="screen2a">
      <TestNativeStack2.Screen name="screen2a" component={TestScreen2} />
      <TestNativeStack2.Screen name="screen2b" component={TestScreen1} />
    </TestNativeStack2.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <TestBottomTabBar.Navigator
        initialRouteName="tab1"
        screenOptions={{
          unmountOnBlur: true,
        }}>
        <TestBottomTabBar.Screen name="tab1" component={TestScreenTab1} />
        <TestBottomTabBar.Screen name="tab2" component={TestScreenTab2} />
      </TestBottomTabBar.Navigator>
    </NavigationContainer>
  );
};

export default App;
