import React from 'react';
import { View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';

const Home = () => <View style={{ flex: 1 }} />;

const HomeStack = () => (
  <Stack.Navigator>
    <Stack.Screen
      // TODO: @t0maboro - add `disableHeaderTopInsetConsumption` to react-navigation after 4.25 release
      // @ts-ignore - this prop needs to be added to react-navigation
      options={{ disableHeaderTopInsetConsumption: true }}
      name="Home"
      component={Home}
    />
  </Stack.Navigator>
);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const App = () => (
  <NavigationContainer>
    <Tab.Navigator>
      <Tab.Screen
        name="HomeStack"
        component={HomeStack}
        options={{ tabBarButtonTestID: 'bottom-tabs-A-tab' }}
      />
    </Tab.Navigator>
  </NavigationContainer>
);

export default App;
