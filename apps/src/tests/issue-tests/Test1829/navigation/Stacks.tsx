import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigatorScreenParams, useNavigation } from '@react-navigation/native';

import HomeView from '../screens/HomeView';
import ModalView from '../screens/ModalView';
import BaseView from '../screens/InnerView';
import InnerModal from '../screens/InnerModal';

type InnerStackParamList = {
  base: undefined;
  'inner-modal': undefined;
};

export const InnerStack = createNativeStackNavigator<InnerStackParamList>();

type RootStackParamList = {
  home: undefined;
  inner: NavigatorScreenParams<typeof InnerStack> | undefined;
  modal: undefined;
  'modal-2': undefined;
};

export const RootStack = createNativeStackNavigator<RootStackParamList>();

const Inner = () => (
  <InnerStack.Navigator>
    <InnerStack.Screen name="base" component={BaseView} />
    <InnerStack.Screen
      name="inner-modal"
      component={InnerModal}
      options={{ presentation: 'modal' }}
    />
  </InnerStack.Navigator>
);

const ModalScreen = () => {
  const navigation = useNavigation<typeof RootStack, 'modal'>('modal');

  return (
    <ModalView
      onBack={() => navigation.goBack()}
      onOpenSiblingModal={() => navigation.navigate('modal-2')}
    />
  );
};

const Modal2Screen = () => {
  const navigation = useNavigation<typeof RootStack, 'modal-2'>('modal-2');

  return (
    <ModalView
      onBack={() => navigation.goBack()}
      onOpenSiblingModal={() => navigation.navigate('modal-2')}
    />
  );
};

const Stacks = () => (
  <RootStack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <RootStack.Screen name="home" component={HomeView} />
    <RootStack.Screen name="inner" component={Inner} />
    <RootStack.Screen
      name="modal"
      component={ModalScreen}
      options={{
        presentation: 'modal',
      }}
    />
    <RootStack.Screen
      name="modal-2"
      component={Modal2Screen}
      options={{
        presentation: 'modal',
      }}
    />
  </RootStack.Navigator>
);

export default Stacks;
