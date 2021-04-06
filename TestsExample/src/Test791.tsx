import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import {StyleSheet, Button, View, Text} from 'react-native';
import {createNativeStackNavigator, NativeStackScreenProps} from 'react-native-screens/native-stack';

const MainScreen = ({navigation}: NativeStackScreenProps<ParamListBase>) => {

  return (
    <View style={styles.screen}>
      <Button onPress={() => {
      navigation.push('Push');
      setTimeout(() => navigation.push('Push'), 10);
      setTimeout(() => navigation.push('Push'), 20);
      setTimeout(() => navigation.push('Push'), 30);
      setTimeout(() => navigation.push('Push'), 40);
      }} title="Click this button to see the crash if native changes not applied" />
            <Button onPress={() => {
      navigation.push('Modal');
      }} title="Push modal" />
      <Text>Issue 791</Text>
    </View>
  )
}

const PushScreen = ({navigation}: NativeStackScreenProps<ParamListBase>) => (
  <View style={styles.screen}>
    <Button onPress={() => {
      navigation.push('Push');
      setTimeout(() => navigation.push('Push'), 10);
      setTimeout(() => navigation.push('Push'), 20);
      setTimeout(() => navigation.push('Push'), 30);
      setTimeout(() => navigation.push('Push'), 40);
      }} title="Click this button to see the crash if native changes not applied" />
      <Button onPress={() => {
      navigation.pop();
      setTimeout(() => navigation.pop(), 10);
      setTimeout(() => navigation.pop(), 20);
      }} title="Click this button to pop" />
  </View>
);

const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        component={MainScreen}
      />
      <Stack.Screen
        name="Push"
        component={PushScreen}
      />
      <Stack.Screen
        name="Modal"
        component={PushScreen}
        options={{ stackPresentation: 'modal'}}
      />
    </Stack.Navigator>
  </NavigationContainer>
);

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    flex: 1,
    paddingTop: 200,
    alignItems: 'center',
  },
});

export default App;
