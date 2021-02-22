/* eslint-disable react/display-name */
import React, {useState, useLayoutEffect} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Button,
  ScrollView,
  Text,
  Platform,
} from 'react-native';
import {enableScreens} from 'react-native-screens';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';

import {SettingsPicker, SettingsSwitch, Square} from '../shared';

enableScreens();

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
        title="Go to new screen"
      />
      <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
    </ScrollView>
  );
};

interface SettingsScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Settings'>;
}

const SettingsScreen = ({navigation}: SettingsScreenProps): JSX.Element => {
  const [backButtonVisible, setBackButtonVisible] = useState(true);
  const [headerShown, setHeaderShown] = useState(true);
  const [headerLargeTitle, setHeaderLargeTitle] = useState(false);

  const [headerItem, setHeaderItem] = useState('right');

  const square = (props: {tintColor?: string}) => (
    <Square {...props} color="green" size={20} />
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerBackTitleVisible: backButtonVisible, // iOS
      headerHideBackButton: !backButtonVisible, // android
      headerShown,
      headerRight: headerItem === 'right' ? square : undefined,
      headerCenter: headerItem === 'center' ? square : undefined,
      headerLeft: headerItem === 'left' ? square : undefined,
      headerLargeTitle,
    });
  }, [
    navigation,
    backButtonVisible,
    headerItem,
    headerShown,
    headerLargeTitle,
  ]);

  return (
    <SafeAreaView style={styles.container}>
      <SettingsSwitch
        label="Back button visible"
        value={backButtonVisible}
        onPress={() => setBackButtonVisible(!backButtonVisible)}
      />
      <SettingsSwitch
        label="Header shown"
        value={headerShown}
        onPress={() => setHeaderShown(!headerShown)}
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
            onPress={() => setHeaderLargeTitle(!headerLargeTitle)}
          />
        </>
      ) : null}
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </SafeAreaView>
  );
};

const Stack = createNativeStackNavigator<StackParamList>();

const App = (): JSX.Element => (
  <Stack.Navigator>
    <Stack.Screen
      name="Main"
      options={{
        title: 'Header Options',
      }}
      component={MainScreen}
    />
    <Stack.Screen name="Settings" component={SettingsScreen} />
  </Stack.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heading: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default App;
