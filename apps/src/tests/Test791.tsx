import React from 'react';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
import { StyleSheet, Button, View, Text } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

const MainScreen = ({ navigation }: NativeStackScreenProps<ParamListBase>) => {
  return (
    <View style={styles.screen}>
      <Button
        onPress={() => {
          navigation.push('Push');
          setTimeout(() => {
            console.log('Pushing 1');
            navigation.push('Push');
          }, 1000);
          setTimeout(() => {
            console.log('Pushing 2');
            navigation.push('Push');
          }, 2000);
          setTimeout(() => {
            console.log('Pushing 3');
            navigation.push('Push');
          }, 3000);
          setTimeout(() => {
            console.log('Pushing 4');
            navigation.push('Push');
          }, 4000);
        }}
        title="Click this button to see the crash if native changes not applied"
      />
      <Button
        testID="main-button-push-modal"
        onPress={() => {
          navigation.push('Modal');
        }}
        title="Push modal"
      />
      <Text testID="main-text">Issue 791</Text>
    </View>
  );
};

const PushScreen = ({
  navigation,
  route,
}: NativeStackScreenProps<ParamListBase>) => (
  <View style={styles.screen}>
    <Button
      testID="push-button-push-multiple"
        onPress={() => {
          navigation.push('Push');
          setTimeout(() => {
            console.log('Pushing 1');
            navigation.push('Push');
          }, 1000);
          setTimeout(() => {
            console.log('Pushing 2');
            navigation.push('Push');
          }, 2000);
          setTimeout(() => {
            console.log('Pushing 3');
            navigation.push('Push');
          }, 3000);
          setTimeout(() => {
            console.log('Pushing 4');
            navigation.push('Push');
          }, 4000);
        }}
      title="Click this button to see the crash if native changes not applied"
    />
    <Button
      onPress={() => {
        navigation.pop();
        setTimeout(() => navigation.pop(), 10);
        setTimeout(() => navigation.pop(), 20);
      }}
      title="Click this button to pop"
    />
    <Button onPress={() => navigation.push('Push')} title="Push single" />
    <Text testID="push-text">Push screen</Text>
    <Text>{route.key}</Text>
  </View>
);

const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen name="Main" component={MainScreen} options={{ freezeOnBlur: false }} />
      <Stack.Screen
        name="Push"
        component={PushScreen}
        // options={{ presentation: 'card' }}
        options={{ presentation: 'modal' }}
      />
      <Stack.Screen
        name="Modal"
        component={PushScreen}
        options={{ presentation: 'modal', freezeOnBlur: false }}
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
