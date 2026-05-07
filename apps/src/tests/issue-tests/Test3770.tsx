import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, ScrollView } from 'react-native';
import LongText from '@apps/shared/LongText';

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
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button
        title="Replace with Screen2"
        onPress={() => navigation.replace('Screen2')}
      />
      <LongText />
    </ScrollView>
  );
}

function Screen2({ navigation }: StackNavigationProp) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button
        title="Replace with Screen1"
        onPress={() => navigation.replace('Screen1')}
      />
      <LongText />
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Screen1"
          component={Screen1}
          options={{ headerShown: false, animationTypeForReplace: 'pop' }}
        />
        <Stack.Screen
          name="Screen2"
          component={Screen2}
          options={{
            headerLargeTitleEnabled: true,
            headerTransparent: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
