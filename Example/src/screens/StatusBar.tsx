import React, {useLayoutEffect, useState} from 'react';
import {View, StyleSheet, Platform, Text} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import {SettingsPicker, SettingsSwitch, Button, Spacer} from '../shared';

enableScreens();

type StackParamList = {
  Main: undefined;
};

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
}

const MainScreen = ({navigation}: MainScreenProps): JSX.Element => {
  const [statusBarStyle, setStatusBarStyle] = useState('auto');
  const [statusBarHidden, setStatusBarHidden] = useState(false);
  const [statusBarAnimation, setStatusBarAnimation] = useState('fade');

  useLayoutEffect(() => {
    navigation.setOptions({
      statusBarStyle,
      statusBarHidden,
      statusBarAnimation,
    });
  }, [navigation, statusBarStyle, statusBarHidden, statusBarAnimation]);

  return (
    <View style={styles.container}>
      {Platform.OS === 'ios' ? (
        <>
          <SettingsPicker
            label="Status bar style"
            value={statusBarStyle}
            onValueChange={setStatusBarStyle}
            items={['auto', 'inverted', 'light', 'dark']}
          />
          <SettingsSwitch
            label="Status bar hidden"
            value={statusBarHidden}
            onValueChange={setStatusBarHidden}
          />
          <SettingsPicker
            label="Status bar animation"
            value={statusBarAnimation}
            onValueChange={setStatusBarAnimation}
            items={['fade', 'none', 'slide']}
          />
        </>
      ) : Platform.OS === 'android' ? (
        <Spacer>
          <Text>StatusBar options have no effect on Android.</Text>
        </Spacer>
      ) : null}
      <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
    </View>
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): JSX.Element => (
  <Stack.Navigator>
    <Stack.Screen
      name="Main"
      component={MainScreen}
      options={{
        title: 'Status bar (iOS)',
        headerStyle: {
          backgroundColor: 'gray',
        },
        headerTitleStyle: {
          color: 'white',
        },
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
