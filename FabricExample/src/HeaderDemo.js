import React, {useState, useLayoutEffect} from 'react';
import {Platform, ScrollView, StyleSheet, Text} from 'react-native';
import {BLACK, PRIMARY, SECONDARY, WHITE} from './colors';
import {
  SettingsInput,
  SettingsPicker,
  SettingsSwitch,
  Square,
  Button,
} from './shared';
import {SettingsColorPicker} from './shared/SettingsColorPicker';
import {SettingsNumberInput} from './shared/SettingsNumberInput';

const COLORS_FOR_PICKER = [PRIMARY, SECONDARY, WHITE, BLACK];

export default function HeaderDemo({navigation}) {
  const [headerTitle, setHeaderTitle] = useState('Settings');
  // const [backButtonVisible, setBackButtonVisible] = useState(true);
  const [headerShown, setHeaderShown] = useState(true);
  const [headerLargeTitle, setHeaderLargeTitle] = useState(false);
  const [headerItem, setHeaderItem] = useState('right');
  const [headerBackTitle, setHeaderBackTitle] = useState('Back');
  const [headerHideShadow, setHeaderHideShadow] = useState(true);
  const [headerTranslucent, setHeaderTranslucent] = useState(true);
  const [backgroundColor, setBackgroundColor] = useState(PRIMARY);
  const [headerColor, setHeaderColor] = useState(WHITE);
  const [fontSize, setFontSize] = useState();
  const [largeFontSize, setLargeFontSize] = useState();

  const square = props => <Square {...props} color="green" size={20} />;

  useLayoutEffect(() => {
    const options = {
      title: headerTitle,
      headerLargeTitle, // iOS
      headerBackTitle, // iOS
      headerShown,
      headerRight: headerItem === 'right' ? square : undefined,
      headerTitle: headerItem === 'center' ? square : undefined,
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
      <SettingsColorPicker
        label="Header color"
        value={headerColor}
        onValueChange={setHeaderColor}
        colors={COLORS_FOR_PICKER}
      />
      <SettingsColorPicker
        label="Header background color"
        value={backgroundColor}
        onValueChange={setBackgroundColor}
        colors={COLORS_FOR_PICKER}
      />
      <SettingsNumberInput
        label="Header font size"
        value={fontSize}
        onValueChange={val => setFontSize(val)}
      />
      <SettingsNumberInput
        label="Large header font size"
        value={largeFontSize}
        onValueChange={val => setLargeFontSize(val)}
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
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 30 : 100,
    backgroundColor: WHITE,
  },
  heading: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
});
