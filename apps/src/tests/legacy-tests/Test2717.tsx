import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { NativeStackNavigationProp, createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, StyleSheet, Text, View } from 'react-native';

type StackRouteParamList = {
  Home: undefined;
  NestedStackHost: undefined;
}

type NestedStackRouteParamList = {
  NestedHome: undefined;
  NestedSecond: undefined;
  NestedThird: undefined;
}

type NavigationProp<ParamList extends ParamListBase> = {
  navigation: NativeStackNavigationProp<ParamList>,
}

type StackNavigationProp = NavigationProp<StackRouteParamList>;
type NestedStackNavigationProp = NavigationProp<NestedStackRouteParamList>;


const Stack = createNativeStackNavigator<StackRouteParamList>();
const NestedStack = createNativeStackNavigator<NestedStackRouteParamList>();

function Home({ navigation }: StackNavigationProp) {
  return (
    <View style={[{ backgroundColor: 'goldenrod', flex: 1 }, styles.container]}>
      <Button title="Go NestedStack" onPress={() => navigation.navigate('NestedStackHost')} />
    </View>
  );
}

function NestedHome({ navigation }: NestedStackNavigationProp) {
  return (
    <View style={[{ backgroundColor: 'goldenrod', flex: 1 }, styles.container]}>
      <Text>NestedHome</Text>
      <Button title="Go NestedSecond" onPress={() => navigation.navigate('NestedSecond')} />
    </View>
  );
}

function NestedSecond({ navigation }: NestedStackNavigationProp) {
  return (
    <View style={[{ backgroundColor: 'lightsalmon' }, styles.container]}>
      <Text>NestedSecond</Text>
      <Button title="Go back to NestedHome" onPress={() => navigation.popTo('NestedHome')} />
      <Button title="REPLACE with NestedThird" onPress={() => navigation.replace('NestedThird')} />
    </View>
  );
}

function NestedThird({ navigation }: NestedStackNavigationProp) {
  return (
    <View style={[{ backgroundColor: 'lightblue', flex: 1 }, styles.container]}>
      <Text>NestedSecond</Text>
      <Button title="Go back to NestedHome" onPress={() => navigation.popTo('NestedHome')} />
    </View>
  );
}

function NestedStackHost() {
  return (
    <NestedStack.Navigator>
      <NestedStack.Screen name="NestedHome" component={NestedHome} />
      <NestedStack.Screen name="NestedSecond" component={NestedSecond} />
      <NestedStack.Screen name="NestedThird" component={NestedThird} />
    </NestedStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen name="NestedStackHost" component={NestedStackHost} options={{
          headerShown: false,
        }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 24,
    flex: 1,
    alignItems: 'center',
  },
});

