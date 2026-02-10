import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, ScrollView } from 'react-native';
import LongText from '../../../../shared/LongText';

type RouteParamList = {
  Screen1: undefined;
  Screen2: undefined;
  Screen3: undefined;
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
        onPress={() => navigation.push('Screen2')}
      />
      <LongText />
    </ScrollView>
  );
}

function Screen2({ navigation }: StackNavigationProp) {
  return (
    <ScrollView>
      <Button
        title="Go to screen 3"
        onPress={() => navigation.push('Screen3')}
      />
      <LongText />
    </ScrollView>
  );
}

function Screen3({ navigation }: StackNavigationProp) {
  return (
    <ScrollView>
      <Button
        title="Go to screen 3"
        onPress={() => navigation.push('Screen3')}
      />
      <LongText />
    </ScrollView>
  );
}

export function Tab4() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Screen1"
          component={Screen1}
          options={{ headerTransparent: false }}
        />
        <Stack.Screen
          name="Screen2"
          component={Screen2}
          options={{ headerLargeTitle: true }}
        />
        <Stack.Screen
          name="Screen3"
          component={Screen3}
          options={{ headerTransparent: true }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
