import React, {useLayoutEffect, useState} from 'react';
import {View, StyleSheet, Platform, Text, I18nManager} from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
  NativeStackNavigationOptions,
} from 'react-native-screens/native-stack';
import {SettingsPicker, SettingsSwitch, Button, Spacer} from '../shared';

type StackParamList = {
  First: undefined;
  Second: undefined;
  Modal: undefined;
};

type StatusBarStyle = Exclude<
  NativeStackNavigationOptions['statusBarStyle'],
  undefined
>;

type StatusBarAnimation = Exclude<
  NativeStackNavigationOptions['statusBarAnimation'],
  undefined
>;

interface FirstScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'First'>;
}

const FirstScreen = ({navigation}: FirstScreenProps): JSX.Element => {
  const [statusBarStyle, setStatusBarStyle] = useState<StatusBarStyle>('auto');
  const [statusBarHidden, setStatusBarHidden] = useState(false);
  const [statusBarAnimation, setStatusBarAnimation] = useState<
    StatusBarAnimation
  >('fade');

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
          <SettingsPicker<StatusBarStyle>
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
          <SettingsPicker<StatusBarAnimation>
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
      <Button
        title="Go to second screen"
        onPress={() => navigation.navigate('Second')}
      />
      <Button title="Open modal" onPress={() => navigation.navigate('Modal')} />
      <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
    </View>
  );
};

interface SecondScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Second'>;
}

const SecondScreen = ({navigation}: SecondScreenProps): JSX.Element => (
  <View style={styles.container}>
    <Button title="Go back" onPress={() => navigation.goBack()} />
  </View>
);

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: 'gray',
      },
      headerTitleStyle: {
        color: 'white',
      },
      headerHideBackButton: true,
      direction: I18nManager.isRTL ? 'rtl' : 'ltr',
    }}>
    <Stack.Screen
      name="First"
      component={FirstScreen}
      options={{
        title: 'Status bar (iOS)',
      }}
    />
    <Stack.Screen name="Second" component={SecondScreen} />
    <Stack.Screen
      name="Modal"
      component={SecondScreen}
      options={{stackPresentation: 'modal'}}
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
