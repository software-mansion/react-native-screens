import React from 'react';
import { View, Button } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { STYLES } from './styles';

type StackParamList = {
  Main: undefined;
  Modal: undefined;
  FullscreenModal: undefined;
  Alert: undefined;
};

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
}

const MainScreen = ({ navigation }: MainScreenProps): JSX.Element => (
  <View style={[STYLES.screenContainer, { backgroundColor: '#fff' }]}>
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

const ModalScreen = ({ navigation }: ModalScreenProps): JSX.Element => (
  <View style={[STYLES.screenContainer, { backgroundColor: '#000' }]}>
    <Button title="Open modal" onPress={() => navigation.push('Modal')} />
    <Button
      title="Open fullscreen modal"
      onPress={() => navigation.push('FullscreenModal')}
    />
    <Button title="Go back" onPress={() => navigation.goBack()} />
  </View>
);

const Stack = createNativeStackNavigator<StackParamList>();

const ModalsExample = (): JSX.Element => (
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
  </Stack.Navigator>
);

export default ModalsExample;
