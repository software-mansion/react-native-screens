import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, ScrollView } from 'react-native';
import { Text } from 'react-native-gesture-handler';

type StackRouteParamList = {
  First: undefined;
  Second: undefined;
  Third: undefined;
};

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>;
};

type StackNavigationProp = NavigationProp<StackRouteParamList>;

const First = ({navigation}: StackNavigationProp) => {
  return <ScrollView contentInsetAdjustmentBehavior='automatic'>
    <Button onPress={() => navigation.navigate("Second")} title='Second'/>
    <Button onPress={() => navigation.preload("Second")} title='Preload Second'/>
    <Button onPress={() => navigation.preload("Third")} title='Preload Third'/>
  </ScrollView>
}

const Second = ({navigation}: StackNavigationProp) => {
  return <ScrollView contentInsetAdjustmentBehavior='automatic'>
    <Button onPress={() => navigation.navigate("Third")} title='Third'/>
    <Button onPress={() => {navigation.preload("Third")}} title='Preload Third'/>
  </ScrollView>
}

const Third = ({navigation}: StackNavigationProp) => {
  return <Text>Bonjour</Text>
}

const Stack = createNativeStackNavigator<StackRouteParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="First"
          component={First}
          options={{
            gestureEnabled: true,
            animation: "slide_from_right"
          }}
        />
        <Stack.Screen
          name="Second"
          component={Second}
          options={{
            gestureEnabled: true,
            animation: "slide_from_right"
          }}
        />
        <Stack.Screen
          name="Third"
          component={Third}
          options={{
            gestureEnabled: false
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
