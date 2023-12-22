import React from 'react';
import { View, StyleSheet, I18nManager } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import { Button } from '../shared';

type StackParamList = {
  ScreenA: undefined;
  ScreenB: undefined;
  ScreenC: undefined;
};

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'ScreenA'>;
}

const MainScreen = ({ navigation }: MainScreenProps): JSX.Element => (
  <View style={{ ...styles.container, backgroundColor: 'moccasin' }}>
    <Button title="Go ScreenB" onPress={() => navigation.navigate('ScreenB')} />
    <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
  </View>
);

interface ScreenBProps {
  navigation: NativeStackNavigationProp<StackParamList, 'ScreenB'>;
}

const ScreenB = ({ navigation }: ScreenBProps): JSX.Element => (
  <View style={{ ...styles.container, backgroundColor: 'thistle' }}>
    <Button title="Go ScreenC" onPress={() => navigation.navigate('ScreenC')} />
    <Button title="Go back" onPress={() => navigation.goBack()} />
  </View>
);

interface ScreenCProps {
  navigation: NativeStackNavigationProp<StackParamList, 'ScreenC'>;
}

const ScreenC = ({ navigation }: ScreenCProps): JSX.Element => (
  <View style={{ ...styles.container, backgroundColor: 'blue' }}>
    <Button title="Go back" onPress={() => navigation.goBack()} />
  </View>
);

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      headerHideBackButton: true,
      stackAnimation: 'none',
    }}>
    <Stack.Screen name="ScreenA" component={MainScreen} />
    <Stack.Screen
      name="ScreenB"
      component={ScreenB}
      options={{
        goBackGesture: 'twoDimensionalSwipe',
      }}
    />
    <Stack.Screen name="ScreenC" component={ScreenC} />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
});

export default App;
