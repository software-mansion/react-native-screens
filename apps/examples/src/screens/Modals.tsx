import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Button, Alert } from '../shared';

type StackParamList = {
  Main: undefined;
  Modal: undefined;
  FullscreenModal: undefined;
  Alert: undefined;
  ContainedModal: undefined;
};

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
}

const MainScreen = ({ navigation }: MainScreenProps): React.JSX.Element => (
  <View style={{ ...styles.container, backgroundColor: 'bisque' }}>
    <Button title="Open modal" onPress={() => navigation.navigate('Modal')} />
    <Button
      title="Open fullscreen modal"
      onPress={() => navigation.navigate('FullscreenModal')}
    />
    <Button title="Open alert" onPress={() => navigation.navigate('Alert')} />
    <Button
      title="Open contained modal"
      onPress={() => navigation.navigate('ContainedModal')}
    />
    <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
  </View>
);

interface ModalScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Modal'>;
}

const ModalScreen = ({ navigation }: ModalScreenProps): React.JSX.Element => (
  <View style={{ ...styles.container, backgroundColor: 'thistle' }}>
    <Button title="Open modal" onPress={() => navigation.push('Modal')} />
    <Button
      title="Open fullscreen modal"
      onPress={() => navigation.push('FullscreenModal')}
    />
    <Button title="Open alert" onPress={() => navigation.navigate('Alert')} />
    <Button
      title="Open contained modal"
      onPress={() => navigation.navigate('ContainedModal')}
    />
    <Button title="Go back" onPress={() => navigation.goBack()} />
  </View>
);

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): React.JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      headerBackVisible: false,
    }}>
    <Stack.Screen
      name="Main"
      component={MainScreen}
      options={{ title: 'Modals' }}
    />
    <Stack.Screen
      name="Modal"
      component={ModalScreen}
      options={{ presentation: 'modal' }}
    />
    <Stack.Screen
      name="FullscreenModal"
      component={ModalScreen}
      options={{ presentation: 'fullScreenModal' }}
    />
    <Stack.Screen
      name="ContainedModal"
      component={ModalScreen}
      options={{ presentation: 'containedModal' }}
    />
    <Stack.Screen
      name="Alert"
      component={Alert}
      options={{
        presentation: 'transparentModal',
        headerShown: false,
        animation: 'slide_from_bottom',
      }}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
});

export default App;
