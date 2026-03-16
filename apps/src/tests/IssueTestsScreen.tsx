import React, { useEffect, useState } from 'react';
import {
  NavigationContainer,
  NavigationIndependentTree,
  NavigationProp,
} from '@react-navigation/native';
import * as Tests from './issue-tests';
import { ScrollView, useColorScheme } from 'react-native';
import { ListItem } from '../shared';
import {
  ScreensDarkTheme,
  ScreensLightTheme,
} from '../shared/styling/adapter/react-navigation';
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

type IssueTestsStackParamList = {
  Main: undefined;
} & {
  [P in keyof typeof SCREENS]: undefined;
};

const issueRegex = /Test(?<issue>\d+)(?<case>.*)/;

const screens = Object.keys(SCREENS).sort((name1, name2) => {
  const spec1 = issueRegex.exec(name1)?.groups;
  const spec2 = issueRegex.exec(name2)?.groups;

  const testNumber1 = parseInt(spec1?.issue as string, 10);
  const testNumber2 = parseInt(spec2?.issue as string, 10);

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
});

function MainScreen(props: {
  navigation: NavigationProp<IssueTestsStackParamList>;
}) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const { navigation } = props;

  React.useLayoutEffect(() => {
    navigation.setOptions({
      headerSearchBarOptions: {
        onChangeText: event => setSearchQuery(event.nativeEvent.text),
        placement: 'stacked',
        hideNavigationBar: false,
        obscureBackground: false,
        autoCapitalize: 'none',
        hideWhenScrolling: false,
      },
    });
  }, [navigation]);

  const searchFilter = React.useCallback(
    (name: string) =>
      searchQuery === '' ||
      name.toLowerCase().includes(searchQuery.toLowerCase()),
    [searchQuery],
  );

  const filteredTests = screens.filter(searchFilter);

  return (
    <ScrollView
      testID="issue-tests-scrollview"
      contentInsetAdjustmentBehavior="automatic">
      {filteredTests.map(name => (
        <ListItem
          key={name}
          testID={`issue-tests-${name}`}
          title={SCREENS[name].title}
          onPress={() => navigation.navigate(name)}
        />
      ))}
    </ScrollView>
  );
}

function IssueTests() {
  const scheme = useColorScheme();
  const [isDark, setIsDark] = useState(scheme === 'dark');

  const Stack = createNativeStackNavigator<IssueTestsStackParamList>();

  useEffect(() => setIsDark(scheme === 'dark'), [scheme]);

  return (
    <NavigationIndependentTree>
      <NavigationContainer
        theme={isDark ? ScreensDarkTheme : ScreensLightTheme}>
        <Stack.Navigator
          screenOptions={{ statusBarStyle: isDark ? 'light' : 'dark' }}>
          <Stack.Screen
            name="Main"
            options={{ title: 'Issue Tests' }}
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
}

export default IssueTests;
