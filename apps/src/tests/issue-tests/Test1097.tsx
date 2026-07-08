/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { Button, ScrollView } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { SearchBarCommands } from 'react-native-screens';

type StackParamList = {
  First: undefined;
  Second: undefined;
  Third: undefined;
};

type HeaderSearchBarOptions = NonNullable<
  NativeStackNavigationOptions['headerSearchBarOptions']
>;

const AppStack = createNativeStackNavigator<StackParamList>();

export default function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerLargeTitleEnabled: true,
          headerTransparent: true,
        }}>
        <AppStack.Screen name="First" component={First} />
        <AppStack.Screen name="Second" component={Second} />
        <AppStack.Screen name="Third" component={Third} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

function First({
  navigation,
}: NativeStackScreenProps<StackParamList, 'First'>) {
  const searchBarRef = React.useRef<SearchBarCommands>(null);

  React.useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: searchBarOptions,
    });
  }, [navigation]);

  const [search, setSearch] = React.useState('');

  const searchBarOptions: HeaderSearchBarOptions = {
    ref: searchBarRef,
    barTintColor: 'powderblue',
    hideWhenScrolling: true,
    obscureBackground: false,
    hideNavigationBar: false,
    autoCapitalize: 'sentences',
    placeholder: 'Some text',
    placement: 'stacked',
    onChange: e => setSearch(e.nativeEvent.text),
    onCancelButtonPress: () => console.warn('Cancel button pressed'),
    onSearchButtonPress: () => console.warn('Search button pressed'),
    onFocus: () => console.warn('onFocus event'),
    onBlur: () => console.warn('onBlur event'),
  };

  const items = [
    'Apples',
    'Pie',
    'Juice',
    'Cake',
    'Nuggets',
    'Some',
    'Other',
    'Stuff',
    'To',
    'Fill',
    'The',
    'Scrolling',
    'Space',
  ];

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag">
      <Button
        title="Tap me for second screen"
        onPress={() => navigation.navigate('Second')}
      />
      <Button
        title="Tap me for third screen"
        onPress={() => navigation.navigate('Third')}
      />
      <Button
        title="Tap me for ref"
        onPress={() => searchBarRef.current?.focus()}
      />
      {items
        .filter(item => item.toLowerCase().indexOf(search.toLowerCase()) !== -1)
        .map(item => (
          <Button
            title={item}
            key={item}
            onPress={() => {
              console.warn(`${item} clicked`);
            }}
          />
        ))}
      <Button
        title="Tap me for second screen"
        onPress={() => navigation.navigate('Second')}
      />
      <Button
        title="Tap me for third screen"
        onPress={() => navigation.navigate('Third')}
      />
      <Button
        title="Tap me for ref"
        onPress={() => searchBarRef.current?.focus()}
      />
    </ScrollView>
  );
}

function Second({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Second'>) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button
        title="Tap me for first screen"
        onPress={() => navigation.popTo('First')}
      />
      <Button
        title="Tap me for third screen"
        onPress={() => navigation.navigate('Third')}
      />
    </ScrollView>
  );
}

function Third({
  navigation,
}: NativeStackScreenProps<StackParamList, 'Third'>) {
  const searchBarRef = React.useRef<SearchBarCommands>(null);

  const searchBarProps: HeaderSearchBarOptions = {
    ref: searchBarRef,
    barTintColor: 'powderblue',
    hideWhenScrolling: true,
    obscureBackground: false,
    hideNavigationBar: false,
    autoCapitalize: 'sentences',
    placeholder: 'Some text',
    // Added in https://github.com/software-mansion/react-native-screens/pull/3186
    // to preserve test's original search bar configuration.
    placement: 'stacked',
    onChange: e => console.warn(`Text changed to ${e.nativeEvent.text}`),
    onCancelButtonPress: () => console.warn('Cancel button pressed'),
    onSearchButtonPress: () => console.warn('Search button pressed'),
    onFocus: () => console.warn('onFocus event'),
    onBlur: () => console.warn('onBlur event'),
  };

  React.useEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: searchBarProps,
    });
  }, [navigation]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      keyboardDismissMode="on-drag">
      <Button
        title="Tap me for the first screen"
        onPress={() => navigation.popTo('First')}
      />
      <Button
        title="Focus search bar"
        onPress={() => searchBarRef.current?.focus()}
      />
      <Button
        title="Remove focus from search bar"
        onPress={() => searchBarRef.current?.blur()}
      />
      <Button
        title="Clear text in search bar"
        onPress={() => searchBarRef.current?.clearText()}
      />
      <Button
        title="Show cancel button"
        onPress={() => searchBarRef.current?.toggleCancelButton(true)}
      />
      <Button
        title="Hide cancel button"
        onPress={() => searchBarRef.current?.toggleCancelButton(false)}
      />
      <Button
        title="Set 'sometext' text"
        onPress={() => searchBarRef.current?.setText('sometext')}
      />
      <Button
        title="Cancel search"
        onPress={() => searchBarRef.current?.cancelSearch()}
      />
      <Button
        title="Tap me for the first screen"
        onPress={() => navigation.popTo('First')}
      />
      <Button
        title="Focus search bar"
        onPress={() => searchBarRef.current?.focus()}
      />
    </ScrollView>
  );
}
