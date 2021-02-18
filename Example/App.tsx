import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {enableScreens} from 'react-native-screens';
import {createNativeStackNavigator} from 'react-native-screens/native-stack';

import {MainScreen, NativeStack} from './src/screens';

enableScreens();

const SCREENS = {
  NativeStack: {title: 'Native Stack', component: NativeStack},
};

type RootStackParamList = {
  Main: undefined;
} & {
  [P in keyof typeof SCREENS]: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

const App = (): JSX.Element => (
  <NavigationContainer>
    <Stack.Navigator>
      <Stack.Screen
        name="Main"
        options={{title: '📱 React Native Screens Examples'}}>
        {(props) => <MainScreen {...props} screens={SCREENS} />}
      </Stack.Screen>
      {(Object.keys(SCREENS) as (keyof typeof SCREENS)[]).map((name) => (
        <Stack.Screen
          key={name}
          name={name}
          getComponent={() => SCREENS[name].component}
          options={{title: SCREENS[name].title}}
        />
      ))}
    </Stack.Navigator>
  </NavigationContainer>
);

export default App;
