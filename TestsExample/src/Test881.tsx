import React from 'react';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';

const View1 = () => <View style={{flex: 1, backgroundColor: 'red'}} />;
const View2 = () => <View style={{flex: 1, backgroundColor: 'blue'}} />;
const View3 = () => <View style={{flex: 1, backgroundColor: 'yellow'}} />;

const Stack1 = createNativeStackNavigator();
const Stack2 = createNativeStackNavigator();
const Stack3 = createNativeStackNavigator();

const Tab = createBottomTabNavigator();
export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Tab.Navigator>
        <Tab.Screen name="StackNav1" component={StackNav1} />
        <Tab.Screen name="StackNav2" component={StackNav2} />
        <Tab.Screen name="StackNav3" component={StackNav3} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

function StackNav1() {
  return (
    <Stack1.Navigator>
      <Stack1.Screen name="View1" component={View1} />
    </Stack1.Navigator>
  );
}

function StackNav2() {
  return (
    <Stack2.Navigator>
      <Stack2.Screen name="View2" component={View2} />
    </Stack2.Navigator>
  );
}

function StackNav3() {
  return (
    <Stack3.Navigator>
      <Stack3.Screen name="View3" component={View3} />
    </Stack3.Navigator>
  );
}
