import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackNavigationProp,
} from '@react-navigation/native-stack';
import { Button, SettingsPicker } from '@apps/shared';

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
  const [gestureDirection, setGestureDirection] =
    React.useState<
      NonNullable<NativeStackNavigationOptions['gestureDirection']>
    >('horizontal');

  React.useEffect(() => {
    navigation.setOptions({
      gestureDirection,
    });
  }, [gestureDirection, navigation]);

  return (
    <View style={{ ...styles.container, backgroundColor: 'thistle' }}>
      <SettingsPicker<
        NonNullable<NativeStackNavigationOptions['gestureDirection']>
      >
        label="Gesture direction"
        value={gestureDirection}
        onValueChange={setGestureDirection}
        items={['horizontal', 'vertical']}
      />
      <Button
        title="Go ScreenC"
        onPress={() => navigation.navigate('ScreenC')}
      />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
  );
};

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
    <Stack.Screen name="ScreenB" component={ScreenB} />
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
