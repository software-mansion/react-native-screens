import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, ScrollView, Text } from 'react-native';

type RouteParamList = {
  Screen1: undefined;
  Screen2: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<RouteParamList>;

const Stack = createNativeStackNavigator<RouteParamList>();

function Screen1({ navigation }: StackNavigationProp) {
  return (
    <ScrollView>
      <Button
        title="Go to screen 2"
        onPress={() => {
          console.log('BUG123 go to screen 2');
          navigation.push('Screen2');
        }}
      />
    </ScrollView>
  );
}

function Screen2({ navigation }: StackNavigationProp) {
  return (
    <ScrollView>
      <Button
        title="Go back"
        onPress={() => {
          console.log('BUG123 go back');
          navigation.pop();
        }}
      />
    </ScrollView>
  );
}

export default function Basic() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Screen1" component={Screen1} />
        <Stack.Screen name="Screen2" component={Screen2} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
