import React from 'react';
import {ScrollView, StyleSheet, SafeAreaView} from 'react-native';
import {ParamListBase} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackNavigationOptions,
} from 'react-native-screens/native-stack';
import {Button} from '../shared';

type StackPresentation = Exclude<
  NativeStackNavigationOptions['stackPresentation'],
  undefined
>;

const SCREENS: Record<StackPresentation, StackPresentation> = {
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
    <ScrollView style={{...styles.container, backgroundColor: 'thistle'}}>
      {Object.keys(SCREENS).map((screen) => (
        <Button
          key={screen}
          title={screen}
          onPress={() => navigation.navigate(screen)}
        />
      ))}
      <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
    </ScrollView>
  );
};

interface SimpleScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, keyof typeof SCREENS>;
}

const SimpleScreen = ({navigation}: SimpleScreenProps): JSX.Element => (
  <SafeAreaView style={styles.container}>
    <Button title="Go back" onPress={() => navigation.goBack()} />
  </SafeAreaView>
);

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): JSX.Element => {
  return (
    <Stack.Navigator
      screenOptions={{
        statusBarStyle: 'dark',
        headerHideBackButton: true,
      }}>
      <Stack.Screen
        name="Main"
        component={MainScreen}
        options={{title: 'Stack Presentation'}}
      />
      {Object.keys(SCREENS).map((name) => (
        <Stack.Screen
          key={name}
          name={name as StackPresentation}
          component={SimpleScreen}
          options={{stackPresentation: name as StackPresentation}}
        />
      ))}
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
  },
});

export default App;
