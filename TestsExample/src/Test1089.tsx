import * as React from 'react';
import {
  Button,
  View,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

import Animated, {
  withTiming,
} from 'react-native-reanimated';

const Stack = createNativeStackNavigator();

const sharedElements = [
  { fromID: 'mleko', toID: 'mlekoDest' },
];

type SimpleStackParams = {
  First: undefined;
  Second: undefined;
};

const transition = (values: any) => {
  'worklet';
  return {
    initialValues: {
      height: values.currentHeight,
      originY: values.currentOriginY,
    },
    animations: {
      height: withTiming(values.targetHeight),
      originY: withTiming(values.targetOriginY),
    },
  }
}

// const transition2 = (values: any) => {
//   'worklet';
//   return {
//     height: withTiming(values.targetHeight),
//     originY: withTiming(values.targetOriginY),
//   }
// }

// console.log(transition2({}))

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<SimpleStackParams, 'First'>;
}) {

  return (
    <Animated.ScrollView style={{ flex: 1 }}>
      <Animated.View
        style={{ width: '100%', height: 100, backgroundColor: 'green' }}
        nativeID="mleko"
        sharedElementTransition={transition}
      />
      <Button onPress={() => navigation.navigate('Second')} title="Click" />
    </Animated.ScrollView>
  );
}

function Second({
  navigation,
}: {
  navigation: NativeStackNavigationProp<SimpleStackParams, 'Second'>;
}) {

  return (
    <View style={{ flex: 1 }}>
      <Animated.View
        style={{ width: '100%', height: 200, backgroundColor: 'green' }}
        nativeID="mlekoDest"
        sharedElementTransition={transition}
      />
      <Button
        title="Tap me for first screen"
        onPress={() => navigation.navigate('First')}
      />
    </View>
  );
}

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          stackAnimation: 'fade',
        }}>
        <Stack.Screen
          name="First"
          component={First}
          options={{ sharedElements, headerShown: false }}
        />
        <Stack.Screen
          name="Second"
          component={Second}
          options={{ headerShown: true, sharedElements }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}