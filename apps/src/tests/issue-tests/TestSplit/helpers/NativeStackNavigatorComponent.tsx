import React from 'react';
import { createNativeStackNavigator, NativeStackNavigationProp, type NativeStackNavigationOptions } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import PressableWithFeedback from '../../../../shared/PressableWithFeedback';
import Colors from '../../../../shared/styling/Colors';

type StackParamList = {
  ScreenOne: undefined;
  ScreenTwo: undefined;
  ScreenThree: undefined;
};

export type ScreenOneProps = {navigation: NativeStackNavigationProp<StackParamList, 'ScreenOne'>}
export type ScreenTwoProps = {navigation: NativeStackNavigationProp<StackParamList, 'ScreenTwo'>}
export type ScreenThreeProps = {navigation: NativeStackNavigationProp<StackParamList, 'ScreenThree'>}

const Stack = createNativeStackNavigator<StackParamList>();

const ScreenOne = ({navigation}: ScreenOneProps) => (
  <View style={styles.container}>
    <Text style={styles.text}>ScreenOne</Text>
    <PressableWithFeedback style={styles.pressable} onPress={() => navigation.navigate('ScreenTwo')}>
      <Text style={styles.text}>Go to ScreenTwo</Text>
    </PressableWithFeedback>
  </View>
)

const ScreenTwo = ({navigation}: ScreenTwoProps) => (
  <View style={styles.container}>
    <Text style={styles.text}>ScreenTwo</Text>
    <PressableWithFeedback style={styles.pressable} onPress={() => navigation.navigate('ScreenThree')}>
      <Text style={styles.text}>Go to ScreenThree</Text>
    </PressableWithFeedback>
    <PressableWithFeedback style={styles.pressable} onPress={() => navigation.goBack()}>
      <Text style={styles.text}>Go back</Text>
    </PressableWithFeedback>
  </View>
)

const ScreenThree = ({navigation}: ScreenThreeProps) => (
  <View style={styles.container}>
    <Text style={styles.text}>ScreenThree</Text>
    <PressableWithFeedback style={styles.pressable} onPress={() => navigation.goBack()}>
      <Text style={styles.text}>Go back</Text>
    </PressableWithFeedback>
  </View>
)

export interface NativeStackNavigatorComponentProps {
  CustomScreenOne?: ({navigation}: ScreenOneProps) => JSX.Element;
  CustomScreenTwo?: ({navigation}: ScreenTwoProps) => JSX.Element;
  CustomScreenThree?: ({navigation}: ScreenThreeProps) => JSX.Element;

  customScreenOneName?: string;
  customScreenTwoName?: string;
  customScreenThreeName?: string;

  customScreenOneNavigationOptions?: NativeStackNavigationOptions;
  customScreenTwoNavigationOptions?: NativeStackNavigationOptions;
  customScreenThreeNavigationOptions?: NativeStackNavigationOptions;
}

export const NativeStackNavigatorComponent = ({
  CustomScreenOne,
  CustomScreenTwo,
  CustomScreenThree,
  customScreenOneName,
  customScreenTwoName,
  customScreenThreeName,
  customScreenOneNavigationOptions,
  customScreenTwoNavigationOptions,
  customScreenThreeNavigationOptions
}: NativeStackNavigatorComponentProps) => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen options={customScreenOneNavigationOptions} name={customScreenOneName || 'ScreenOne'} component={CustomScreenOne ? CustomScreenOne : ScreenOne} />
      <Stack.Screen options={customScreenTwoNavigationOptions} name={customScreenTwoName || 'ScreenTwo'} component={CustomScreenTwo ? CustomScreenTwo : ScreenTwo} />
      <Stack.Screen options={customScreenThreeNavigationOptions} name={customScreenThreeName || 'ScreenThree'} component={CustomScreenThree ? CustomScreenThree : ScreenThree} />
    </Stack.Navigator>
  </NavigationContainer>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  },
  text: {
    fontSize: 24
  },
  pressable: {
    backgroundColor: Colors.White,
    borderWidth: 1,
    borderColor: Colors.BlueDark140
  }
})

