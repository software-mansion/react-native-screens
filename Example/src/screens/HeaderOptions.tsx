import React, {useState, useLayoutEffect, useEffect} from 'react';
import {StyleSheet, ScrollView, Text, I18nManager} from 'react-native';
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
  useEffect(() => {
    navigation.navigate('Settings');
  }, []);

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

type HeaderItemPosition = 'right' | 'center' | 'left';

interface SettingsScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Settings'>;
}

const SettingsScreen = ({navigation}: SettingsScreenProps): JSX.Element => {
  const [headerTitle, setHeaderTitle] = useState('Settings');
  const [backButtonVisible, setBackButtonVisible] = useState(true);
  const [headerShown, setHeaderShown] = useState(true);
  const [headerLargeTitle, setHeaderLargeTitle] = useState(true);
  const [headerItem, setHeaderItem] = useState<HeaderItemPosition>('right');
  const [headerBackTitle, setHeaderBackTitle] = useState('Back');
  const [headerHideShadow, setHeaderHideShadow] = useState(true);
  const [headerTranslucent, setHeaderTranslucent] = useState(true);

  const square = (props: {tintColor?: string}) => (
    <Square {...props} color="green" size={20} />
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle,
      headerHideBackButton: !backButtonVisible, // android
      headerBackTitleVisible: backButtonVisible, // iOS
      headerLargeTitle, // iOS
      headerBackTitle, // iOS
      headerShown,
      headerRight: headerItem === 'right' ? square : undefined,
      headerCenter: headerItem === 'center' ? square : undefined,
      headerLeft: headerItem === 'left' ? square : undefined,
      headerHideShadow,
      headerTranslucent,
    });
  }, [
    navigation,
    headerTitle,
    backButtonVisible,
    headerLargeTitle,
    headerBackTitle,
    headerItem,
    headerShown,
    headerHideShadow,
    headerTranslucent,
  ]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}>
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
      <SettingsPicker<HeaderItemPosition>
        label="Header item"
        value={headerItem}
        onValueChange={setHeaderItem}
        items={['left', 'center', 'right']}
      />
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
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </ScrollView>
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): JSX.Element => (
  <Stack.Navigator
    screenOptions={{
      headerHideBackButton: true,
      direction: I18nManager.isRTL ? 'rtl' : 'ltr',
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
        headerTintColor: 'hotpink',
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
