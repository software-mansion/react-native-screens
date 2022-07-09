import * as React from 'react';
import {Button, NativeSyntheticEvent, ScrollView} from 'react-native';
import {
  NavigationContainer,
  NavigationProp,
  ParamListBase,
} from '@react-navigation/native';
import {
  createNativeStackNavigator,
  NativeStackScreenProps,
} from 'react-native-screens/native-stack';
import {SearchBarProps} from 'react-native-screens';

const AppStack = createNativeStackNavigator();

export default function App(): JSX.Element {
  return (
    <NavigationContainer>
      <AppStack.Navigator
        screenOptions={{
          headerLargeTitle: true,
          headerTranslucent: true,
        }}>
        <AppStack.Screen name="First" component={First} />
        <AppStack.Screen name="Second" component={Second} />
      </AppStack.Navigator>
    </NavigationContainer>
  );
}

function First({navigation}: NativeStackScreenProps<ParamListBase>) {
  const searchBarRef = React.useRef();

  React.useEffect(() => {
    navigation.setOptions({
      searchBar: searchBarOptions,
    });
  }, [navigation]);

  const [search, setSearch] = React.useState('');

  const searchBarOptions: SearchBarProps = {
    // @ts-ignore
    ref: searchBarRef,
    barTintColor: 'powderblue',
    hideWhenScrolling: true,
    obscureBackground: false,
    hideNavigationBar: false,
    autoCapitalize: 'sentences',
    placeholder: 'Some text',
    onChangeText: (e: NativeSyntheticEvent<{text: string}>) =>
      setSearch(e.nativeEvent.text),
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
        title="Tap me for ref"
        onPress={() => (searchBarRef.current as any).focus()}
      />
      {items
        .filter(
          (item) => item.toLowerCase().indexOf(search.toLowerCase()) !== -1,
        )
        .map((item) => (
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

function Second({navigation}: {navigation: NavigationProp<ParamListBase>}) {
  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic">
      <Button
        title="Tap me for first screen"
        onPress={() => navigation.navigate('First')}
      />
    </ScrollView>
  );
}
