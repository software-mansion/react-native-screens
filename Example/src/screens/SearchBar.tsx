import React, { useEffect, useLayoutEffect, useState } from 'react';
import { I18nManager, Platform, Button, ScrollView, Text } from 'react-native';
import { SearchBarProps } from 'react-native-screens';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import {
  ListItem,
  SettingsInput,
  SettingsPicker,
  SettingsSwitch,
  Snack,
  Spacer,
} from '../shared';

type StackParamList = {
  Main: undefined;
  Snack: { backgroundColor: string; message: string };
  Search: undefined;
};

type BarTintColor = 'lightcoral' | 'orange' | 'white' | 'darkslategray';

type AutoCapitalize = Exclude<SearchBarProps['autoCapitalize'], undefined>;

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
}

const MainScreen = ({ navigation }: MainScreenProps): JSX.Element => {
  const [search, setSearch] = useState('');
  const [placeholder, setPlaceholder] = useState('Search for something...');
  const [barTintColor, setBarTintColor] = useState<BarTintColor>('white');
  const [hideWhenScrolling, setHideWhenScrolling] = useState(false);
  const [obscureBackground, setObscureBackground] = useState(false);
  const [hideNavigationBar, setHideNavigationBar] = useState(false);
  const [autoCapitalize, setAutoCapitalize] = useState<AutoCapitalize>(
    'sentences'
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      searchBar: {
        barTintColor,
        hideWhenScrolling,
        obscureBackground,
        hideNavigationBar,
        autoCapitalize,
        placeholder,
        onChangeText: (event) => setSearch(event.nativeEvent.text),
        onCancelButtonPress: () =>
          navigation.navigate('Snack', {
            message: 'Cancel button pressed',
            backgroundColor: 'orange',
          }),
        onSearchButtonPress: () =>
          navigation.navigate('Snack', {
            message: search,
            backgroundColor: 'forestgreen',
          }),
        onFocus: () =>
          navigation.navigate('Snack', {
            message: 'Search bar pressed',
            backgroundColor: 'dodgerblue',
          }),
        onBlur: () => console.log('Lost focus on search bar'),
      },
    });
  }, [
    navigation,
    search,
    placeholder,
    barTintColor,
    hideWhenScrolling,
    obscureBackground,
    hideNavigationBar,
    autoCapitalize,
  ]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag">
      {Platform.OS === 'ios' ? (
        <>
          <SettingsInput
            label="Placeholder"
            value={placeholder}
            onValueChange={setPlaceholder}
          />
          <SettingsPicker<BarTintColor>
            label="Bar Tint Color"
            value={barTintColor}
            onValueChange={setBarTintColor}
            items={['lightcoral', 'orange', 'darkslategray', 'white']}
          />
          <SettingsSwitch
            label="Hide when scrolling"
            value={hideWhenScrolling}
            onValueChange={setHideWhenScrolling}
          />
          <SettingsSwitch
            label="Obscure background"
            value={obscureBackground}
            onValueChange={setObscureBackground}
          />
          <SettingsSwitch
            label="Hide navigation bar"
            value={hideNavigationBar}
            onValueChange={setHideNavigationBar}
          />
          <SettingsPicker<AutoCapitalize>
            label="Auto capitalize"
            value={autoCapitalize}
            onValueChange={setAutoCapitalize}
            items={['none', 'words', 'sentences', 'characters']}
          />
          <Button
            onPress={() => navigation.navigate('Search')}
            title="Other Searchbar example"
          />
        </>
      ) : Platform.OS === 'android' ? (
        <Spacer>
          <Text>SearchBar options have no effect on Android.</Text>
        </Spacer>
      ) : null}
      <Button onPress={() => navigation.pop()} title="🔙 Back to Examples" />
    </ScrollView>
  );
};

interface SearchScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Search'>;
}

const SearchScreen = ({ navigation }: SearchScreenProps) => {
  const [search, setSearch] = useState('');

  const places = [
    '🏝️ Desert Island',
    '🏞️ National Park',
    '⛰️ Mountain',
    '🏰 Castle',
    '🗽 Statue of Liberty',
    '🌉 Bridge at Night',
    '🏦 Bank',
    '🏛️ Classical Building',
    '🏟️ Stadium',
    '🏪 Convenience Store',
    '🏫 School',
    '⛲ Fountain',
    '🌄 Sunrise Over Mountains',
    '🌆 Cityscape at Dusk',
    '🎡 Ferris Wheel',
  ];

  useEffect(() => {
    navigation.setOptions({
      searchBar: {
        placeholder: 'Interesting places...',
        onChangeText: (event) => setSearch(event.nativeEvent.text),
        obscureBackground: false,
        autoCapitalize: 'none',
        hideWhenScrolling: false,
      },
    });
  }, [navigation, search]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag">
      {places
        .filter(
          (item) => item.toLowerCase().indexOf(search.toLowerCase()) !== -1
        )
        .map((place) => (
          <ListItem
            key={place}
            title={place}
            onPress={() => navigation.goBack()}
          />
        ))}
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
      component={MainScreen}
      options={{
        title: 'Search bar',
      }}
    />
    <Stack.Screen
      name="Snack"
      component={Snack}
      options={{
        stackPresentation: 'transparentModal',
        headerShown: false,
        stackAnimation: 'slide_from_bottom',
      }}
    />
    <Stack.Screen
      name="Search"
      component={SearchScreen}
      options={{
        headerLargeTitle: true,
      }}
    />
  </Stack.Navigator>
);

export default App;
