import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Button, StyleSheet, Text, View } from 'react-native';

const Stack = createNativeStackNavigator();
const NestedStack = createNativeStackNavigator();

function Home({ navigation }) {
  return (
    <View style={[{ backgroundColor: 'goldenrod', flex: 1 }, styles.container]}>
      <Button title="Go NestedStack" onPress={() => navigation.navigate('NestedStackHost')} />
    </View>
  );
}

function NestedHome({ navigation }) {
  return (
    <View style={[{ backgroundColor: 'goldenrod', flex: 1 }, styles.container]}>
      <Text>NestedHome</Text>
      <Button title="Go NestedSecond" onPress={() => navigation.navigate('NestedSecond')} />
    </View>
  );
}

function NestedSecond({ navigation }) {
  return (
    <View style={[{ backgroundColor: 'lightsalmon' }, styles.container]}>
      <Text>NestedSecond</Text>
      <Button title="Go back to NestedHome" onPress={() => navigation.popTo('NestedHome')} />
      <Button title="REPLACE with NestedThird" onPress={() => navigation.replace('NestedThird')} />
    </View>
  );
}

function NestedThird({ navigation }) {
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

