import React from 'react';
import { Button, Text, View, StyleSheet, ScrollView } from 'react-native';
import { NavigationContainer as NavigationContainerNative } from '@react-navigation/native';

// remember to change prop names in ScreenGroup && ModalGroup
// import { createNativeStackNavigator, NativeStackNavigationOptions } from '@react-navigation/native-stack';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
} from 'react-native-screens/native-stack';

const NativeStack = createNativeStackNavigator();

function ScreenA({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'blue',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text style={{ color: 'white' }}>
        ScreenA, with backgroundColor: 'blue'
      </Text>
      <Button
        title={'navigate to: Screen B'}
        onPress={() => navigation.navigate('screenB')}
      />
    </View>
  );
}

function ScreenB({ navigation }) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'cyan',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <Text>ScreenB, with backgroundColor: 'cyan'</Text>
      <Button
        title={'navigate to: Modal A'}
        onPress={() => navigation.navigate('modalA')}
      />
    </View>
  );
}

type Props = {};

function ModalA(props: Props) {
  return (
    <View
      style={{
        flex: 1,
        backgroundColor: 'rgba(255,0,0,0.6)',
        alignItems: 'center',
        justifyContent: 'center',
      }}>
      <View style={{ backgroundColor: 'white' }}>
        <Text>ModalA, with opacity and backgroundColor</Text>
        <Text>
          At ModalA, we still can gesture swipe the screenB back to screenA,{' '}
        </Text>
        <Button title={'pop modal'} onPress={() => props.navigation.pop()} />
      </View>
    </View>
  );
}

const StackBuilder = (
  configs: any,
  groupOptions?: NativeStackNavigationOptions,
) => {
  return () => (
    <NativeStack.Group screenOptions={groupOptions}>
      {configs.map(config => {
        const { options, ...anyConfig } = config;
        const {
          statusBarStyle,
          statusBarAnimation,
          statusBarHidden,
          ...anyOption
        } = options || {};
        return (
          <NativeStack.Screen
            key={config.name}
            {...anyConfig}
            options={anyOption}
          />
        );
      })}
    </NativeStack.Group>
  );
};

const ScreenGroup = StackBuilder(
  [
    {
      name: 'screenA',
      component: ScreenA,
    },
    {
      name: 'screenB',
      component: ScreenB,
    },
  ],
  {
    // headerShadowVisible: false,
    headerTintColor: 'black',
    headerBackTitleVisible: false,
    gestureEnabled: true,
    contentStyle: { backgroundColor: 'white' },

    // prop for @react-navigation/native-stack
    // fullScreenGestureEnabled: true,

    // prop for react-native-screens/native-stack
    fullScreenSwipeEnabled: true,
  },
);

const ModalGroup = StackBuilder(
  [
    {
      name: 'modalA',
      component: ModalA,
      // options: { stackAnimation: 'fade' },
    },
  ],
  {
    headerShown: false,

    // props for @react-navigation/native-stack
    // animation: 'fade_from_bottom',
    // presentation: 'containedTransparentModal',

    // props for react-native-screens/native-stack
    stackAnimation: 'fade_from_bottom',
    stackPresentation: 'containedTransparentModal',
    fullScreenSwipeEnabled: true,
    customAnimationOnSwipe: true,
  },
);

export default function TestModalPresentation() {
  return (
    <NavigationContainerNative>
      <NativeStack.Navigator>
        {ScreenGroup()}
        {ModalGroup()}
      </NativeStack.Navigator>
    </NavigationContainerNative>
  );
}

const styles = StyleSheet.create({
  container: {},
});
