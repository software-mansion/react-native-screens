import React from 'react';
import {ScrollView, StyleSheet, Button, SafeAreaView} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import {Spacer} from '../shared';

enableScreens();

const SCREENS = {
  push: 'push',
  modal: 'modal',
  transparentModal: 'transparentModal',
  containedModal: 'containedModal',
  containedTransparentModal: 'containedTransparentModal',
  fullScreenModal: 'fullScreenModal',
  formSheet: 'formSheet',
};

type StackParamList = {
  Main: undefined;
} & {
  [P in keyof typeof SCREENS]: undefined;
};

interface MainScreenProps {
  navigation: NativeStackNavigationProp<ParamListBase>;
}

const MainScreen = ({navigation}: MainScreenProps): JSX.Element => {
  return (
    <ScrollView style={styles.container}>
      {Object.keys(SCREENS).map((screen) => (
        <Spacer key={screen}>
          <Button title={screen} onPress={() => navigation.navigate(screen)} />
        </Spacer>
      ))}
      <Spacer>
        <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
      </Spacer>
    </ScrollView>
  );
};

interface SimpleScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, keyof typeof SCREENS>;
}

const SimpleScreen = ({navigation}: SimpleScreenProps): JSX.Element => (
  <SafeAreaView style={styles.center}>
    <Button title="Go back" onPress={() => navigation.goBack()} />
  </SafeAreaView>
);

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): JSX.Element => {
  return (
    <Stack.Navigator
      screenOptions={{
        statusBarStyle: 'dark',
      }}>
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{title: 'Stack Presentation'}}
      />
      {Object.keys(SCREENS).map((name) => (
        <Stack.Screen
          key={name}
          name={name}
          component={SimpleScreen}
          options={{stackPresentation: name}}
        />
      ))}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default App;
