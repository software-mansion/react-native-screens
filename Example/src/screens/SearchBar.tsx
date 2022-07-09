import React, { useLayoutEffect, useRef, useState } from 'react';
import { I18nManager, ScrollView, Text, StyleSheet } from 'react-native';
import { SearchBarRef, SearchBarProps } from 'react-native-screens';
import {
  createNativeStackNavigator,
  NativeStackNavigationProp,
} from 'react-native-screens/native-stack';
import {
  Button,
  ListItem,
  SettingsInput,
  SettingsPicker,
  SettingsSwitch,
  ToastProvider,
  useToast,
} from '../shared';

type StackParamList = {
  Main: undefined;
  Search: undefined;
};

type BarTintColor = 'lightcoral' | 'orange' | 'white' | 'darkslategray';

type AutoCapitalize = Exclude<SearchBarProps['autoCapitalize'], undefined>;
type InputType = Exclude<SearchBarProps['inputType'], undefined>;

interface MainScreenProps {
  navigation: NativeStackNavigationProp<StackParamList, 'Main'>;
}

const MainScreen = ({ navigation }: MainScreenProps): JSX.Element => {
  const toast = useToast();

  const [search, setSearch] = useState('');
  const [placeholder, setPlaceholder] = useState('Search for something...');
  const [barTintColor, setBarTintColor] = useState<BarTintColor>('white');
  const [hintTextColor, setHintTextColor] = useState<BarTintColor>('orange');
  const [headerIconColor, setHeaderIconColor] = useState<BarTintColor>(
    'orange'
  );
  const [shouldShowHintSearchIcon, setShouldShowHintSearchIcon] = useState(
    true
  );
  const [hideWhenScrolling, setHideWhenScrolling] = useState(false);
  const [obscureBackground, setObscureBackground] = useState(false);
  const [hideNavigationBar, setHideNavigationBar] = useState(false);
  const [autoCapitalize, setAutoCapitalize] = useState<AutoCapitalize>(
    'sentences'
  );
  const [inputType, setInputType] = useState<InputType>('text');
  const searchBarRef = useRef<SearchBarRef>(null);

  useLayoutEffect(() => {
    navigation.setOptions({
      searchBar: {
        ref: searchBarRef,
        barTintColor,
        hintTextColor,
        headerIconColor,
        shouldShowHintSearchIcon,
        hideWhenScrolling,
        obscureBackground,
        hideNavigationBar,
        autoCapitalize,
        placeholder,
        inputType,
        onChangeText: (event) => setSearch(event.nativeEvent.text),
        onCancelButtonPress: () =>
          toast.push({
            message: '[iOS] Cancel button pressed',
            backgroundColor: 'orange',
          }),
        onClose: () =>
          toast.push({
            message: '[Android] Closing',
            backgroundColor: 'orange',
          }),
        onOpen: () =>
          toast.push({
            message: '[Android] Opening',
            backgroundColor: 'tomato',
          }),
        onSearchButtonPress: () =>
          toast.push({
            message: search,
            backgroundColor: 'forestgreen',
          }),
        onFocus: () =>
          toast.push({
            message: 'Search bar pressed',
            backgroundColor: 'dodgerblue',
          }),
        onBlur: () =>
          toast.push({
            message: 'Lost focus on search bar',
            backgroundColor: 'purple',
          }),
      },
    });
  }, [
    navigation,
    search,
    placeholder,
    barTintColor,
    hintTextColor,
    headerIconColor,
    shouldShowHintSearchIcon,
    hideWhenScrolling,
    obscureBackground,
    hideNavigationBar,
    autoCapitalize,
    inputType,
  ]);

  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag">
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
      <SettingsPicker<AutoCapitalize>
        label="Auto capitalize"
        value={autoCapitalize}
        onValueChange={setAutoCapitalize}
        items={['none', 'words', 'sentences', 'characters']}
      />
      <Text style={styles.heading}>iOS only</Text>
      <SettingsSwitch
        label="Hide navigation bar"
        value={hideNavigationBar}
        onValueChange={setHideNavigationBar}
      />
      <SettingsSwitch
        label="Obscure background"
        value={obscureBackground}
        onValueChange={setObscureBackground}
      />
      <SettingsSwitch
        label="Hide when scrolling"
        value={hideWhenScrolling}
        onValueChange={setHideWhenScrolling}
      />
      <Text style={styles.heading}>Android only</Text>
      <SettingsPicker<InputType>
        label="Input type"
        value={inputType}
        onValueChange={setInputType}
        items={['text', 'number', 'email', 'phone']}
      />
      <SettingsPicker<BarTintColor>
        label="Text hint color"
        value={hintTextColor}
        onValueChange={setHintTextColor}
        items={['lightcoral', 'orange', 'darkslategray', 'white']}
      />
      <SettingsPicker<BarTintColor>
        label="Header icon color"
        value={headerIconColor}
        onValueChange={setHeaderIconColor}
        items={['lightcoral', 'orange', 'darkslategray', 'white']}
      />
      <SettingsSwitch
        label="Show search hint icon"
        value={shouldShowHintSearchIcon}
        onValueChange={setShouldShowHintSearchIcon}
      />
      <Text style={styles.heading}>Imperative actions</Text>
      <Button onPress={() => searchBarRef.current?.blur()} title="Blur" />
      <Button onPress={() => searchBarRef.current?.focus()} title="Focus" />
      <Button
        onPress={() => searchBarRef.current?.clearText()}
        title="Clear Text"
      />
      <Button
        onPress={() => searchBarRef.current?.toggleCancelButton(true)}
        title="Show cancel"
      />
      <Button
        onPress={() => searchBarRef.current?.toggleCancelButton(false)}
        title="Hide cancel"
      />
      <Text style={styles.heading}>Other</Text>
      <Button
        onPress={() => navigation.navigate('Search')}
        title="Other Searchbar example"
      />
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

  useLayoutEffect(() => {
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
  <ToastProvider>
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
        name="Search"
        component={SearchScreen}
        options={{
          headerLargeTitle: true,
        }}
      />
    </Stack.Navigator>
  </ToastProvider>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
  },
  heading: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default App;
