import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from 'react-native-screens/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { View, Text, Button } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const ParentStack = createNativeStackNavigator();
const BottomTab = createBottomTabNavigator();
const ChildStack = createNativeStackNavigator();
const Tab1Stack = createNativeStackNavigator();

const DummyContent = () => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
      }}>
      <Text style={{ marginBottom: 20, textAlign: 'center' }}>Child Stack</Text>
      <Button title="Go Back" onPress={() => navigation.goBack()} />
    </View>
  );
};

const ChildStackScreen = () => (
  <ChildStack.Navigator
    screenOptions={{ headerShown: false, headerLargeTitle: false }}>
    <Tab1Stack.Screen name="ChildStack" component={BottomStackScreen} />
  </ChildStack.Navigator>
);

const Another = () => (
  <ChildStack.Navigator
    screenOptions={{ headerShown: true, headerLargeTitle: false }}>
    <Tab1Stack.Screen name="ChildStack1" component={InitialScreen} />
  </ChildStack.Navigator>
);

const AnotherBottomTabs = () => (
  <BottomTab.Navigator
    screenOptions={{ headerShown: false }}
    detachInactiveScreens={true}>
    <BottomTab.Screen name="Tab2" component={ChildStackScreen} />
  </BottomTab.Navigator>
);

const BottomStackScreen = () => (
  <BottomTab.Navigator
    screenOptions={{ headerShown: false }}
    detachInactiveScreens={true}>
    <BottomTab.Screen name="Tab1" component={Another} />
  </BottomTab.Navigator>
);

const InitialScreen = () => {
  const navigation = useNavigation();

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'red',
      }}>
      <Button title="Click" onPress={() => navigation.navigate('Bottom')} />
    </View>
  );
};

const App = () => (
  <NavigationContainer>
    <ParentStack.Navigator>
      <ParentStack.Screen
        name="Initial"
        component={BottomStackScreen}
        options={{
          headerShown: false,
          stackAnimation: 'default' /** set none to fix */,
        }}
      />
      <ParentStack.Screen
        name="Bottom"
        component={ChildStackScreen}
        options={{ headerShown: false }}></ParentStack.Screen>
    </ParentStack.Navigator>
  </NavigationContainer>
);

export default App;
