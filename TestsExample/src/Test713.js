import { NavigationContainer, useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { Modal, Text, TouchableWithoutFeedback, View } from 'react-native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';

const App = () => {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
};
export default App;

const Home = () => {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Modal presentationStyle="pageSheet" animationType="slide" visible={open}>
        <PinnedModalStack />
      </Modal>
      <TouchableWithoutFeedback
        onPress={() => navigation.navigate('PinnedModal')}>
        <Text>Go to pinned modal</Text>
      </TouchableWithoutFeedback>
      <TouchableWithoutFeedback onPress={() => setOpen(true)}>
        <Text>open react native modal</Text>
      </TouchableWithoutFeedback>
    </View>
  );
};

const { Navigator: PinnedModalNavigator, Screen: PinnedModalScreen } =
  createNativeStackNavigator();

const PinnedModalStack = ({ navigation }) => {
  return (
    <PinnedModalNavigator>
      <PinnedModalScreen
        listeners={{
          transitionStart: () => console.log('START'),
          transitionEnd: () => console.log('END'),
          dismiss: () => console.log('DISMISS'),
        }}
        name="PinnedModalScreen"
        component={ScreenWithPinnedBottom}
        options={{
          headerLeft: () => {
            return (
              <TouchableWithoutFeedback onPress={() => navigation.goBack()}>
                <Text>close</Text>
              </TouchableWithoutFeedback>
            );
          },
        }}
      />
    </PinnedModalNavigator>
  );
};

const ScreenWithPinnedBottom = () => {
  const navigation = useNavigation();

  return (
    <View style={{ flex: 1, alignItems: 'center', top: 10 }}>
      <Text>Pull header upwards on iOS 13 device or higher</Text>
      <Text>
        observe wobble and frame getting bigger (text is not longer centered){' '}
      </Text>
      <TouchableWithoutFeedback onPress={() => navigation.push('PinnedModal')}>
        <Text>push another modal</Text>
      </TouchableWithoutFeedback>

      <View
        style={{
          position: 'absolute',
          height: 500,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: 'blue',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        <Text>Wobble</Text>
      </View>
    </View>
  );
};

const { Navigator: MainNavigator, Screen: MainScreen } =
  createNativeStackNavigator();

function MyStack() {
  return (
    <MainNavigator initialRouteName={'Home'}>
      <MainScreen name="Home" component={Home} />
      <MainScreen
        name="PinnedModal"
        component={PinnedModalStack}
        options={{ stackPresentation: 'modal' }}
      />
    </MainNavigator>
  );
}
