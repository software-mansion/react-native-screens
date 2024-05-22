import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import HomeView from '../screens/HomeView';
import ModalView from '../screens/ModalView';
import BaseView from '../screens/InnerView';
import InnerModal from '../screens/InnerModal';

const RootStack = createNativeStackNavigator();
const InnerStack = createNativeStackNavigator();

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

const Stacks = () => (
  <RootStack.Navigator
    screenOptions={{
      headerShown: false,
    }}>
    <RootStack.Screen name="home" component={HomeView} />
    <RootStack.Screen name="inner" component={Inner} />
    <RootStack.Screen
      name="modal"
      component={ModalView}
      options={{
        presentation: 'modal',
      }}
    />
    <RootStack.Screen
      name="modal-2"
      component={ModalView}
      options={{
        presentation: 'modal',
      }}
    />
  </RootStack.Navigator>
);

export default Stacks;
