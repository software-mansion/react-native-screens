import React, { useEffect, useState } from 'react';
import { NavigationContainer, NavigationIndependentTree, NavigationProp } from '@react-navigation/native';
import * as Tests from './legacy-tests'
import { ScrollView, StyleSheet, useColorScheme } from 'react-native';
import { ListItem, SettingsSwitch } from '../shared';
import { ScreensDarkTheme, ScreensLightTheme } from '../shared/styling/adapter/react-navigation';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

const SCREENS: Record<
  string,
  {
    title: string;
    component: () => React.JSX.Element;
  }
> = {};

Object.keys(Tests).forEach(testName => {
  SCREENS[testName] = {
    title: testName,
    component: () => {
      const TestComponent = Tests[testName as keyof typeof Tests];
      return (
        <NavigationIndependentTree>
          <TestComponent />
        </NavigationIndependentTree>
      );
    },
  };
});

type LegacyTestStackParamList = {
  Main: undefined;
} & {
  [P in keyof typeof SCREENS]: undefined;
};

const issueRegex = /Test(?<issue>\d+)(?<case>.*)/

const screens = Object.keys(SCREENS)
  .sort((name1, name2) => {
    const spec1 = issueRegex.exec(name1)?.groups
    const spec2 = issueRegex.exec(name2)?.groups

    const testNumber1 = parseInt(spec1?.issue as string)
    const testNumber2 = parseInt(spec2?.issue as string)

    if (Number.isNaN(testNumber1) && Number.isNaN(testNumber2)) {
      return 0;
    } else if (Number.isNaN(testNumber1)) {
      return 1;
    } else if (Number.isNaN(testNumber2)) {
      return -1;
    } else if (testNumber1 !== testNumber2) {
      return testNumber1 - testNumber2;
    } else if ((spec1?.case as string) < (spec2?.case as string)) {
      return -1;
    } else {
      return (spec1?.case as string) > (spec2?.case as string) ? 1 : 0;
    }
  })

function MainScreen (props: { navigation: NavigationProp<LegacyTestStackParamList> }) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchBarEnabled, setSearchBarEnabled] = React.useState(false);

  const { navigation } = props;

  React.useLayoutEffect(() => {
    if (searchBarEnabled) {
      navigation.setOptions({
        headerSearchBarOptions: {
          onChangeText: (event) => setSearchQuery(event.nativeEvent.text),
        },
      });
    } else {
      setSearchQuery('');
      navigation.setOptions({
        headerSearchBarOptions: undefined,
      });
    }
  }, [navigation, searchBarEnabled]);

  const searchFilter = React.useCallback(
    (name: string) =>
      searchQuery === '' ||
      name.toLowerCase().includes(searchQuery.toLowerCase()),
    [searchQuery],
  );

  const filteredTests = screens.filter(searchFilter);

  return (
    <ScrollView testID="legacy-tests-scrollview" contentInsetAdjustmentBehavior="automatic">
      <SettingsSwitch
        style={styles.switch}
        label="Search bar"
        value={searchBarEnabled}
        onValueChange={() => setSearchBarEnabled(!searchBarEnabled)}
        testID="legacy-tests-search-bar"
      />
        {filteredTests.map(name => (
          <ListItem
            key={name}
            testID={`legacy-tests-${name}`}
            title={SCREENS[name].title}
            onPress={() => navigation.navigate(name)}
            disabled={false}
          />
        ))}
    </ScrollView>
  );
};

function LegacyTests() {
  const scheme = useColorScheme();
  const [isDark, setIsDark] = useState(scheme === 'dark');

  const Stack = createNativeStackNavigator<LegacyTestStackParamList>();

  useEffect(() => setIsDark(scheme === 'dark'), [scheme]);

  return (
    <NavigationIndependentTree>
      <NavigationContainer theme={isDark ? ScreensDarkTheme : ScreensLightTheme}>
        <Stack.Navigator
          screenOptions={{ statusBarStyle: isDark ? 'light' : 'dark' }}>
          <Stack.Screen
            name="Main"
            options={{ title: 'Legacy Tests' }}
            component={MainScreen}
          />
          {Object.keys(SCREENS).map(name => (
            <Stack.Screen
              key={name}
              name={name}
              getComponent={() => SCREENS[name].component}
              options={{ headerShown: false }}
            />
          ))}
        </Stack.Navigator>
      </NavigationContainer>
    </NavigationIndependentTree>
  );
};

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    margin: 10,
    marginTop: 15,
  },
  switch: {
    marginTop: 15,
  },
});

export default LegacyTests;