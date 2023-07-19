/* eslint-disable react/no-unstable-nested-components */
/* eslint-disable react-native/no-inline-styles */
import * as React from 'react';
import { Button, View, TouchableOpacity } from 'react-native';
import { NavigationContainer, ParamListBase } from '@react-navigation/native';
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
    <View style={{ flex: 1, backgroundColor: 'red' }}>
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
    <View style={{ flex: 1, backgroundColor: 'yellow' }}>
      <Button
        title="Tap me for first screen"
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

const Stack = createNativeStackNavigator();

function ButtonWithBiggerChild(props: {
  tintColor?: string | undefined;
  onClickText?: string | undefined;
  backgroundColor?: string | undefined;
}): JSX.Element {
  const {
    onClickText = 'Hello there General Kenobi',
    backgroundColor = 'red',
  } = props;
  return (
    <TouchableOpacity
      style={{ width: 30, height: 30, backgroundColor: 'red' }}
      onPress={() => console.log(onClickText)}>
      <View
        style={{
          width: 30,
          height: 30,
          backgroundColor: backgroundColor,
          marginLeft: -15,
        }}
      />
    </TouchableOpacity>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ stackPresentation: 'modal' }}>
        <Stack.Screen
          name="First"
          component={First}
          options={{
            backButtonInCustomView: true,
            headerShown: true,
            headerLeft: () => (
              <ButtonWithBiggerChild
                onClickText={'Hello'}
                backgroundColor={'yellow'}
              />
            ),
            headerRight: () => (
              <TouchableOpacity
                onPress={() => console.log('there')}
                style={{
                  width: 30,
                  height: 30,
                  backgroundColor: 'red',
                  marginRight: -15,
                }}
              />
            ),
          }}
        />
        <Stack.Screen
          name="Second"
          component={Second}
          options={{
            headerLeft: () => (
              <TouchableOpacity
                onPress={() => console.log('General Kenobi')}
                style={{
                  width: 50,
                  height: 50,
                  backgroundColor: 'red',
                  marginLeft: -15,
                }}
              />
            ),
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
