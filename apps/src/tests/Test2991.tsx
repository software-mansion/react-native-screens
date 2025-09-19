import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, ScrollView } from 'react-native';

type RouteParamList = {
  Home: undefined;
  Second: undefined;
  Third: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<RouteParamList>;

const Stack = createNativeStackNavigator<RouteParamList>();

const Home = ({ navigation }: StackNavigationProp) => <>
  <ScrollView contentInsetAdjustmentBehavior='automatic'>
    <Button title="Open second" onPress={() => navigation.navigate('Second')} />
    <Button title="Open third" onPress={() => navigation.navigate('Third')} />
  </ScrollView>
</>

const Second = ({ navigation }: StackNavigationProp) => <>
  <ScrollView contentInsetAdjustmentBehavior='automatic'>
    <Button title="Back" onPress={() => navigation.goBack()} />
  </ScrollView>
</>

const Third = ({ navigation }: StackNavigationProp) => <>
  <ScrollView contentInsetAdjustmentBehavior='automatic'>
    <Button title="Back" onPress={() => navigation.goBack()} />
  </ScrollView>
</>

export default function App() {
  return (
    <>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            name="Home"
            component={Home}
            options={{
              headerShown: false,
              headerTitle: "Long back button label"
            }} />
          <Stack.Screen
            name="Second"
            component={Second}
            options={{
              headerBackButtonDisplayMode: 'minimal', // <--- REQUIRED
              headerTitle: "Short title"
            }}
          />
          <Stack.Screen
            name="Third"
            component={Third}
            options={{
              headerBackButtonDisplayMode: 'minimal',
              headerTitle: "Really long title that will not fit the phone screen"
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}
