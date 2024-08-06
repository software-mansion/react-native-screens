import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  ScrollView,
  StyleSheet,
  I18nManager,
  Platform,
  StatusBar,
  useColorScheme,
} from 'react-native';
import {
  DarkTheme,
  DefaultTheme,
  NavigationContainer,
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

import { enableFreeze } from 'react-native-screens';
import { GestureDetectorProvider } from 'react-native-screens/gesture-handler';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

enableFreeze();

if (Platform.OS === 'android') {
  StatusBar.setTranslucent(true);
}

const SCREENS: Record<
  string,
  {
    title: string;
    component: () => React.JSX.Element;
    type: 'example' | 'playground';
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
};

const isPlatformReady = (name: keyof typeof SCREENS) => {
  if (Platform.isTV) {
    return !!SCREENS[name].isTVOSReady;
  }

  return true;
};

const screens = Object.keys(SCREENS);
const examples = screens.filter(name => SCREENS[name].type === 'example');
const playgrounds = screens.filter(name => SCREENS[name].type === 'playground');

type RootStackParamList = {
  Main: undefined;
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

  return (
    <ScrollView testID="root-screen-examples-scrollview">
      <SettingsSwitch
        style={styles.switch}
        label="Right to left"
        value={I18nManager.isRTL}
        onValueChange={() => {
          I18nManager.forceRTL(!I18nManager.isRTL);
          RNRestart.Restart();
        }}
      />
      <SettingsSwitch
        style={styles.switch}
        label="Dark mode"
        value={isDark}
        onValueChange={toggleTheme}
      />
      <ThemedText style={styles.label} testID="root-screen-examples-header">
        Examples
      </ThemedText>
      {examples.map(name => (
        <ListItem
          key={name}
          testID={`root-screen-example-${name}`}
          title={SCREENS[name].title}
          onPress={() => navigation.navigate(name)}
          disabled={!isPlatformReady(name)}
        />
      ))}
      <ThemedText style={styles.label}>Playgrounds</ThemedText>
      {playgrounds.map(name => (
        <ListItem
          key={name}
          testID={`root-screen-playground-${name}`}
          title={SCREENS[name].title}
          onPress={() => navigation.navigate(name)}
          disabled={!isPlatformReady(name)}
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
          <NavigationContainer theme={isDark ? DarkTheme : DefaultTheme}>
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
