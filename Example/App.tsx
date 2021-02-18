import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import {enableScreens} from 'react-native-screens';

import {MainScreen} from './src/screens';

enableScreens();

type MainStackParamList = {
  Main: undefined;
};

const MainStack = createStackNavigator<MainStackParamList>();

const App = (): JSX.Element => (
  <NavigationContainer>
    <MainStack.Navigator>
      <MainStack.Screen
        name="Main"
        options={{title: '📱 React Native Screens Examples'}}
        component={MainScreen}
      />
    </MainStack.Navigator>
  </NavigationContainer>
);

export default App;
