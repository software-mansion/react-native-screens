import React from 'react';
import {View, StyleSheet, I18nManager, Platform} from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import {Button, Alert} from '../shared';

type StackParamList = {
  Main: undefined;
  Modal: undefined;
  FullscreenModal: undefined;
  Alert: undefined;
};

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
}

const MainScreen = ({navigation}: MainScreenProps): JSX.Element => (
  <View style={{...styles.container, backgroundColor: 'bisque'}}>
    <Button title="Open modal" onPress={() => navigation.navigate('Modal')} />
    <Button
      title="Open fullscreen modal"
      onPress={() => navigation.navigate('FullscreenModal')}
    />
    <Button title="Open alert" onPress={() => navigation.navigate('Alert')} />
    <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
  </View>
);

interface ModalScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Modal'>;
}

const ModalScreen = ({navigation}: ModalScreenProps): JSX.Element => (
  <View style={{...styles.container, backgroundColor: 'thistle'}}>
    <Button title="Open modal" onPress={() => navigation.push('Modal')} />
    <Button
      title="Open fullscreen modal"
      onPress={() => navigation.push('FullscreenModal')}
    />
    <Button title="Open alert" onPress={() => navigation.navigate('Alert')} />
    <Button title="Go back" onPress={() => navigation.goBack()} />
  </View>
);

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      headerHideBackButton: true,
      direction: I18nManager.isRTL ? 'rtl' : 'ltr',
    }}>
    <Stack.Screen
      name="Main"
      component={MainScreen}
      options={{title: 'Modals'}}
    />
    <Stack.Screen
      name="Modal"
      component={ModalScreen}
      options={{stackPresentation: 'modal'}}
    />
    <Stack.Screen
      name="FullscreenModal"
      component={ModalScreen}
      options={{stackPresentation: 'fullScreenModal'}}
    />
    <Stack.Screen
      name="Alert"
      component={Alert}
      options={{
        stackPresentation: 'transparentModal',
        headerShown: false,
        stackAnimation:
          Platform.OS === 'android' ? 'slide_from_left' : 'default',
      }}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
});

export default App;
