/* eslint-disable react/display-name */
import React, {useState, useLayoutEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  Text,
  Platform,
} from 'react-native';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

import {
  SettingsInput,
  SettingsPicker,
  SettingsSwitch,
  Square,
  Button,
} from '../shared';

type StackParamList = {
  Main: undefined;
  Settings: undefined;
};

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
}

const MainScreen = ({navigation}: MainScreenProps): JSX.Element => {
  return (
    <ScrollView>
      <Button
        onPress={() => navigation.navigate('Settings')}
        title="Go to next screen"
      />
      <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
    </ScrollView>
  );
};

interface SettingsScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Settings'>;
}

const SettingsScreen = ({navigation}: SettingsScreenProps): JSX.Element => {
  const [headerTitle, setHeaderTitle] = useState('Settings');
  const [backButtonVisible, setBackButtonVisible] = useState(true);
  const [headerShown, setHeaderShown] = useState(true);
  const [headerLargeTitle, setHeaderLargeTitle] = useState(false);
  const [headerItem, setHeaderItem] = useState('right');
  const [headerBackTitle, setHeaderBackTitle] = useState('Back');
  const [headerHideShadow, setHeaderHideShadow] = useState(false);
  const [headerTranslucent, setHeaderTranslucent] = useState(false);

  const square = (props: {tintColor?: string}) => (
    <Square {...props} color="green" size={20} />
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle,
      headerBackTitleVisible: backButtonVisible, // iOS
      headerHideBackButton: !backButtonVisible, // android
      headerShown,
      headerRight: headerItem === 'right' ? square : undefined,
      headerCenter: headerItem === 'center' ? square : undefined,
      headerLeft: headerItem === 'left' ? square : undefined,
      headerLargeTitle, // iOS
      headerBackTitle, // iOS
      headerHideShadow,
      headerTranslucent,
    });
  }, [
    navigation,
    headerTitle,
    backButtonVisible,
    headerItem,
    headerShown,
    headerLargeTitle,
    headerBackTitle,
    headerHideShadow,
    headerTranslucent,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <SettingsInput
        label="Header title"
        value={headerTitle}
        onValueChange={setHeaderTitle}
      />
      <SettingsSwitch
        label="Back button visible"
        value={backButtonVisible}
        onValueChange={setBackButtonVisible}
      />
      <SettingsSwitch
        label="Header shown"
        value={headerShown}
        onValueChange={setHeaderShown}
      />
      <SettingsSwitch
        label="Header hide shadow"
        value={headerHideShadow}
        onValueChange={setHeaderHideShadow}
      />
      <SettingsSwitch
        label="Header translucent"
        value={headerTranslucent}
        onValueChange={setHeaderTranslucent}
      />
      <SettingsPicker
        label="Header item"
        value={headerItem}
        onValueChange={setHeaderItem}
        items={['left', 'center', 'right']}
      />
      {Platform.OS === 'ios' ? (
        <>
          <Text style={styles.heading}>iOS only</Text>
          <SettingsSwitch
            label="Header large title"
            value={headerLargeTitle}
            onValueChange={setHeaderLargeTitle}
          />
          <SettingsInput
            label="Header back title"
            value={headerBackTitle}
            onValueChange={setHeaderBackTitle}
          />
        </>
      ) : null}
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </SafeAreaView>
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
      options={{
        title: 'Header Options',
      }}
      component={MainScreen}
    />
    <Stack.Screen
      name="Settings"
      component={SettingsScreen}
      options={{
        headerTintColor: 'magenta',
      }}
    />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 100,
    backgroundColor: 'white',
  },
  heading: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default App;
