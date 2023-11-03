import React from 'react';
import {
  ScrollView,
  StyleSheet,
  Text,
  I18nManager,
  Platform,
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import RNRestart from 'react-native-restart';

import { ListItem, SettingsSwitch } from './src/shared';

import SimpleNativeStack from './src/screens/SimpleNativeStack';
import SwipeBackAnimation from './src/screens/SwipeBackAnimation';
import StackPresentation from './src/screens/StackPresentation';
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
    component: () => JSX.Element;
    type: 'example' | 'playground';
  }
> = {
  SimpleNativeStack: {
    title: 'Simple Native Stack',
    component: SimpleNativeStack,
    type: 'example',
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
  },
  BottomTabsAndStack: {
    title: 'Bottom tabs and native stack',
    component: BottomTabsAndStack,
    type: 'example',
  },
  Modals: {
    title: 'Modals',
    component: Modals,
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

type RootStackParamList = {
  Main: undefined;
} & {
  [P in keyof typeof SCREENS]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

interface MainScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Main'>;
}

const MainScreen = ({ navigation }: MainScreenProps): JSX.Element => (
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
    <Text style={styles.label} testID="root-screen-examples-header">
      Examples
    </Text>
    {Object.keys(SCREENS)
      .filter(name => SCREENS[name].type === 'example')
      .map(name => (
        <ListItem
          key={name}
          testID={`root-screen-example-${name}`}
          title={SCREENS[name].title}
          onPress={() => navigation.navigate(name)}
        />
      ))}
    <Text style={styles.label}>Playgrounds</Text>
    {Object.keys(SCREENS)
      .filter(name => SCREENS[name].type === 'playground')
      .map(name => (
        <ListItem
          key={name}
          testID={`root-screen-playground-${name}`}
          title={SCREENS[name].title}
          onPress={() => navigation.navigate(name)}
        />
      ))}
  </ScrollView>
);

const ExampleApp = (): JSX.Element => (
  <GestureHandlerRootView style={{ flex: 1 }}>
    <GestureDetectorProvider>
      <NavigationContainer>
        <Stack.Navigator
          screenOptions={{
            direction: I18nManager.isRTL ? 'rtl' : 'ltr',
          }}>
          <Stack.Screen
            name="Main"
            options={{ title: '📱 React Native Screens Examples' }}
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
    </GestureDetectorProvider>
  </GestureHandlerRootView>
);

const styles = StyleSheet.create({
  label: {
    fontSize: 15,
    color: 'black',
    margin: 10,
    marginTop: 15,
  },
  switch: {
    marginTop: 15,
  },
});

export default ExampleApp;
