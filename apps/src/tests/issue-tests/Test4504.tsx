import React, { useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/4504
// (repro by @t0maboro: https://github.com/software-mansion/react-native-screens/issues/4504#issuecomment-5319230761)
//
// Android only. Go to NestedHost and toggle the nested stack several times.
// Without the fix, every unmount leaves an orphaned `ScreenStackFragment` in
// NestedHost's child FragmentManager; their count keeps growing until the whole
// FragmentManager is dropped. Inspect it with
// `adb shell dumpsys activity top` (look at the `Child FragmentManager` of the
// NestedHost fragment). With the fix, the count must not grow.

type OuterStackParamList = {
  Home: undefined;
  NestedHost: undefined;
  Cover: undefined;
};

type InnerStackParamList = {
  InnerHome: undefined;
  InnerSecond: undefined;
};

const Outer = createNativeStackNavigator<OuterStackParamList>();
const Inner = createNativeStackNavigator<InnerStackParamList>();

function InnerHomeScreen({
  navigation,
}: NativeStackScreenProps<InnerStackParamList, 'InnerHome'>) {
  return (
    <View style={styles.innerContainer}>
      <Text>Inner stack home</Text>
      <Button
        title="Push inner second"
        onPress={() => navigation.navigate('InnerSecond')}
      />
    </View>
  );
}

function InnerSecondScreen() {
  return (
    <View style={styles.innerContainer}>
      <Text>Inner stack second</Text>
    </View>
  );
}

function HomeScreen({
  navigation,
}: NativeStackScreenProps<OuterStackParamList, 'Home'>) {
  return (
    <View style={styles.container}>
      <Button
        title="Go to NestedHost"
        onPress={() => navigation.navigate('NestedHost')}
      />
    </View>
  );
}

function NestedHostScreen({
  navigation,
}: NativeStackScreenProps<OuterStackParamList, 'NestedHost'>) {
  const [showNested, setShowNested] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.instructions}>
        Toggle the nested stack several times. Number of ScreenStackFragments in
        this screen's child FragmentManager must not grow.
      </Text>
      <Button
        title={showNested ? 'Unmount nested stack' : 'Mount nested stack'}
        onPress={() => setShowNested(value => !value)}
      />
      <Button title="Push cover" onPress={() => navigation.navigate('Cover')} />
      {showNested ? (
        <View style={styles.nestedBox}>
          <Inner.Navigator>
            <Inner.Screen name="InnerHome" component={InnerHomeScreen} />
            <Inner.Screen name="InnerSecond" component={InnerSecondScreen} />
          </Inner.Navigator>
        </View>
      ) : (
        <Text>Nested stack is unmounted</Text>
      )}
    </View>
  );
}

function CoverScreen({
  navigation,
}: NativeStackScreenProps<OuterStackParamList, 'Cover'>) {
  return (
    <View style={styles.container}>
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Outer.Navigator>
        <Outer.Screen name="Home" component={HomeScreen} />
        <Outer.Screen name="NestedHost" component={NestedHostScreen} />
        <Outer.Screen name="Cover" component={CoverScreen} />
      </Outer.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 16,
  },
  instructions: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  nestedBox: {
    flex: 1,
    margin: 16,
    borderWidth: 1,
    borderColor: 'gray',
  },
  innerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
