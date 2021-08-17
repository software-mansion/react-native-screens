import React from 'react';
import 'react-native/tvos-types.d';
import {View, Text} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {STYLES} from './styles';

function Tab1() {
  return (
    <View style={STYLES.screenContainer}>
      <Text>This is tab 1</Text>
    </View>
  );
}

function Tab2() {
  return (
    <View style={STYLES.screenContainer}>
      <Text>This is tab 2</Text>
    </View>
  );
}

function Tab3() {
  return (
    <View style={STYLES.screenContainer}>
      <Text>This is tab 3</Text>
    </View>
  );
}

const Tab = createBottomTabNavigator();

export default function BottomTabsExample() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="1" component={Tab1} />
      <Tab.Screen name="2" component={Tab2} />
      <Tab.Screen name="3" component={Tab3} />
    </Tab.Navigator>
  );
}
