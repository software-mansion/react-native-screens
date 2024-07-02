import React from 'react';
import { View, Modal, Button, TouchableWithoutFeedback } from 'react-native';
import { useState } from 'react';

import { NavigationContainer, useNavigation } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

type AppStackPages = {
  Home: undefined;
  Modal: undefined;
};

function HomeScreen() {
  const navigation = useNavigation();
  const [visible, setVisible] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button
        title="Toggle bottom modal"
        onPress={() => setVisible(prev => !prev)}
      />
      <Modal animationType="slide" visible={visible} transparent>
        <TouchableWithoutFeedback onPress={() => setVisible(false)}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
        <View
          style={{
            borderTopLeftRadius: 10,
            borderTopRightRadius: 10,
            borderWidth: 2,
            borderColor: 'red',
            padding: 10,
            minHeight: '40%',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
          <Button
            title="Open navigation modal"
            onPress={() => {
              // Issue: autohiding the Modal that serves as a bottom sheet unmounts
              // the anchor component for the screen that is in { presentation: "modal" } mode
              // Previously the anchoring component for a { presentation: "modal" }-based screen was different and it worked
              // The culprit is: https://github.com/software-mansion/react-native-screens/pull/1912 released in https://github.com/software-mansion/react-native-screens/releases/tag/3.29.0
              // adding setTimeout does not bring any good, because
              // - we either don't see navigation action
              // - we unmount both the bottom sheet modal and the screen itself

              setVisible(false);

              navigation.navigate('Modal');
            }}
          />
        </View>
      </Modal>
    </View>
  );
}

function ModalScreen() {
  return <View style={{ flex: 1, backgroundColor: 'rgb(50,150,50)' }} />;
}

const AppStack = createNativeStackNavigator<AppStackPages>();

function Navigation() {
  return (
    <AppStack.Navigator>
      <AppStack.Screen name="Home" component={HomeScreen} />
      <AppStack.Screen
        name="Modal"
        component={ModalScreen}
        options={{ presentation: 'modal' }}
      />
    </AppStack.Navigator>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Navigation />
    </NavigationContainer>
  );
}
