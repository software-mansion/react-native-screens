/* eslint-disable react-hooks/exhaustive-deps */
import * as React from 'react';
import { Button, ScrollView } from 'react-native';
import {
  NavigationContainer,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackNavigationOptions,
  NativeStackScreenProps,
} from '@react-navigation/native-stack';

type HeaderSearchBarOptions = NonNullable<
  NativeStackNavigationOptions['headerSearchBarOptions']
>;

const AppStack = createNativeStackNavigator();

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
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

function First({ navigation }: NativeStackScreenProps<ParamListBase>) {
  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: searchBarOptions,
    });
  }, [navigation]);

  const [search, setSearch] = React.useState('');

  const searchBarOptions: HeaderSearchBarOptions = {
    barTintColor: 'powderblue',
    tintColor: 'red',
    textColor: 'red',
    hideWhenScrolling: true,
    obscureBackground: false,
    hideNavigationBar: false,
    autoCapitalize: 'sentences',
    placeholder: 'Placeholder text',
    // Added in https://github.com/software-mansion/react-native-screens/pull/3186
    // to preserve test's original search bar configuration.
    placement: 'stacked',
    cancelButtonText: 'Cancel text',
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
    </ScrollView>
  );
}

function Second({ navigation }: { navigation: NavigationProp<ParamListBase> }) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button
        title="Tap me for first screen"
        onPress={() => navigation.navigate('First')}
      />
    </ScrollView>
  );
}
