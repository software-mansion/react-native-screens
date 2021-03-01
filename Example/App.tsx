import React from 'react';
import {ScrollView, SafeAreaView} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  createStackNavigator,
  StackNavigationProp,
} from '@react-navigation/stack';

import {MenuItem} from './src/shared';

import SimpleNativeStack from './src/screens/SimpleNativeStack';
import NativeNavigation from './src/screens/NativeNavigation';
import StackPresentation from './src/screens/StackPresentation';
import HeaderOptions from './src/screens/HeaderOptions';
import StatusBar from './src/screens/StatusBar';
import Animations from './src/screens/Animations';
import BottomTabsAndStack from './src/screens/BottomTabsAndStack';
import StackReactNavigation4 from './src/screens/StackReactNavigation4';

const SCREENS: Record<string, {title: string; component: () => JSX.Element}> = {
  SimpleNativeStack: {
    title: 'Simple Native Stack',
    component: SimpleNativeStack,
  },
  NativeNavigation: {title: 'Native Navigation', component: NativeNavigation},
  StackPresentation: {
    title: 'Stack Presentation',
    component: StackPresentation,
  },
  HeaderOptions: {title: 'Header Options', component: HeaderOptions},
  StatusBar: {title: 'Status bar (iOS)', component: StatusBar},
  Animations: {title: 'Animations', component: Animations},
  BottomTabsAndStack: {
    title: 'Bottom tabs and native stack',
    component: BottomTabsAndStack,
  },
  StackReactNavigation4: {
    title: 'Stack Example react-navigation v4',
    // @ts-ignore react-navigation v4 AppNavigator type
    component: StackReactNavigation4,
  },
};

type RootStackParamList = {
  Main: undefined;
} & {
  [P in keyof typeof SCREENS]: undefined;
};

const Stack = createStackNavigator<RootStackParamList>();

interface MainScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Main'>;
}

const MainScreen = ({navigation}: MainScreenProps): JSX.Element => (
  <ScrollView>
    <SafeAreaView>
      {Object.keys(SCREENS).map((name) => (
        <MenuItem
          key={name}
          title={SCREENS[name].title}
          onPress={() => navigation.navigate(name)}
        />
      ))}
    </SafeAreaView>
  </ScrollView>
);

const ExampleApp = (): JSX.Element => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        options={{title: '📱 React Native Screens Examples'}}
        component={MainScreen}
      />
      {Object.keys(SCREENS).map((name) => (
        <Stack.Screen
          key={name}
          name={name}
          getComponent={() => SCREENS[name].component}
          options={{headerShown: false}}
        />
      ))}
    </Stack.Navigator>
  </NavigationContainer>
);

export default ExampleApp;
