import React, { createContext, useContext, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import {
  createNativeStackNavigator,
  type NativeStackScreenProps,
} from '@react-navigation/native-stack';
import { Button, StyleSheet, Text, View } from 'react-native';

// Reproduces https://github.com/software-mansion/react-native-screens/issues/5167
//
// Android: both screens of the root stack set the same headerSearchBarOptions,
// but "Nested stack" renders a nested native stack whose headers are hidden,
// and its screens cleared the root header's search icon from the menu.
// Expected: both headers show the search icon, the text typed into it shows on
// the screen beneath, and the icon stays when a screen is pushed onto the
// nested stack.

type RootStackParamList = {
  Nested: undefined;
  Plain: undefined;
};

type NestedStackParamList = {
  First: undefined;
  Second: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamList>();
const NestedStack = createNativeStackNavigator<NestedStackParamList>();

// What was last typed into a header search bar, shown on every screen, so a
// search field that opens but never reaches onChangeText shows as such.
const SearchTextContext = createContext('');

function SearchText() {
  return <Text>Search text: "{useContext(SearchTextContext)}"</Text>;
}

function First({
  navigation,
}: NativeStackScreenProps<NestedStackParamList, 'First'>) {
  return (
    <View style={styles.container}>
      <Text>The first screen of a nested native stack.</Text>
      <SearchText />
      <Button
        title="Push a screen onto the nested stack"
        onPress={() => navigation.push('Second')}
      />
      <Button
        title="Open a screen with no nested stack"
        onPress={() => navigation.getParent()?.navigate('Plain')}
      />
    </View>
  );
}

function Second() {
  return (
    <View style={styles.container}>
      <Text>The second screen of the nested stack.</Text>
      <SearchText />
    </View>
  );
}

function Nested() {
  return (
    <NestedStack.Navigator screenOptions={{ headerShown: false }}>
      <NestedStack.Screen name="First" component={First} />
      <NestedStack.Screen name="Second" component={Second} />
    </NestedStack.Navigator>
  );
}

function Plain() {
  return (
    <View style={styles.container}>
      <Text>A screen with no nested stack.</Text>
      <SearchText />
    </View>
  );
}

export default function App(): React.JSX.Element {
  const [searchText, setSearchText] = useState('');

  return (
    <SearchTextContext.Provider value={searchText}>
      <NavigationContainer>
        <RootStack.Navigator
          screenOptions={{
            headerSearchBarOptions: {
              placeholder: 'Search',
              onChangeText: event => setSearchText(event.nativeEvent.text),
            },
          }}>
          <RootStack.Screen
            name="Nested"
            component={Nested}
            options={{ title: 'Nested stack' }}
          />
          <RootStack.Screen
            name="Plain"
            component={Plain}
            options={{ title: 'No nested stack' }}
          />
        </RootStack.Navigator>
      </NavigationContainer>
    </SearchTextContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
});
