import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text } from 'react-native';

const BottomTab = createBottomTabNavigator();
const Tab1Stack = createStackNavigator();

const CastScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <Text style={{ marginBottom: 20, textAlign: 'center' }}>
      Add logging in `onDetachedFromWindow` in child Screen to see that method
      triggered twice without the changes
    </Text>
    <Text style={{ position: 'absolute', bottom: 0, alignSelf: 'flex-end' }}>
      ↓touch Tab2↓
    </Text>
  </View>
);

const Tab2Screen = () => <View />;

const Tab1StackNavigator = () => (
  <Tab1Stack.Navigator initialRouteName="CastScreen">
    <Tab1Stack.Screen name="CastScreen" component={CastScreen} />
  </Tab1Stack.Navigator>
);

const App = () => (
  <NavigationContainer>
    <BottomTab.Navigator initialRouteName="Tab1">
      <BottomTab.Screen name="Tab1" component={Tab1StackNavigator} />
      <BottomTab.Screen name="Tab2" component={Tab2Screen} />
    </BottomTab.Navigator>
  </NavigationContainer>
);

export default App;
