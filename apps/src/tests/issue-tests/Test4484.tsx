import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useLayoutEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { SearchBarProps } from 'react-native-screens';

type StackParamList = {
  Home: undefined;
  SearchBar: undefined;
};

type InputTypeMode = 'default' | SearchBarProps['inputType'];

const Stack = createNativeStackNavigator<StackParamList>();

const inputTypeModes: InputTypeMode[] = ['default', 'text', 'phone', 'number', 'email'];

function getInputType(mode: InputTypeMode): SearchBarProps['inputType'] {
  return mode === 'default' ? undefined : mode;
}

function Home({ navigation }: NativeStackScreenProps<StackParamList, 'Home'>) {
  return (
    <View style={styles.centeredContainer}>
      <Text style={styles.title}>Test4484</Text>
      <Button
        title="Open search bar test"
        onPress={() => navigation.navigate('SearchBar')}
      />
    </View>
  );
}

function SearchBarScreen({
  navigation,
}: NativeStackScreenProps<StackParamList, 'SearchBar'>) {
  const [inputTypeMode, setInputTypeMode] = useState<InputTypeMode>('default');

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        hideWhenScrolling: false,
        inputType: getInputType(inputTypeMode),
      },
    });
  }, [inputTypeMode, navigation]);

  const currentModeIndex = inputTypeModes.indexOf(inputTypeMode);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Search bar options</Text>
      <Text>Input type: {inputTypeMode}</Text>

      <Button
        title="Cycle input type"
        onPress={() =>
          setInputTypeMode(
            inputTypeModes[(currentModeIndex + 1) % inputTypeModes.length],
          )
        }
      />
      <Button
        title="Restore default values"
        onPress={() => setInputTypeMode('default')}
      />
    </ScrollView>
  );
}

export default function App(): React.JSX.Element {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" component={Home} />
        <Stack.Screen
          name="SearchBar"
          component={SearchBarScreen}
          options={{
            headerLargeTitle: true,
            title: 'Search bar',
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  centeredContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  contentContainer: {
    padding: 16,
    gap: 12,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
  },
});
