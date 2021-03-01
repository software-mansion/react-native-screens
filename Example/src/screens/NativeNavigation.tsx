import React from 'react';
import {TextInput, StyleSheet, View, ScrollView} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import {Button} from '../shared';

enableScreens();

type StackParamList = {
  Some: undefined;
  Push: undefined;
  Modal: undefined;
};

interface SomeScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Some'>;
}

const SomeScreen = ({navigation}: SomeScreenProps): JSX.Element => (
  <ScrollView style={styles.screen}>
    <Button onPress={() => navigation.push('Push')} title="Push" />
    <Button onPress={() => navigation.navigate('Modal')} title="Modal" />
    <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
    <View style={styles.leftTop} />
    <View style={styles.bottomRight} />
  </ScrollView>
);

interface PushScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Push'>;
}

const PushScreen = ({navigation}: PushScreenProps): JSX.Element => (
  <View style={styles.screen}>
    <TextInput placeholder="Hello" style={styles.textInput} />
    <Button onPress={() => navigation.goBack()} title="Go back" />
    <Button onPress={() => navigation.push('Push')} title="Push more" />
    <View style={styles.leftTop} />
    <View style={styles.bottomRight} />
  </View>
);

interface ModalScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Modal'>;
}

const ModalScreen = ({navigation}: ModalScreenProps): JSX.Element => (
  <View style={styles.screen}>
    <TextInput placeholder="Hello" style={styles.textInput} />
    <Button onPress={() => navigation.goBack()} title="Go back" />
    <Button onPress={() => navigation.push('Modal')} title="Open modal" />
    <View style={styles.leftTop} />
    <View style={styles.bottomRight} />
  </View>
);

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): JSX.Element => (
  <Stack.Navigator screenOptions={{statusBarAnimation: 'fade'}}>
    <Stack.Screen
      name="Some"
      component={SomeScreen}
      options={{
        title: 'Start',
        headerTintColor: 'black',
        statusBarStyle: 'auto',
        screenOrientation: 'portrait',
      }}
    />
    <Stack.Screen
      name="Push"
      component={PushScreen}
      options={{
        title: 'Pushed',
        headerStyle: {backgroundColor: '#3da4ab'},
        headerTintColor: 'black',
        statusBarHidden: true,
      }}
    />
    <Stack.Screen
      name="Modal"
      component={ModalScreen}
      options={{
        stackPresentation: 'modal',
        statusBarStyle: 'light',
        screenOrientation: 'portrait_up',
      }}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  screen: {
    ...StyleSheet.absoluteFillObject,
    paddingTop: 200,
    flex: 1,
    backgroundColor: 'white',
  },
  leftTop: {
    position: 'absolute',
    width: 80,
    height: 80,
    left: 0,
    top: 0,
    backgroundColor: 'red',
  },
  bottomRight: {
    position: 'absolute',
    width: 80,
    height: 80,
    right: 0,
    bottom: 0,
    backgroundColor: 'blue',
  },
  modal: {
    position: 'absolute',
    left: 50,
    top: 50,
    right: 50,
    bottom: 50,
    backgroundColor: 'red',
  },
  textInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    padding: 10,
    marginHorizontal: 20,
    alignSelf: 'stretch',
    borderColor: 'black',
  },
});

export default App;
