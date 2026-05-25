import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import type { NativeStackScreenProps } from '@react-navigation/native-stack';
import React, { useLayoutEffect, useState } from 'react';
import { Button, ScrollView, StyleSheet, Text, View } from 'react-native';
import type { SearchBarPlacement, SearchBarProps } from 'react-native-screens';

type StackParamList = {
  Home: undefined;
  SearchBar: undefined;
};

type PlaceholderMode = 'default' | 'custom' | 'empty';
type HintColorMode = 'default' | 'red' | 'blue';

type SearchBarConfig = {
  placement: SearchBarPlacement;
  placeholderMode: PlaceholderMode;
  hintColorMode: HintColorMode;
  allowToolbarIntegration: boolean;
};

const Stack = createNativeStackNavigator<StackParamList>();

const placements: SearchBarPlacement[] = [
  'automatic',
  'inline',
  'stacked',
  'integrated',
  'integratedButton',
  'integratedCentered',
];

const placeholderModes: PlaceholderMode[] = ['default', 'custom', 'empty'];
const hintColorModes: HintColorMode[] = ['default', 'red', 'blue'];

const defaultConfig: SearchBarConfig = {
  placement: 'automatic',
  placeholderMode: 'default',
  hintColorMode: 'default',
  allowToolbarIntegration: true,
};

function getNextValue<T>(values: readonly T[], currentValue: T): T {
  const currentIndex = values.indexOf(currentValue);
  return values[(currentIndex + 1) % values.length];
}

function getPlaceholder(mode: PlaceholderMode): SearchBarProps['placeholder'] {
  switch (mode) {
    case 'custom':
      return 'Custom placeholder';
    case 'empty':
      return '';
    default:
      return undefined;
  }
}

function getHintTextColor(
  mode: HintColorMode,
): SearchBarProps['hintTextColor'] {
  switch (mode) {
    case 'red':
      return 'red';
    case 'blue':
      return 'blue';
    default:
      return undefined;
  }
}

function Home({ navigation }: NativeStackScreenProps<StackParamList, 'Home'>) {
  return (
    <View style={styles.centeredContainer}>
      <Text style={styles.title}>Test4089</Text>
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
  const [config, setConfig] = useState<SearchBarConfig>(defaultConfig);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        placement: config.placement,
        allowToolbarIntegration: config.allowToolbarIntegration,
        hideWhenScrolling: false,
        placeholder: getPlaceholder(config.placeholderMode),
        hintTextColor: getHintTextColor(config.hintColorMode),
      },
    });
  }, [config, navigation]);

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      contentContainerStyle={styles.contentContainer}>
      <Text style={styles.title}>Search bar options</Text>
      <Text>Placement: {config.placement}</Text>
      <Text>Placeholder: {config.placeholderMode}</Text>
      <Text>Hint text color: {config.hintColorMode}</Text>
      <Text>
        Allow toolbar integration:{' '}
        {config.allowToolbarIntegration ? 'true' : 'false'}
      </Text>

      <Button
        title="Cycle placement"
        onPress={() =>
          setConfig(currentConfig => ({
            ...currentConfig,
            placement: getNextValue(placements, currentConfig.placement),
          }))
        }
      />
      <Button
        title="Cycle placeholder"
        onPress={() =>
          setConfig(currentConfig => ({
            ...currentConfig,
            placeholderMode: getNextValue(
              placeholderModes,
              currentConfig.placeholderMode,
            ),
          }))
        }
      />
      <Button
        title="Cycle hint color"
        onPress={() =>
          setConfig(currentConfig => ({
            ...currentConfig,
            hintColorMode: getNextValue(
              hintColorModes,
              currentConfig.hintColorMode,
            ),
          }))
        }
      />
      <Button
        title="Toggle toolbar integration"
        onPress={() =>
          setConfig(currentConfig => ({
            ...currentConfig,
            allowToolbarIntegration: !currentConfig.allowToolbarIntegration,
          }))
        }
      />
      <Button
        title="Restore default values"
        onPress={() => setConfig(defaultConfig)}
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
