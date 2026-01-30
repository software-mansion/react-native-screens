import * as React from 'react';
import { Button, Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';

type StackParamList = {
  ScreenOne: undefined;
  ScreenTwo: undefined;
  ScreenThree: undefined;
};

function ScreenOne({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList, 'ScreenOne'>;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ScreenOne</Text>
      <Button
        title="Go to ScreenTwo (push)"
        onPress={() => navigation.push('ScreenTwo')}
      />
    </View>
  );
}

function ScreenTwo({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList, 'ScreenTwo'>;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ScreenTwo</Text>
      <Button
        title="Push another ScreenTwo"
        onPress={() => navigation.push('ScreenTwo')}
      />
      <Button
        title="Push ScreenThree"
        onPress={() => navigation.push('ScreenThree')}
      />
    </View>
  );
}

function ScreenThree({
  navigation,
}: {
  navigation: NativeStackNavigationProp<StackParamList, 'ScreenThree'>;
}) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>ScreenThree</Text>
      <Button
        title="Push ScreenTwo"
        onPress={() => navigation.push('ScreenTwo')}
      />
      <Button
        title="Push another ScreenThree"
        onPress={() => navigation.push('ScreenThree')}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator<StackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          fullScreenGestureEnabled: true,
        }}>
        <Stack.Screen name="ScreenOne" component={ScreenOne} />
        <Stack.Screen name="ScreenTwo" component={ScreenTwo} />
        <Stack.Screen name="ScreenThree" component={ScreenThree} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 20,
  },
});
