import React from 'react';
import { Split } from 'react-native-screens/experimental';
import { createNativeStackNavigator, NativeStackNavigationProp } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { StyleSheet, Text, View } from 'react-native';
import PressableWithFeedback from '../../../shared/PressableWithFeedback';
import Colors from '../../../shared/styling/Colors';
import { SplitViewBaseConfig } from '../helpers/types';

type StackOuterParamList = {
  OuterScreenOne: undefined;
  InnerStack: undefined;
  OuterScreenTwo: undefined;
};

type StackInnerParamList = {
  InnerScreenOne: undefined;
  InnerScreenTwo: undefined;
};

const StackOuter = createNativeStackNavigator<StackOuterParamList>();
const StackInner = createNativeStackNavigator<StackInnerParamList>();

const InnerScreenOne = ({ navigation }: { navigation: NativeStackNavigationProp<StackInnerParamList, 'InnerScreenOne'> }) => (
  <View style={styles.container}>
    <Text style={styles.text}>InnerScreenOne</Text>
    <PressableWithFeedback style={styles.pressable} onPress={() => navigation.navigate('InnerScreenTwo')}>
      <Text style={styles.text}>Go to InnerScreenTwo</Text>
    </PressableWithFeedback>
  </View>
)

const InnerScreenTwo = ({ navigation }: { navigation: NativeStackNavigationProp<StackInnerParamList, 'InnerScreenTwo'> }) => (
  <View style={styles.container}>
    <Text style={styles.text}>InnerScreenTwo</Text>
    <PressableWithFeedback style={styles.pressable} onPress={() => navigation.goBack()}>
      <Text style={styles.text}>Go back</Text>
    </PressableWithFeedback>
  </View>
)

const OuterScreenOne = ({ navigation }: { navigation: NativeStackNavigationProp<StackOuterParamList, 'OuterScreenOne'> }) => (
  <View style={styles.container}>
    <Text style={styles.text}>OuterScreenOne</Text>
    <PressableWithFeedback style={styles.pressable} onPress={() => navigation.navigate('InnerStack')}>
      <Text style={styles.text}>Go to InnerStack</Text>
    </PressableWithFeedback>
    <PressableWithFeedback style={styles.pressable} onPress={() => navigation.navigate('OuterScreenTwo')}>
      <Text style={styles.text}>Go to OuterScreenOne</Text>
    </PressableWithFeedback>
  </View>
)

const OuterScreenTwo = ({ navigation }: { navigation: NativeStackNavigationProp<StackOuterParamList, 'OuterScreenTwo'> }) => (
  <View style={styles.container}>
    <Text style={styles.text}>OuterScreenTwo</Text>
    <PressableWithFeedback style={styles.pressable} onPress={() => navigation.goBack()}>
      <Text style={styles.text}>Go back</Text>
    </PressableWithFeedback>
  </View>
)

const InnerStack = () => (
  <StackInner.Navigator>
    <StackInner.Screen name="InnerScreenOne" component={InnerScreenOne} />
    <StackInner.Screen name="InnerScreenTwo" component={InnerScreenTwo} />
  </StackInner.Navigator>
);

const OuterStack = () => (
  <NavigationContainer>
    <StackOuter.Navigator>
      <StackOuter.Screen name="OuterScreenOne" component={OuterScreenOne} />
      <StackOuter.Screen name="InnerStack" component={InnerStack} />
      <StackOuter.Screen name="OuterScreenTwo" component={OuterScreenTwo} />
    </StackOuter.Navigator>
  </NavigationContainer>
);

export const SplitViewWithNestedStack = ({ splitViewBaseConfig }: { splitViewBaseConfig: SplitViewBaseConfig }) => {
  return (
    <Split.Host {...splitViewBaseConfig}>
      <Split.Column>
        <OuterStack />
      </Split.Column>
      <Split.Column>
        <OuterStack />
      </Split.Column>
      <Split.Column>
        <OuterStack />
      </Split.Column>
    </Split.Host>
  );
}

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

