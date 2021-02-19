/* eslint-disable react/display-name */
import * as React from 'react';
import {Button, StyleSheet, View} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          stackPresentation: 'modal',
          headerRight: () => <View style={styles.headerView} />,
          headerTitleStyle: {
            color: 'cyan',
          },
          headerShown: true,
        }}>
        <Stack.Screen name="First" component={First} />
        <Stack.Screen name="Second" component={Second} options={{stackPresentation: 'push'}}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
}

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <Button
      title="Tap me for second screen"
      onPress={() => navigation.navigate('Second')}
    />
  );
}

function Second({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <Button
      title="Tap me for second screen"
      onPress={() => navigation.navigate('First')}
    />
  );
}

const styles = StyleSheet.create({
  headerView: {
    height: 20,
    width: 20,
    backgroundColor: 'red',
  },
});
