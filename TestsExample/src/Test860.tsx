import React from 'react';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {ScrollView, Button, Text} from 'react-native';
import {createNativeStackNavigator, NativeStackNavigationProp} from 'react-native-screens/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';

const Stack = createNativeStackNavigator();

export default function NativeNavigation() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          stackPresentation: 'push',
          stackAnimation: 'slide_from_right',
        }}>
        <Stack.Screen
          name="Home"
          component={Home}
          options={{
            statusBarColor: 'blue',
            statusBarAnimation: 'slide',
            statusBarStyle: 'auto',
            statusBarTranslucent: true,
            // headerTopInsetEnabled: false,
            statusBarHidden: false,
          }}
        />
        <Stack.Screen
          name="NestedNavigator"
          component={NestedNavigator}
          options={{
            statusBarColor: 'red',
            statusBarAnimation: 'slide',
            statusBarStyle: 'dark',
            statusBarTranslucent: true,
            // headerTopInsetEnabled: true,
            statusBarHidden: false,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// change to createStackNavigator to test with stack in the middle
const Tab = createStackNavigator();

const NestedNavigator = () => (
  <Tab.Navigator>
    <Tab.Screen name="Screen1" component={Home} />
    <Tab.Screen name="Screen2" component={Inner} />
    <Tab.Screen name="Screen3" component={Home} />
  </Tab.Navigator>
);

const InnerStack = createNativeStackNavigator();

const Inner = () => (
  <InnerStack.Navigator
    screenOptions={{
      statusBarColor: 'pink',
      statusBarAnimation: 'none',
      statusBarStyle: 'auto',
      headerShown: false,
    }}>
    <InnerStack.Screen name="DeeperHome" component={Home} />
  </InnerStack.Navigator>
);

function Home({navigation}: {navigation: NativeStackNavigationProp<ParamListBase>}) {
  return (
    <ScrollView
      style={{backgroundColor: 'yellow'}}
      contentInsetAdjustmentBehavior="automatic"
      >
      <Button
        title="NestedNavigator"
        onPress={() => {
          navigation.push('NestedNavigator');
        }}
      />
      <Button
        title="Screen2"
        onPress={() => {
          navigation.navigate('Screen2');
        }}
      />
      <Button
        title="Pop one modal"
        onPress={() => {
          navigation.pop();
        }}
      />
      <Button
        title="Randomly change status bar color"
        onPress={() => {
          navigation.setOptions({
            statusBarColor: Math.random() > 0.5 ? 'mediumseagreen' : 'powderblue',
          });
        }}
      />
      <Button
        title="Randomly change status bar style"
        onPress={() => {
          navigation.setOptions({
            statusBarStyle: Math.random() > 0.5 ? 'dark' : 'light',
          });
        }}
      />
      <Button
        title="Randomly change status bar hidden"
        onPress={() => {
          navigation.setOptions({
            statusBarHidden: Math.random() > 0.5,
          });
        }}
      />
            <Button
        title="Randomly change status bar translucent"
        onPress={() => {
          navigation.setOptions({
            statusBarTranslucent: Math.random() > 0.5,
          });
        }}
      />
            <Button
        title="Randomly change status bar animation"
        onPress={() => {
          navigation.setOptions({
            statusBarAnimation: Math.random() > 0.5 ? 'slide' : 'none',
          });
        }}
      />
      <Text>Go to `TabNavigator` and then go to second tab there. Spot the difference between dismissing modal with a swipe and with a `Pop to top` button. </Text> 
    </ScrollView>
  );
}
