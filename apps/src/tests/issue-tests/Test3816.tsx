/**
 * Changelog:
 *
 * #3816 - scrollEdgeEffects not applied on modal screens. The prop was set on the outer modal
 *         screen which doesn't contain the scroll view. Fix forwards it to the inner screen.
 */

import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {
  NativeStackNavigationProp,
  createNativeStackNavigator,
} from '@react-navigation/native-stack';
import { Button, ScrollView } from 'react-native';
import LongText from '../../shared/LongText';

type RouteParamList = {
  Home: undefined;
  Modal: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<RouteParamList>;

const Stack = createNativeStackNavigator<RouteParamList>();

function Home({ navigation }: StackNavigationProp) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button
        title="Open formSheet modal"
        onPress={() => navigation.navigate('Modal')}
      />
      <LongText />
    </ScrollView>
  );
}

function Modal({ navigation }: StackNavigationProp) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button title="Go back" onPress={() => navigation.goBack()} />
      <LongText />
    </ScrollView>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="Modal"
          component={Modal}
          options={{
            presentation: 'modal',
            headerTransparent: true,
            scrollEdgeEffects: {
              bottom: 'hidden',
              left: 'hidden',
              right: 'hidden',
              top: 'hidden',
            },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
