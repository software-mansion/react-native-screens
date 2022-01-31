import React, {useState, useLayoutEffect, useEffect} from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {NavigationContainer} from '@react-navigation/native';
import {
  StyleSheet,
  ScrollView,
  Text,
  I18nManager,
  TextInput,
  View,
} from 'react-native';
import {
  SettingsInput,
  SettingsPicker,
  SettingsSwitch,
  Square,
  Button,
} from './shared';

const MainScreen = ({navigation}) => {
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

const SettingsScreen = ({navigation}) => {
  const [headerTitle, setHeaderTitle] = useState('Settings');
  // const [backButtonVisible, setBackButtonVisible] = useState(true);
  const [headerShown, setHeaderShown] = useState(true);
  const [headerLargeTitle, setHeaderLargeTitle] = useState(true);
  const [headerItem, setHeaderItem] = useState('right');
  const [headerBackTitle, setHeaderBackTitle] = useState('Back');
  const [headerHideShadow, setHeaderHideShadow] = useState(true);
  const [headerTranslucent, setHeaderTranslucent] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState('#001a72');
  const [headerColor, setHeaderColor] = useState('#FFFFFF');
  const [fontSize, setFontSize] = useState(0);
  const [largeFontSize, setLargeFontSize] = useState(0);

  const square = props => <Square {...props} color="green" size={20} />;

  useLayoutEffect(() => {
    const options = {
      headerTitle,
      headerLargeTitle, // iOS
      headerBackTitle, // iOS
      headerShown,
      headerRight: headerItem === 'right' ? square : undefined,
      headerCenter: headerItem === 'center' ? square : undefined,
      headerLeft: headerItem === 'left' ? square : undefined,
      headerHideShadow,
      headerTransparent: headerTranslucent,
      headerBackTitleStyle: {
        fontFamily: 'arial',
        fontSize: 20,
      },
      headerStyle: {backgroundColor},
      headerTintColor: headerColor,
      headerLargeTitleStyle: {
        fontSize: largeFontSize,
      },
      headerTitleStyle: {
        fontSize,
      },
    };
    console.log(options);
    navigation.setOptions(options);
  }, [
    navigation,
    headerTitle,
    headerLargeTitle,
    headerBackTitle,
    headerItem,
    headerShown,
    headerHideShadow,
    headerTranslucent,
    backgroundColor,
    headerColor,
    fontSize,
    largeFontSize,
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
      <SettingsInput
        label="Header color"
        value={headerColor}
        onValueChange={setHeaderColor}
      />
      <SettingsInput
        label="Header background color"
        value={backgroundColor}
        onValueChange={setBackgroundColor}
      />
      <SettingsInput
        label="Header font size"
        value={fontSize}
        onValueChange={val => setFontSize(Number(val))}
      />
      <SettingsInput
        label="Large header font size"
        value={largeFontSize}
        onValueChange={val => setLargeFontSize(Number(val))}
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

const Stack = createNativeStackNavigator();

const App = () => (
  <NavigationContainer>
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
  </NavigationContainer>
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
