import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Button, SettingsPicker } from '../shared';

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

const ScreenB = ({ navigation }: ScreenBProps): React.JSX.Element => {
  const [gestureType, setGestureType] = React.useState<NonNullable<NativeStackNavigationOptions['gestureType']>>('twoDimensionalSwipe');

  React.useEffect(() => {
    navigation.setOptions({
      gestureType,
    });
  }, [gestureType]);

  return (
    <View style={{ ...styles.container, backgroundColor: 'thistle' }}>
        <SettingsPicker<NonNullable<NativeStackNavigationOptions['gestureType']>>
          label="Stack animation"
          value={gestureType}
          onValueChange={setGestureType}
          items={[
            "swipeRight",
            "swipeLeft",
            "swipeUp",
            "swipeDown",
            "verticalSwipe",
            "horizontalSwipe",
            "twoDimensionalSwipe",
          ]}
        />
      <Button title="Go ScreenC" onPress={() => navigation.navigate('ScreenC')} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
}

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
