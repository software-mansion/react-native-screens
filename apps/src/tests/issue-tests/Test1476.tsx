import React from 'react';
import { Button, Text, View } from 'react-native';
import { NavigationContainer as NavigationContainerNative } from '@react-navigation/native';

import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

type StackParamList = {
  screenA: undefined;
  screenB: undefined;
  modalA: undefined;
};

type ScreenProps<T extends keyof StackParamList> = NativeStackScreenProps<
  StackParamList,
  T
>;

const NativeStack = createNativeStackNavigator<StackParamList>();

function ScreenA({ navigation }: ScreenProps<'screenA'>) {
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

function ScreenB({ navigation }: ScreenProps<'screenB'>) {
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

function ModalA({ navigation }: ScreenProps<'modalA'>) {
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
        <Button title={'pop modal'} onPress={() => navigation.pop()} />
      </View>
    </View>
  );
}

export default function TestModalPresentation() {
  return (
    <NavigationContainerNative>
      <NativeStack.Navigator>
        <NativeStack.Group
          screenOptions={{
            // headerShadowVisible: false,
            headerTintColor: 'black',
            headerBackButtonDisplayMode: 'minimal',
            gestureEnabled: true,
            contentStyle: { backgroundColor: 'white' },
            fullScreenGestureEnabled: true,
          }}>
          <NativeStack.Screen name="screenA" component={ScreenA} />
          <NativeStack.Screen name="screenB" component={ScreenB} />
        </NativeStack.Group>
        <NativeStack.Group
          screenOptions={{
            headerShown: false,
            animation: 'fade_from_bottom',
            presentation: 'containedTransparentModal',
            fullScreenGestureEnabled: true,
            animationMatchesGesture: true,
          }}>
          {/* options: { stackAnimation: 'fade' }, */}
          <NativeStack.Screen name="modalA" component={ModalA} />
        </NativeStack.Group>
      </NativeStack.Navigator>
    </NavigationContainerNative>
  );
}
