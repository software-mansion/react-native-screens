import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Button } from '../shared';

type StackParamList = {
  ScreenA: undefined;
  ScreenB: undefined;
  ScreenC: undefined;
};

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'ScreenA'>;
}

const MainScreen = ({ navigation }: MainScreenProps): React.JSX.Element => (
  <View style={{ ...styles.container, backgroundColor: 'moccasin' }}>
    <Button title="Go ScreenB" onPress={() => navigation.navigate('ScreenB')} />
    <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
  </View>
);

interface ScreenBProps {
  navigation: NativeStackNavigationProp<StackParamList, 'ScreenB'>;
}

const ScreenB = ({ navigation }: ScreenBProps): React.JSX.Element => (
  <View style={{ ...styles.container, backgroundColor: 'thistle' }}>
    <Button title="Go ScreenC" onPress={() => navigation.navigate('ScreenC')} />
    <Button title="Go back" onPress={() => navigation.goBack()} />
  </View>
);

interface ScreenCProps {
  navigation: NativeStackNavigationProp<StackParamList, 'ScreenC'>;
}

const ScreenC = ({ navigation }: ScreenCProps): React.JSX.Element => (
  <View style={{ ...styles.container, backgroundColor: 'blue' }}>
    <Button title="Go back" onPress={() => navigation.goBack()} />
  </View>
);

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): React.JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      headerBackVisible: true,
      animation: 'none',
    }}>
    <Stack.Screen name="ScreenA" component={MainScreen} />
    <Stack.Screen
      name="ScreenB"
      component={ScreenB}
      options={{
        // @ts-ignore: goBackGesture is not implemented yet in react-navigation
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
