/* eslint-disable react/display-name */
/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import {Button, View, TouchableOpacity} from 'react-native';
import {NavigationContainer, ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={{flex: 1, backgroundColor: 'red'}}>
      <Button
        title="Tap me for second screen"
        onPress={() => navigation.navigate('Second')}
      />
    </View>
  );
}

function Second({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ParamListBase>;
}) {
  return (
    <View style={{flex: 1, backgroundColor: 'yellow'}}>
      <Button
        title="Tap me for first screen"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

console.log("Test1157 module")

const Stack = createNativeStackNavigator();

const ButtonWithBiggerChild = () => (
  <TouchableOpacity
    style={{width: 30, height: 30, backgroundColor: 'red'}}
    onPress={() => console.log('hello')}>
    <View
      style={{
        width: 30,
        height: 30,
        backgroundColor: 'yellow',
        marginLeft: -15,
      }}
    />
  </TouchableOpacity>
);

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{
        stackPresentation: 'modal',
        backButtonImage: require("../assets/backButton.png"),
        // headerBackTitleVisible: false
        }}>
        <Stack.Screen
          name="First"
          component={First}
          options={{
            // headerShown: true,
            // headerLeft: () => <TouchableOpacity onPress={() => console.log("hello")} style={{width: 30, height: 30, backgroundColor: 'red', marginLeft: -15}}/>,
            // backButtonImage: require('../assets/backButton.png'),
            // headerLeft: () => <ButtonWithBiggerChild />,
            headerRight: () => (
              <TouchableOpacity
                onPress={() => console.log('there')}
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: 'red',
                  marginRight: -15,
                }}
              />)
            }}
        />
        <Stack.Screen
          name="Second"
          component={Second}
          options={{
            headerLeft: () => <TouchableOpacity onPress={() => console.log("hello")} style={{width: 50, height: 50, backgroundColor: 'red', marginLeft: -15}}/>
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
