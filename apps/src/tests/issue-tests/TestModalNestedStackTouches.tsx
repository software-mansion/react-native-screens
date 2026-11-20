import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Button, Modal, Pressable, Text, View } from 'react-native';
import { Colors } from '@apps/shared/styling';

// A native stack rendered inside React Native's `Modal`.
//
// Inside a `Modal` the surface touch handler sits on a plain UIView, not on an
// RCTRootComponentView, so every screen in the stack used to attach a second
// RCTSurfaceTouchHandler of its own. Each touch then arrived twice and the
// duplicate cancelled presses on the stack's screens: "Push" did nothing.
//
// Open the modal, tap "Push", then tap the counter: it must go up by one per tap.

type ModalStackParamList = {
  First: undefined;
  Pushed: undefined;
};

const ModalStack = createNativeStackNavigator<ModalStackParamList>();

function First({
  navigation,
}: {
  navigation: NativeStackNavigationProp<ModalStackParamList>;
}) {
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.White,
      }}>
      <Button
        title="Push"
        onPress={() => navigation.push('Pushed')}
        testID="modal-stack-push"
      />
    </View>
  );
}

function Pushed() {
  const [count, setCount] = useState(0);
  return (
    <View
      style={{
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.White,
      }}>
      <Pressable
        onPress={() => setCount(current => current + 1)}
        testID="modal-stack-counter"
        style={{ padding: 24, backgroundColor: Colors.BlueLight100 }}>
        <Text>Pressed {count} times</Text>
      </Pressable>
    </View>
  );
}

export default function App() {
  const [visible, setVisible] = useState(false);
  return (
    <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
      <Button
        title="Open Modal"
        onPress={() => setVisible(true)}
        testID="open-modal"
      />
      <Modal
        visible={visible}
        animationType="slide"
        presentationStyle="fullScreen"
        onRequestClose={() => setVisible(false)}>
        <NavigationContainer>
          <ModalStack.Navigator>
            <ModalStack.Screen
              name="First"
              component={First}
              options={{
                headerRight: () => (
                  <Button title="Close" onPress={() => setVisible(false)} />
                ),
              }}
            />
            <ModalStack.Screen name="Pushed" component={Pushed} />
          </ModalStack.Navigator>
        </NavigationContainer>
      </Modal>
    </View>
  );
}
