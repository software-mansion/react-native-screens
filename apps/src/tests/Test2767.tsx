import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { Button, Text, View } from 'react-native';

type RouteNavProps<T extends ParamListBase> = {
  navigation: NativeStackNavigationProp<T>
}

type StackRouteParamList = {
  StackHome: undefined,
  StackSheet: undefined,
  StackSecond: undefined,
  NestedStackHost: undefined;
}

// Inherit routes from parent navigator
type NestedStackRouteParamList = StackRouteParamList & {
  NestedHome: undefined;
  NestedSheet: undefined;
  NestedSecond: undefined;
}

type StackRouteNavProps = RouteNavProps<StackRouteParamList>;
type NestedStackRouteNavProps = RouteNavProps<NestedStackRouteParamList>;

const Stack = createNativeStackNavigator<StackRouteParamList>();
const NestedStack = createNativeStackNavigator<NestedStackRouteParamList>();

function StackHome({ navigation }: StackRouteNavProps) {
  return (
    <View style={{ flex: 1, backgroundColor: 'lightgreen' }}>
      <Button title="Open sheet" onPress={() => navigation.navigate('StackSheet')} />
      <Button title="Open StackSecond" onPress={() => navigation.navigate('StackSecond')} />
      <Button title="Open NestedStackHost" onPress={() => navigation.navigate('NestedStackHost')} />
    </View>
  );
}

function StackSheet({ navigation }: StackRouteNavProps) {
  return (
    <View style={{ flex: 1, backgroundColor: 'lightblue' }}>
      <Text>Hello world from sheet</Text>
      <Button title="Open StackSecond" onPress={() => navigation.navigate('StackSecond')} />
    </View>
  );
}

function StackSecond({ navigation }: StackRouteNavProps) {
  return (
    <View style={{ flex: 1, backgroundColor: 'yellow' }}>
      <Button title="PopTo StackSheet" onPress={() => navigation.popTo('StackSheet')} />
      <Button title="PopTo StackHome" onPress={() => navigation.popTo('StackHome')} />
    </View>
  );
}

function NestedHome({ navigation }: NestedStackRouteNavProps) {
  return (
    <View style={{ flex: 1, backgroundColor: 'crimson' }}>
      <Button title="Open NestedSheet" onPress={() => navigation.navigate('NestedSheet')} />
      <Button title="Open StackSheet" onPress={() => navigation.navigate('StackSheet')} />
    </View>
  );
}

function NestedSheet({ navigation }: NestedStackRouteNavProps) {
  return (
    <View style={{ flex: 1, backgroundColor: 'goldenrod' }}>
      <Text>Hello world from nested sheet</Text>
      <Button title="Open StackSecond" onPress={() => navigation.navigate('StackSecond')} />
    </View>
  );
}

function NestedSecond({ navigation }: NestedStackRouteNavProps) {
  return (
    <View style={{ flex: 1, backgroundColor: 'crimson' }}>
      <Text>Hello from NestedSecond</Text>
      <Button title="Open sheet" onPress={() => navigation.navigate('NestedSheet')} />
    </View>
  );
}

function NestedStackHost({ navigation }: StackRouteNavProps) {
  return (
    <NestedStack.Navigator>
      <NestedStack.Screen name="NestedHome" component={NestedHome} />
      <NestedStack.Screen name="NestedSheet" component={NestedSheet} options={{
        presentation: 'formSheet',
        sheetAllowedDetents: [0.4, 0.8],
        sheetLargestUndimmedDetentIndex: 'none',
      }} />
    </NestedStack.Navigator>

  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="StackHome" component={StackHome} />
        <Stack.Screen name="StackSecond" component={StackSecond} />
        <Stack.Screen name="StackSheet" component={StackSheet} options={{
          presentation: 'formSheet',
          sheetAllowedDetents: [0.4, 0.8],
          sheetLargestUndimmedDetentIndex: 'none',
        }} />
        <Stack.Screen name="NestedStackHost" component={NestedStackHost} options={{
          headerShown: false,
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

