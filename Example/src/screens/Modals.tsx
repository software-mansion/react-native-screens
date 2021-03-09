import React from 'react';
import {
  View,
  StyleSheet,
  Dimensions,
  Text,
  TouchableOpacity,
} from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import {Button} from '../shared';

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

interface AlertScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Alert'>;
}

const AlertScreen = ({navigation}: AlertScreenProps): JSX.Element => {
  const backgrounds = [
    'darkviolet',
    'slateblue',
    'mediumseagreen',
    'orange',
    'indianred',
  ];
  const bgColor = backgrounds[Math.floor(Math.random() * backgrounds.length)];

  return (
    <TouchableOpacity
      onPress={() => navigation.goBack()}
      style={{...styles.alert, backgroundColor: bgColor}}>
      <Text style={styles.text}>Oh, hi! 👋</Text>
      <Text style={styles.text}>Tap me</Text>
    </TouchableOpacity>
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      statusBarStyle: 'dark',
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
      component={AlertScreen}
      options={{
        stackPresentation: 'transparentModal',
        headerShown: false,
      }}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
  alert: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 120,
    width: Dimensions.get('screen').width - 40,
    borderRadius: 20,
    position: 'absolute',
    bottom: 20,
    left: 20,
  },
  text: {
    fontWeight: 'bold',
    fontSize: 16,
    color: 'white',
  },
});

export default App;
