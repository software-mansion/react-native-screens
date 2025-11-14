import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  I18nManager,
  Platform,
  useColorScheme,
} from 'react-native';
import {
  NavigationContainer,
  NavigationIndependentTree,
  useTheme,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import RNRestart from 'react-native-restart';

import { ListItem, SettingsSwitch, ThemedText } from './src/shared';

import SimpleNativeStack from './src/screens/SimpleNativeStack';
import SwipeBackAnimation from './src/screens/SwipeBackAnimation';
import StackPresentation from './src/screens/StackPresentation';
import PreventRemove from './src/screens/PreventRemove';
import HeaderOptions from './src/screens/HeaderOptions';
import StatusBarExample from './src/screens/StatusBar';
import Animations from './src/screens/Animations';
import BottomTabsAndStack from './src/screens/BottomTabsAndStack';
import Modals from './src/screens/Modals';
import Orientation from './src/screens/Orientation';
import SearchBar from './src/screens/SearchBar';
import Events from './src/screens/Events';
import Gestures from './src/screens/Gestures';
import BarButtonItems from './src/screens/BarButtonItems';

import { GestureDetectorProvider } from 'react-native-screens/gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

import * as Tests from './src/tests';
import { ScreensDarkTheme, ScreensLightTheme } from './src/shared/styling/adapter/react-navigation';

function isPlatformReady(name: keyof typeof SCREENS) {
  if (Platform.isTV) {
    return !!SCREENS[name].isTVOSReady;
  }

  return true;
}

function isTestSectionEnabled() {
  return true;
}

const SCREENS: Record<
  string,
  {
    title: string;
    component: () => React.JSX.Element;
    type: 'example' | 'playground' | 'test';
    isTVOSReady?: boolean;
  }
> = {
  SimpleNativeStack: {
    title: 'Simple Native Stack',
    component: SimpleNativeStack,
    type: 'example',
    isTVOSReady: true,
  },
  SwipeBackAnimation: {
    title: 'Swipe Back Animation',
    component: SwipeBackAnimation,
    type: 'example',
  },
  StackPresentation: {
    title: 'Stack Presentation',
    component: StackPresentation,
    type: 'example',
    isTVOSReady: true,
  },
  BottomTabsAndStack: {
    title: 'Bottom tabs and native stack',
    component: BottomTabsAndStack,
    type: 'example',
    isTVOSReady: true,
  },
  Modals: {
    title: 'Modals',
    component: Modals,
    type: 'example',
    isTVOSReady: true,
  },
  PreventRemove: {
    title: 'Prevent Remove',
    component: PreventRemove,
    type: 'example',
  },
  HeaderOptions: {
    title: 'Header Options',
    component: HeaderOptions,
    type: 'playground',
  },
  StatusBar: {
    title: 'Status bar',
    component: StatusBarExample,
    type: 'playground',
  },
  Animations: {
    title: 'Animations',
    component: Animations,
    type: 'playground',
  },
  Orientation: {
    title: 'Orientation',
    component: Orientation,
    type: 'playground',
  },
  SearchBar: {
    title: 'Search bar',
    component: SearchBar,
    type: 'playground',
  },
  Events: {
    title: 'Events',
    component: Events,
    type: 'playground',
  },
  Gestures: {
    title: 'Gestures',
    component: Gestures,
    type: 'playground',
  },
  BarButtonItems: {
    title: 'Bar Button Items',
    component: BarButtonItems,
    type: 'playground',
  },
};

if (isTestSectionEnabled()) {
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
      type: 'test',
    };
  });
}

const screens = Object.keys(SCREENS);
const examples = screens.filter(name => SCREENS[name].type === 'example');
const playgrounds = screens.filter(name => SCREENS[name].type === 'playground');
const issueRegex = /Test(?<issue>\d+)(?<case>.*)/
const tests = isTestSectionEnabled()
  ? screens
    .filter(name => SCREENS[name].type === 'test')
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
  : [];

type RootStackParamList = {
  Main: undefined;
  Tests: undefined;
} & {
  [P in keyof typeof SCREENS]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface MainScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Main'>;
}

const MainScreen = ({ navigation }: MainScreenProps): React.JSX.Element => {
  const { toggleTheme } = useContext(ThemeToggle);
  const isDark = useTheme().dark;
  const [searchQuery, setSearchQuery] = React.useState('');
  const [searchBarEnabled, setSearchBarEnabled] = React.useState(false);

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

  const filteredExamples = examples.filter(searchFilter);
  const filteredPlaygrounds = playgrounds.filter(searchFilter);
  const filteredTests = tests.filter(searchFilter);

  return (
    <ScrollView testID="root-screen-examples-scrollview" contentInsetAdjustmentBehavior="automatic">
      <SettingsSwitch
        style={styles.switch}
        label="Right to left"
        value={I18nManager.isRTL}
        onValueChange={() => {
          I18nManager.forceRTL(!I18nManager.isRTL);
          RNRestart.Restart();
        }}
        testID="root-screen-switch-rtl"
      />
      <SettingsSwitch
        style={styles.switch}
        label="Dark mode"
        value={isDark}
        onValueChange={toggleTheme}
      />
      <SettingsSwitch
        style={styles.switch}
        label="Search bar"
        value={searchBarEnabled}
        onValueChange={() => setSearchBarEnabled(!searchBarEnabled)}
        testID="root-screen-switch-search-bar"
      />
      <ThemedText style={styles.label} testID="root-screen-examples-header">
        Examples
      </ThemedText>
      {filteredExamples.map(name => (
        <ListItem
          key={name}
          testID={`root-screen-example-${name}`}
          title={SCREENS[name].title}
          onPress={() => navigation.navigate(name)}
          disabled={!isPlatformReady(name)}
        />
      ))}
      <ThemedText style={styles.label}>Playgrounds</ThemedText>
      {filteredPlaygrounds.map(name => (
        <ListItem
          key={name}
          testID={`root-screen-playground-${name}`}
          title={SCREENS[name].title}
          onPress={() => navigation.navigate(name)}
          disabled={!isPlatformReady(name)}
        />
      ))}
      {isTestSectionEnabled() && (
        <ThemedText style={styles.label}>Tests</ThemedText>
      )}
      {isTestSectionEnabled() &&
        filteredTests.map(name => (
          <ListItem
            key={name}
            testID={`root-screen-tests-${name}`}
            title={SCREENS[name].title}
            onPress={() => navigation.navigate(name)}
            disabled={false}
          />
        ))}
    </ScrollView>
  );
};

const ThemeToggle = createContext<{ toggleTheme: () => void }>(null!);

const ExampleApp = (): React.JSX.Element => {
  const scheme = useColorScheme();
  const [isDark, setIsDark] = useState(scheme === 'dark');

  useEffect(() => setIsDark(scheme === 'dark'), [scheme]);

  const toggleTheme = () => setIsDark(prev => !prev);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <GestureDetectorProvider>
        <ThemeToggle.Provider value={{ toggleTheme }}>
          <NavigationContainer theme={isDark ? ScreensDarkTheme : ScreensLightTheme}>
            <Stack.Navigator
              screenOptions={{ statusBarStyle: isDark ? 'light' : 'dark' }}>
              <Stack.Screen
                name="Main"
                options={{
                  title: `${Platform.isTV ? '📺' : '📱'
                    } React Native Screens Examples`,
                }}
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
        </ThemeToggle.Provider>
      </GestureDetectorProvider>
    </GestureHandlerRootView>
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

export default ExampleApp;
